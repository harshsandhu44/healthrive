-- Create appointments table with custom ID format: ap-xxxx
-- Links to patients (pt-xxxx) and doctors (dr-xxxx)

-- Function to generate custom appointment ID
CREATE OR REPLACE FUNCTION generate_appointment_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        new_id := 'ap-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        done := NOT EXISTS(SELECT 1 FROM appointments WHERE id = new_id);
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create appointments table
CREATE TABLE appointments (
    id TEXT PRIMARY KEY DEFAULT generate_appointment_id(),
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    datetime TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    org_id TEXT NOT NULL, -- Organization that created the appointment
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_appointments_patient_id FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_datetime ON appointments(datetime);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_org_id ON appointments(org_id);

-- Combined index for org-specific queries
CREATE INDEX idx_appointments_org_datetime ON appointments(org_id, datetime);

-- Enable RLS (organization-scoped access)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see appointments from their organization
CREATE POLICY "Users can only see appointments from their organization" ON appointments
    FOR SELECT USING (org_id = auth.jwt() ->> 'org_id');

-- RLS Policy: Users can only insert appointments for their organization
CREATE POLICY "Users can only insert appointments for their organization" ON appointments
    FOR INSERT WITH CHECK (org_id = auth.jwt() ->> 'org_id');

-- RLS Policy: Users can only update appointments from their organization
CREATE POLICY "Users can only update appointments from their organization" ON appointments
    FOR UPDATE USING (org_id = auth.jwt() ->> 'org_id');

-- RLS Policy: Users can only delete appointments from their organization
CREATE POLICY "Users can only delete appointments from their organization" ON appointments
    FOR DELETE USING (org_id = auth.jwt() ->> 'org_id');

-- Trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();