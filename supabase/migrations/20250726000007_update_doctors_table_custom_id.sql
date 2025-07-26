-- Update doctors table to use custom ID format: dr-xxxx
-- This migration will convert existing UUIDs to the new format

-- Function to generate custom doctor ID
CREATE OR REPLACE FUNCTION generate_doctor_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        new_id := 'dr-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        done := NOT EXISTS(SELECT 1 FROM doctors WHERE id = new_id);
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- First, we need to drop the foreign key constraint from appointments
-- (if it exists from a previous migration attempt)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_appointments_doctor_id'
    ) THEN
        ALTER TABLE appointments DROP CONSTRAINT fk_appointments_doctor_id;
    END IF;
END $$;

-- Create a temporary mapping table
CREATE TEMP TABLE doctor_id_mapping AS 
SELECT id as old_id, generate_doctor_id() as new_id 
FROM doctors;

-- Update doctors table with new IDs
UPDATE doctors 
SET id = doctor_id_mapping.new_id 
FROM doctor_id_mapping 
WHERE doctors.id = doctor_id_mapping.old_id;

-- Update any existing appointment records to use new doctor IDs
-- (This will be empty initially but good for future consistency)
UPDATE appointments 
SET doctor_id = doctor_id_mapping.new_id 
FROM doctor_id_mapping 
WHERE appointments.doctor_id = doctor_id_mapping.old_id;

-- Now change the default for new doctors to use the custom ID generator
ALTER TABLE doctors ALTER COLUMN id SET DEFAULT generate_doctor_id();

-- Re-establish the foreign key constraint for appointments
ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_doctor_id 
FOREIGN KEY (doctor_id) 
REFERENCES doctors(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;