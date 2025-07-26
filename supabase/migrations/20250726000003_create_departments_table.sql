-- Create departments table
CREATE TABLE departments (
  id TEXT PRIMARY KEY DEFAULT ('dpt-' || gen_random_uuid()::text),
  name TEXT NOT NULL,
  org_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on name for faster searches
CREATE INDEX idx_departments_name ON departments(name);

-- Create an index on org_id for filtering
CREATE INDEX idx_departments_org_id ON departments(org_id);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON departments
  FOR ALL USING (true);