-- Add reminder notification tracking columns to appointments table
ALTER TABLE appointments 
ADD COLUMN reminder_notification_id UUID REFERENCES notifications(id) ON DELETE SET NULL,
ADD COLUMN provider_reminder_notification_id UUID REFERENCES notifications(id) ON DELETE SET NULL;

-- Add index for better performance on reminder lookups
CREATE INDEX IF NOT EXISTS idx_appointments_reminder_notifications ON appointments(reminder_notification_id) 
WHERE reminder_notification_id IS NOT NULL;

-- Update the status check constraint to include 'scheduled'
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments 
ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('pending', 'confirmed', 'scheduled', 'completed', 'cancelled'));