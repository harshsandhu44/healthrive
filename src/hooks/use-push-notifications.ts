import { useState, useEffect, useCallback } from 'react';
import { pushNotificationManager, type PushSubscriptionData } from '@/lib/push-notifications';

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  subscription: PushSubscriptionData | null;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);

  // Initialize push notifications
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);

        // Check if push notifications are supported
        const supported = await pushNotificationManager.initialize();
        setIsSupported(supported);

        if (supported) {
          // Get current permission status
          const currentPermission = Notification.permission;
          setPermission(currentPermission);

          // Check if user is already subscribed
          const subscribed = await pushNotificationManager.isSubscribed();
          setIsSubscribed(subscribed);

          // Get current subscription if exists
          if (subscribed) {
            const currentSubscription = await pushNotificationManager.getSubscription();
            setSubscription(currentSubscription);
          }
        }
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      const subscriptionData = await pushNotificationManager.subscribe();
      
      if (subscriptionData) {
        setIsSubscribed(true);
        setSubscription(subscriptionData);
        setPermission(Notification.permission);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      const success = await pushNotificationManager.unsubscribe();
      
      if (success) {
        setIsSubscribed(false);
        setSubscription(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request permission for notifications
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    try {
      const newPermission = await pushNotificationManager.requestPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscription,
    subscribe,
    unsubscribe,
    requestPermission,
  };
}