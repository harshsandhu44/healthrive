-- Create patients table (no org_id - accessible by all organizations)
-- Custom ID format: pt-xxxx

-- Function to generate custom patient ID
CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        new_id := 'pt-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        done := NOT EXISTS(SELECT 1 FROM patients WHERE id = new_id);
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create patients table
CREATE TABLE patients (
    id TEXT PRIMARY KEY DEFAULT generate_patient_id(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    medical_records JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint on phone_number if provided
CREATE UNIQUE INDEX idx_patients_phone_number ON patients(phone_number) WHERE phone_number IS NOT NULL;

-- Create index for searching by email
CREATE INDEX idx_patients_email ON patients(email) WHERE email IS NOT NULL;

-- Create index for full text search on name
CREATE INDEX idx_patients_full_name ON patients USING gin(to_tsvector('english', full_name));

-- Enable RLS (but allow all organizations to access)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all authenticated users to read patients
CREATE POLICY "Allow all authenticated users to read patients" ON patients
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policy: Allow all authenticated users to insert patients
CREATE POLICY "Allow all authenticated users to insert patients" ON patients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Allow all authenticated users to update patients
CREATE POLICY "Allow all authenticated users to update patients" ON patients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policy: Allow all authenticated users to delete patients
CREATE POLICY "Allow all authenticated users to delete patients" ON patients
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();