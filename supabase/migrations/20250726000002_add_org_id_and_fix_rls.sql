-- Add org_id column to doctors table
ALTER TABLE doctors ADD COLUMN org_id TEXT;

-- Create an index on org_id for filtering
CREATE INDEX idx_doctors_org_id ON doctors(org_id);

-- Drop the existing RLS policy
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON doctors;

-- Create a more permissive RLS policy for development
-- In production, you would want to restrict this based on organization membership
CREATE POLICY "Enable all operations for authenticated users" ON doctors
  FOR ALL USING (true);