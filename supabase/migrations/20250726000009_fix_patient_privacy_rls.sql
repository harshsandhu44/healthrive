-- Fix critical patient data organization scoping vulnerability in RLS policies
-- This migration implements proper HIPAA-compliant patient data access controls

-- Drop the overly permissive existing policies
DROP POLICY IF EXISTS "Allow all authenticated users to read patients" ON patients;
DROP POLICY IF EXISTS "Allow all authenticated users to insert patients" ON patients;
DROP POLICY IF EXISTS "Allow all authenticated users to update patients" ON patients;
DROP POLICY IF EXISTS "Allow all authenticated users to delete patients" ON patients;

-- Create organization-scoped patient access policies
-- Patients can only be accessed by users in organizations where the patient has appointments

-- READ: Users can only see patients with appointments in their organization
CREATE POLICY "Organization scoped patient read access" ON patients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM appointments 
            WHERE appointments.patient_id = patients.id 
            AND appointments.org_id = auth.jwt() ->> 'org_id'
        )
    );

-- INSERT: Users can create patients (they will be linked via appointments)
CREATE POLICY "Authenticated users can create patients" ON patients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: Users can only update patients with appointments in their organization
CREATE POLICY "Organization scoped patient update access" ON patients
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM appointments 
            WHERE appointments.patient_id = patients.id 
            AND appointments.org_id = auth.jwt() ->> 'org_id'
        )
    );

-- DELETE: Users can only delete patients with appointments in their organization
-- Note: In healthcare, deletion should be rare - consider soft deletes instead
CREATE POLICY "Organization scoped patient delete access" ON patients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM appointments 
            WHERE appointments.patient_id = patients.id 
            AND appointments.org_id = auth.jwt() ->> 'org_id'
        )
    );

-- Add composite index for better performance on organization-scoped queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_org_patient 
ON appointments(org_id, patient_id);

-- Add index for full text search across patient data (for organization-scoped searches)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_search 
ON patients USING gin(
    to_tsvector('english', 
        coalesce(full_name, '') || ' ' || 
        coalesce(email, '') || ' ' || 
        coalesce(phone_number, '')
    )
);

-- Add function to check if user can access patient data
CREATE OR REPLACE FUNCTION user_can_access_patient(patient_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM appointments 
        WHERE appointments.patient_id = $1 
        AND appointments.org_id = auth.jwt() ->> 'org_id'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION user_can_access_patient(TEXT) TO authenticated;