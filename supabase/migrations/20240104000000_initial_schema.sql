-- Initial schema for Healthrive healthcare management system
-- All tables include organization_id for multi-tenancy (managed by Clerk)

-- Patients table (main entity)
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL, -- Clerk org_id, no foreign key
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')),
  address TEXT,
  phone TEXT,
  email TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  smoking_status TEXT,
  alcohol_consumption TEXT,
  allergies TEXT[],
  family_history TEXT[],
  status TEXT DEFAULT 'active',
  registration_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical records tables
CREATE TABLE diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  code TEXT,
  description TEXT,
  date_of_diagnosis TIMESTAMP WITH TIME ZONE,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  route TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  code TEXT,
  description TEXT,
  date_of_procedure TIMESTAMP WITH TIME ZONE,
  provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  test_name TEXT,
  result TEXT,
  units TEXT,
  reference_range TEXT,
  date_of_test TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  date_time TIMESTAMP WITH TIME ZONE,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  temperature DECIMAL,
  respiratory_rate INTEGER,
  weight DECIMAL,
  height DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  date_time TIMESTAMP WITH TIME ZONE,
  note_type TEXT,
  content TEXT,
  provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL, -- Clerk org_id, no foreign key
  name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  specialization TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL, -- Clerk org_id, no foreign key
  patient_name TEXT NOT NULL,
  patient_id TEXT REFERENCES patients(id),
  time TIMESTAMP WITH TIME ZONE,
  type TEXT,
  status TEXT,
  doctor TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance (organization_id filtering)
CREATE INDEX idx_patients_org ON patients(organization_id);
CREATE INDEX idx_doctors_org ON doctors(organization_id);
CREATE INDEX idx_appointments_org ON appointments(organization_id);
CREATE INDEX idx_diagnoses_patient ON diagnoses(patient_id);
CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_procedures_patient ON procedures(patient_id);
CREATE INDEX idx_lab_results_patient ON lab_results(patient_id);
CREATE INDEX idx_vital_signs_patient ON vital_signs(patient_id);
CREATE INDEX idx_clinical_notes_patient ON clinical_notes(patient_id);

-- Add updated_at trigger for patients
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

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();