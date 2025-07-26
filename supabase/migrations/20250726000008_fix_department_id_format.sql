-- Fix department ID format to use custom dpt-xxxx pattern instead of dpt-<uuid>

-- Function to generate custom department ID
CREATE OR REPLACE FUNCTION generate_department_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        new_id := 'dpt-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        done := NOT EXISTS(SELECT 1 FROM departments WHERE id = new_id);
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- First, we need to drop the foreign key constraint from doctors
-- (if it exists from a previous migration)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_doctors_department_id'
    ) THEN
        ALTER TABLE doctors DROP CONSTRAINT fk_doctors_department_id;
    END IF;
END $$;

-- Create a temporary mapping table for existing departments
CREATE TEMP TABLE department_id_mapping AS 
SELECT id as old_id, generate_department_id() as new_id 
FROM departments;

-- Update departments table with new IDs
UPDATE departments 
SET id = department_id_mapping.new_id 
FROM department_id_mapping 
WHERE departments.id = department_id_mapping.old_id;

-- Update any existing doctor records to use new department IDs
UPDATE doctors 
SET department_id = department_id_mapping.new_id 
FROM department_id_mapping 
WHERE doctors.department_id = department_id_mapping.old_id;

-- Now change the default for new departments to use the custom ID generator
ALTER TABLE departments ALTER COLUMN id SET DEFAULT generate_department_id();

-- Re-establish the foreign key constraint for doctors
ALTER TABLE doctors 
ADD CONSTRAINT fk_doctors_department_id 
FOREIGN KEY (department_id) 
REFERENCES departments(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;