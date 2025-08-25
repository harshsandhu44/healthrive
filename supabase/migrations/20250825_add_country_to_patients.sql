-- Add country column to patients table
ALTER TABLE patients ADD COLUMN country TEXT;

-- Add index for country field for potential filtering
CREATE INDEX IF NOT EXISTS idx_patients_country ON patients(country);