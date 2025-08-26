-- Add database triggers for automatic notification scheduling
-- This ensures notifications are scheduled immediately when appointments are created/updated

-- Function to automatically schedule notifications when appointment status changes to 'scheduled'
CREATE OR REPLACE FUNCTION trigger_schedule_appointment_notification()
RETURNS trigger AS $$
DECLARE
  reminder_time TIMESTAMPTZ;
  patient_notification_id UUID;
  provider_notification_id UUID;
  patient_name TEXT;
BEGIN
  -- Only proceed if appointment is being set to 'scheduled' status
  IF NEW.status != 'scheduled' THEN
    RETURN NEW;
  END IF;
  
  -- Skip if this is an update and status hasn't changed to scheduled
  IF TG_OP = 'UPDATE' AND OLD.status = 'scheduled' THEN
    RETURN NEW;
  END IF;
  
  -- Skip if reminder is already scheduled
  IF NEW.reminder_notification_id IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Calculate reminder time (5 minutes before appointment)
  reminder_time := NEW.datetime - INTERVAL '5 minutes';
  
  -- Skip if reminder time is in the past or appointment is too soon
  IF reminder_time <= NOW() OR NEW.datetime <= NOW() + INTERVAL '6 hours' THEN
    RETURN NEW;
  END IF;
  
  -- Get patient name
  SELECT name INTO patient_name 
  FROM patients 
  WHERE id = NEW.patient_id;
  
  BEGIN
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
      NEW.patient_id,
      NEW.id,
      'appointment_reminder',
      'Upcoming Appointment Reminder',
      'Your appointment is scheduled in 5 minutes.',
      reminder_time,
      jsonb_build_object(
        'appointment_id', NEW.id,
        'appointment_type', NEW.appointment_type,
        'appointment_time', NEW.datetime,
        'patient_name', COALESCE(patient_name, 'Patient')
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
      NEW.user_id,
      NEW.id,
      'appointment_reminder',
      'Upcoming Appointment Reminder',
      'You have an appointment starting in 5 minutes.',
      reminder_time,
      jsonb_build_object(
        'appointment_id', NEW.id,
        'appointment_type', NEW.appointment_type,
        'appointment_time', NEW.datetime,
        'patient_name', COALESCE(patient_name, 'Patient')
      )
    ) RETURNING id INTO provider_notification_id;
    
    -- Update the appointment record with notification IDs
    NEW.reminder_notification_id := patient_notification_id;
    NEW.provider_reminder_notification_id := provider_notification_id;
    
    RAISE LOG 'Scheduled notifications for appointment % at %', NEW.id, reminder_time;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't block the appointment creation/update
    RAISE WARNING 'Failed to schedule notifications for appointment %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle appointment cancellation/rescheduling
CREATE OR REPLACE FUNCTION trigger_cancel_appointment_notifications()
RETURNS trigger AS $$
BEGIN
  -- If appointment is being cancelled or datetime changed, cancel existing notifications
  IF (NEW.status = 'cancelled' OR NEW.datetime != OLD.datetime) THEN
    
    -- Delete existing notifications that haven't been sent yet
    DELETE FROM notifications 
    WHERE appointment_id = OLD.id 
      AND type = 'appointment_reminder'
      AND push_sent = FALSE;
    
    -- Clear the notification ID references
    NEW.reminder_notification_id := NULL;
    NEW.provider_reminder_notification_id := NULL;
    
    RAISE LOG 'Cancelled notifications for appointment % (status: %, datetime changed: %)', 
      OLD.id, NEW.status, (NEW.datetime != OLD.datetime);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic notification scheduling
DROP TRIGGER IF EXISTS trigger_schedule_appointment_notification ON appointments;
CREATE TRIGGER trigger_schedule_appointment_notification
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_schedule_appointment_notification();

-- Create trigger for cancellation handling
DROP TRIGGER IF EXISTS trigger_cancel_appointment_notifications ON appointments;
CREATE TRIGGER trigger_cancel_appointment_notifications
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_cancel_appointment_notifications();

-- Function to handle immediate notification for appointments scheduled within 6 hours
CREATE OR REPLACE FUNCTION trigger_immediate_appointment_notification()
RETURNS trigger AS $$
DECLARE
  patient_name TEXT;
  time_until_appointment INTERVAL;
BEGIN
  -- Only for newly scheduled appointments
  IF NEW.status != 'scheduled' OR (TG_OP = 'UPDATE' AND OLD.status = 'scheduled') THEN
    RETURN NEW;
  END IF;
  
  time_until_appointment := NEW.datetime - NOW();
  
  -- If appointment is within 6 hours, send immediate notification instead of scheduled reminder
  IF time_until_appointment <= INTERVAL '6 hours' AND time_until_appointment > INTERVAL '0' THEN
    
    -- Get patient name
    SELECT name INTO patient_name 
    FROM patients 
    WHERE id = NEW.patient_id;
    
    -- Send immediate notification to patient
    INSERT INTO notifications (
      user_id,
      appointment_id,
      type,
      title,
      message,
      scheduled_for,
      data
    ) VALUES (
      NEW.patient_id,
      NEW.id,
      'appointment_reminder',
      'Appointment Scheduled',
      CASE 
        WHEN time_until_appointment <= INTERVAL '1 hour' THEN 
          'Your appointment is starting soon!'
        ELSE 
          'Your appointment has been scheduled for today.'
      END,
      NOW(), -- Send immediately
      jsonb_build_object(
        'appointment_id', NEW.id,
        'appointment_type', NEW.appointment_type,
        'appointment_time', NEW.datetime,
        'patient_name', COALESCE(patient_name, 'Patient'),
        'urgent', true
      )
    );
    
    -- Send immediate notification to provider
    INSERT INTO notifications (
      user_id,
      appointment_id,
      type,
      title,
      message,
      scheduled_for,
      data
    ) VALUES (
      NEW.user_id,
      NEW.id,
      'appointment_reminder',
      'Appointment Scheduled',
      CASE 
        WHEN time_until_appointment <= INTERVAL '1 hour' THEN 
          'You have an appointment starting soon!'
        ELSE 
          'Appointment scheduled for today.'
      END,
      NOW(), -- Send immediately
      jsonb_build_object(
        'appointment_id', NEW.id,
        'appointment_type', NEW.appointment_type,
        'appointment_time', NEW.datetime,
        'patient_name', COALESCE(patient_name, 'Patient'),
        'urgent', true
      )
    );
    
    RAISE LOG 'Sent immediate notifications for appointment % (in % hours)', 
      NEW.id, EXTRACT(EPOCH FROM time_until_appointment)/3600;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for immediate notifications
DROP TRIGGER IF EXISTS trigger_immediate_appointment_notification ON appointments;
CREATE TRIGGER trigger_immediate_appointment_notification
  AFTER INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_immediate_appointment_notification();

-- Grant permissions
GRANT EXECUTE ON FUNCTION trigger_schedule_appointment_notification() TO authenticated;
GRANT EXECUTE ON FUNCTION trigger_cancel_appointment_notifications() TO authenticated;
GRANT EXECUTE ON FUNCTION trigger_immediate_appointment_notification() TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION trigger_schedule_appointment_notification() IS 'Automatically schedules reminder notifications when appointments are set to scheduled status';
COMMENT ON FUNCTION trigger_cancel_appointment_notifications() IS 'Cancels existing notifications when appointments are cancelled or rescheduled';
COMMENT ON FUNCTION trigger_immediate_appointment_notification() IS 'Sends immediate notifications for appointments scheduled within 6 hours';