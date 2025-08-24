-- Create patients table with ULID primary key
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone_number TEXT NOT NULL,
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  medical_history JSONB DEFAULT '{}',
  address TEXT,
  city TEXT,
  state TEXT,
  post_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone_number);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies - users can only access their own patients
CREATE POLICY "Users can view own patients" ON patients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patients" ON patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patients" ON patients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patients" ON patients
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();