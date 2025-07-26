-- Create doctors table
CREATE TABLE doctors (
  id TEXT PRIMARY KEY DEFAULT ('doc-' || gen_random_uuid()::text),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'rather not say')) NOT NULL,
  department_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on name for faster searches
CREATE INDEX idx_doctors_name ON doctors(name);

-- Create an index on specialization for filtering
CREATE INDEX idx_doctors_specialization ON doctors(specialization);

-- Create an index on department_id for filtering
CREATE INDEX idx_doctors_department_id ON doctors(department_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- Note: In a real application, you would want more restrictive policies based on organization membership
CREATE POLICY "Enable all operations for authenticated users" ON doctors
  FOR ALL USING (auth.role() = 'authenticated');