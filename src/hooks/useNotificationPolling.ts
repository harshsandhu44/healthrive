// Client-side notification polling hook as backup for push notifications
// This ensures notifications work even if push notifications fail

import { useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/db/client';
import { pushNotificationManager } from '@/lib/push-notifications';

interface PendingNotification {
  id: string;
  appointment_id: string | null;
  type: 'appointment_reminder' | 'system' | 'general';
  title: string;
  message: string;
  data: Record<string, any>;
  sent_at: string;
}

interface UseNotificationPollingOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  onNotification?: (notification: PendingNotification) => void;
}

export function useNotificationPolling({
  enabled = true,
  interval = 30000, // 30 seconds
  onNotification
}: UseNotificationPollingOptions = {}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<Date>(new Date());
  const supabase = createClient();

  const checkForNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get pending notifications from the database
      const { data: notifications, error } = await supabase
        .rpc('get_user_pending_notifications', {
          p_user_id: user.id
        });

      if (error) {
        console.error('Failed to fetch pending notifications:', error);
        return;
      }

      if (notifications && notifications.length > 0) {
        for (const notification of notifications) {
          // Only show notifications that are newer than our last check
          const notificationTime = new Date(notification.sent_at);
          if (notificationTime > lastCheckRef.current) {
            
            // Try to show browser notification if push notifications aren't available
            await showBrowserNotification(notification);
            
            // Call the callback if provided
            if (onNotification) {
              onNotification(notification);
            }

            // Mark notification as read
            await supabase
              .rpc('mark_notification_as_read', {
                p_notification_id: notification.id,
                p_user_id: user.id
              });
          }
        }
        
        lastCheckRef.current = new Date();
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }, [supabase, onNotification]);

  const showBrowserNotification = async (notification: PendingNotification) => {
    try {
      // Check if push notifications are available and working
      const isSubscribed = await pushNotificationManager.isSubscribed();
      
      // If push notifications are not available, fall back to browser notifications
      if (!isSubscribed && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icons/icon-192.png',
            tag: `appointment-${notification.appointment_id}`,
            requireInteraction: true,
            data: notification.data
          });
        }
      }
    } catch (error) {
      console.error('Failed to show browser notification:', error);
    }
  };

  const startPolling = useCallback(() => {
    if (!enabled) return;
    
    // Initial check
    checkForNotifications();
    
    // Set up interval
    intervalRef.current = setInterval(checkForNotifications, interval);
  }, [enabled, interval, checkForNotifications]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  // Also check when the tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && enabled) {
        checkForNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, checkForNotifications]);

  return {
    startPolling,
    stopPolling,
    checkNow: checkForNotifications
  };
}