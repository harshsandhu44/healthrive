-- Enable pg_cron extension for database-level scheduling
-- This replaces expensive external cron jobs with free database scheduling

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to process due notifications (replaces /api/cron/notifications)
CREATE OR REPLACE FUNCTION process_due_notifications()
RETURNS INTEGER AS $$
DECLARE
  notification_record RECORD;
  notification_count INTEGER := 0;
  endpoint_url TEXT;
BEGIN
  -- Get base URL for Edge Function calls
  endpoint_url := current_setting('app.base_url', true) || '/api/push-notifications/send';
  
  -- Process all due notifications
  FOR notification_record IN 
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
    ORDER BY n.scheduled_for ASC
  LOOP
    BEGIN
      -- Call Edge Function to send push notification
      PERFORM net.http_post(
        url := endpoint_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
        ),
        body := jsonb_build_object(
          'userId', notification_record.user_id,
          'payload', jsonb_build_object(
            'title', notification_record.title,
            'body', notification_record.message,
            'tag', 'appointment-' || notification_record.appointment_id,
            'data', notification_record.data
          )
        )
      );
      
      -- Mark notification as sent
      UPDATE notifications 
      SET 
        push_sent = TRUE,
        sent_at = NOW(),
        updated_at = NOW()
      WHERE id = notification_record.id;
      
      notification_count := notification_count + 1;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error but continue processing other notifications
      RAISE WARNING 'Failed to process notification %: %', notification_record.id, SQLERRM;
    END;
  END LOOP;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- Function to schedule appointment reminders (replaces /api/cron/schedule)
CREATE OR REPLACE FUNCTION schedule_appointment_reminders()
RETURNS INTEGER AS $$
DECLARE
  appointment_record RECORD;
  reminder_time TIMESTAMPTZ;
  scheduled_count INTEGER := 0;
  patient_notification_id UUID;
  provider_notification_id UUID;
BEGIN
  -- Get appointments that need reminder scheduling
  FOR appointment_record IN 
    SELECT 
      a.id,
      a.patient_id,
      a.user_id,
      a.datetime,
      a.appointment_type,
      a.status,
      p.name as patient_name
    FROM appointments a
    LEFT JOIN patients p ON p.id = a.patient_id
    WHERE a.status = 'scheduled'
      AND a.datetime >= NOW() + INTERVAL '6 hours'  -- Next 6 hours minimum
      AND a.datetime <= NOW() + INTERVAL '24 hours' -- Next 24 hours maximum
      AND a.reminder_notification_id IS NULL        -- No reminder already scheduled
  LOOP
    BEGIN
      -- Calculate reminder time (5 minutes before appointment)
      reminder_time := appointment_record.datetime - INTERVAL '5 minutes';
      
      -- Skip if reminder time is in the past
      IF reminder_time <= NOW() THEN
        CONTINUE;
      END IF;
      
      -- Create notification for patient
      INSERT INTO notifications (
        user_id,
        appointment_id,
        type,
        title,
        message,
        scheduled_for,
        data
      ) VALUES (
        appointment_record.patient_id,
        appointment_record.id,
        'appointment_reminder',
        'Upcoming Appointment Reminder',
        'Your appointment is scheduled in 5 minutes.',
        reminder_time,
        jsonb_build_object(
          'appointment_id', appointment_record.id,
          'appointment_type', appointment_record.appointment_type,
          'appointment_time', appointment_record.datetime,
          'patient_name', appointment_record.patient_name
        )
      ) RETURNING id INTO patient_notification_id;
      
      -- Create notification for provider
      INSERT INTO notifications (
        user_id,
        appointment_id,
        type,
        title,
        message,
        scheduled_for,
        data
      ) VALUES (
        appointment_record.user_id,
        'appointment_reminder',
        'Upcoming Appointment Reminder',
        'You have an appointment starting in 5 minutes.',
        reminder_time,
        jsonb_build_object(
          'appointment_id', appointment_record.id,
          'appointment_type', appointment_record.appointment_type,
          'appointment_time', appointment_record.datetime,
          'patient_name', appointment_record.patient_name
        )
      ) RETURNING id INTO provider_notification_id;
      
      -- Update appointment with reminder notification IDs
      UPDATE appointments 
      SET 
        reminder_notification_id = patient_notification_id,
        provider_reminder_notification_id = provider_notification_id,
        updated_at = NOW()
      WHERE id = appointment_record.id;
      
      scheduled_count := scheduled_count + 1;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error but continue processing other appointments
      RAISE WARNING 'Failed to schedule reminder for appointment %: %', appointment_record.id, SQLERRM;
    END;
  END LOOP;
  
  RETURN scheduled_count;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old notifications (run daily)
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

-- Schedule the cron jobs using pg_cron
-- Process due notifications every 5 minutes
SELECT cron.schedule(
  'process-due-notifications',
  '*/5 * * * *',
  $$SELECT process_due_notifications();$$
);

-- Schedule appointment reminders every hour
SELECT cron.schedule(
  'schedule-appointment-reminders',
  '0 * * * *',
  $$SELECT schedule_appointment_reminders();$$
);

-- Cleanup old notifications daily at 2 AM
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 2 * * *',
  $$SELECT cleanup_old_notifications();$$
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION process_due_notifications() TO authenticated;
GRANT EXECUTE ON FUNCTION schedule_appointment_reminders() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_notifications() TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_scheduling 
ON appointments(status, datetime, reminder_notification_id) 
WHERE status = 'scheduled' AND reminder_notification_id IS NULL;

-- Add comments for documentation
COMMENT ON FUNCTION process_due_notifications() IS 'Processes due notifications and sends push notifications via Edge Function. Replaces /api/cron/notifications endpoint.';
COMMENT ON FUNCTION schedule_appointment_reminders() IS 'Schedules appointment reminder notifications. Replaces /api/cron/schedule endpoint.';
COMMENT ON FUNCTION cleanup_old_notifications() IS 'Removes old notifications to keep database clean.';