-- Create notification types enum
CREATE TYPE notification_type AS ENUM ('appointment_reminder', 'system', 'general');

-- Create notifications table with push notification support
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id TEXT REFERENCES appointments(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  push_sent BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_notifications_unsent ON notifications(scheduled_for, push_sent) WHERE push_sent = FALSE;
CREATE INDEX idx_notifications_appointment ON notifications(appointment_id) WHERE appointment_id IS NOT NULL;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can insert notifications (for scheduled reminders)
CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Function to create appointment reminder notification
CREATE OR REPLACE FUNCTION create_appointment_notification(
  p_user_id UUID,
  p_appointment_id TEXT,
  p_patient_name TEXT,
  p_appointment_time TIMESTAMPTZ
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
  reminder_time TIMESTAMPTZ;
BEGIN
  -- Calculate reminder time (5 minutes before appointment)
  reminder_time := p_appointment_time - INTERVAL '5 minutes';
  
  -- Only create notification if reminder time is in the future
  IF reminder_time <= NOW() THEN
    RETURN NULL;
  END IF;
  
  -- Delete any existing notification for this appointment
  DELETE FROM notifications 
  WHERE appointment_id = p_appointment_id 
  AND type = 'appointment_reminder';
  
  -- Create the notification
  INSERT INTO notifications (
    id,
    user_id,
    appointment_id,
    type,
    title,
    message,
    scheduled_for,
    data,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    p_user_id,
    p_appointment_id,
    'appointment_reminder',
    'Upcoming Appointment',
    'Appointment with ' || p_patient_name || ' in 5 minutes',
    reminder_time,
    jsonb_build_object(
      'patient_name', p_patient_name,
      'appointment_time', p_appointment_time,
      'url', '/appointments'
    ),
    NOW(),
    NOW()
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get due notifications that need to be sent
CREATE OR REPLACE FUNCTION get_due_notifications()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  appointment_id TEXT,
  type notification_type,
  title TEXT,
  message TEXT,
  data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.user_id,
    n.appointment_id,
    n.type,
    n.title,
    n.message,
    n.data
  FROM notifications n
  WHERE n.scheduled_for <= NOW()
    AND n.push_sent = FALSE
    AND n.scheduled_for IS NOT NULL
  ORDER BY n.scheduled_for ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notifications as sent
CREATE OR REPLACE FUNCTION mark_notifications_as_sent(notification_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE notifications 
  SET 
    push_sent = TRUE,
    sent_at = NOW(),
    updated_at = NOW()
  WHERE id = ANY(notification_ids);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_as_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications 
  SET 
    read_at = NOW(),
    updated_at = NOW()
  WHERE id = p_notification_id 
    AND user_id = p_user_id
    AND read_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old notifications (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND (sent_at IS NOT NULL OR push_sent = TRUE);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_appointment_notification(UUID, TEXT, TEXT, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION get_due_notifications() TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notifications_as_sent(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_as_read(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_notifications() TO authenticated;