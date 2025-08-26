-- Update database settings for the new notification system
-- Configure the settings needed for the Edge Function integration

-- Set application settings for the notification system
-- Note: These settings should be updated with actual values after deployment

-- Base URL for Edge Function calls (update with your actual Supabase project URL)
ALTER DATABASE postgres SET app.base_url = 'https://qnzreagoqbshqnffwgny.supabase.co/functions/v1';

-- Service role key setting (will be set automatically by Supabase)
-- ALTER DATABASE postgres SET app.service_role_key = 'your_service_role_key_here';

-- Update the process_due_notifications function to use the correct Edge Function endpoint
CREATE OR REPLACE FUNCTION process_due_notifications()
RETURNS INTEGER AS $$
DECLARE
  notification_record RECORD;
  notification_count INTEGER := 0;
  endpoint_url TEXT;
  response_status INTEGER;
  response_content TEXT;
BEGIN
  -- Get Edge Function URL
  endpoint_url := current_setting('app.base_url', true) || '/push-notifications';
  
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
    LIMIT 10 -- Process in batches to avoid timeouts
  LOOP
    BEGIN
      -- Call Edge Function to send push notification
      SELECT status, content INTO response_status, response_content
      FROM net.http_post(
        url := endpoint_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('SUPABASE_SERVICE_ROLE_KEY', true)
        ),
        body := jsonb_build_object(
          'userId', notification_record.user_id,
          'payload', jsonb_build_object(
            'title', notification_record.title,
            'body', notification_record.message,
            'tag', 'appointment-' || COALESCE(notification_record.appointment_id, 'general'),
            'data', notification_record.data
          )
        )
      );
      
      -- Mark notification as sent regardless of success/failure
      -- This prevents infinite retry loops
      UPDATE notifications 
      SET 
        push_sent = TRUE,
        sent_at = NOW(),
        updated_at = NOW()
      WHERE id = notification_record.id;
      
      -- Log the result
      IF response_status BETWEEN 200 AND 299 THEN
        notification_count := notification_count + 1;
        RAISE LOG 'Successfully sent notification % to user %', 
          notification_record.id, notification_record.user_id;
      ELSE
        RAISE WARNING 'Failed to send notification % (status: %): %', 
          notification_record.id, response_status, response_content;
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      -- Mark as sent to prevent retry loops, but log the error
      UPDATE notifications 
      SET 
        push_sent = TRUE,
        sent_at = NOW(),
        updated_at = NOW()
      WHERE id = notification_record.id;
      
      RAISE WARNING 'Exception processing notification %: %', 
        notification_record.id, SQLERRM;
    END;
  END LOOP;
  
  -- Log summary
  IF notification_count > 0 THEN
    RAISE LOG 'Processed % notifications successfully', notification_count;
  END IF;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- Create a simpler fallback function that doesn't rely on Edge Functions
-- This can be used if the Edge Function approach has issues
CREATE OR REPLACE FUNCTION process_due_notifications_fallback()
RETURNS INTEGER AS $$
DECLARE
  notification_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  -- Simply mark due notifications as processed
  -- The actual push notification can be handled by the client-side polling
  FOR notification_record IN 
    SELECT id
    FROM notifications
    WHERE scheduled_for <= NOW()
      AND push_sent = FALSE
      AND scheduled_for IS NOT NULL
    ORDER BY scheduled_for ASC
    LIMIT 50
  LOOP
    -- Mark notification as ready for client-side pickup
    UPDATE notifications 
    SET 
      push_sent = TRUE,
      sent_at = NOW(),
      updated_at = NOW()
    WHERE id = notification_record.id;
    
    notification_count := notification_count + 1;
  END LOOP;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get pending notifications for a user (client-side polling)
CREATE OR REPLACE FUNCTION get_user_pending_notifications(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  appointment_id TEXT,
  type notification_type,
  title TEXT,
  message TEXT,
  data JSONB,
  sent_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.appointment_id,
    n.type,
    n.title,
    n.message,
    n.data,
    n.sent_at
  FROM notifications n
  WHERE n.user_id = p_user_id
    AND n.push_sent = TRUE
    AND n.read_at IS NULL
    AND n.sent_at > NOW() - INTERVAL '1 hour' -- Only recent notifications
  ORDER BY n.sent_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for the new functions
GRANT EXECUTE ON FUNCTION process_due_notifications_fallback() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_pending_notifications(UUID) TO authenticated;

-- Update RLS policies to allow service role to update notifications
DROP POLICY IF EXISTS "Service can manage notifications" ON notifications;
CREATE POLICY "Service can manage notifications" ON notifications
  FOR ALL 
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Create an alternative cron job using the fallback function
-- This can be used if the Edge Function approach doesn't work
SELECT cron.schedule(
  'process-due-notifications-fallback',
  '*/5 * * * *',
  $$SELECT process_due_notifications_fallback();$$
);

-- Disable the main notification processing initially
-- Enable it after Edge Function is deployed and tested
SELECT cron.unschedule('process-due-notifications');

-- Add comments
COMMENT ON FUNCTION process_due_notifications_fallback() IS 'Fallback notification processor that marks notifications as ready without sending push notifications';
COMMENT ON FUNCTION get_user_pending_notifications(UUID) IS 'Returns recent unread notifications for a user (for client-side polling)';