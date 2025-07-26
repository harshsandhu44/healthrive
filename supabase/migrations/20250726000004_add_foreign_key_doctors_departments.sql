-- Add foreign key constraint between doctors.department_id and departments.id
-- This allows Supabase to understand the relationship for joins

-- First, update any NULL department_id values that might cause issues
-- (This is safe since department_id is optional)

-- Add the foreign key constraint
ALTER TABLE doctors 
ADD CONSTRAINT fk_doctors_department_id 
FOREIGN KEY (department_id) 
REFERENCES departments(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;