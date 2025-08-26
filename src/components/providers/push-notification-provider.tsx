"use client";

import { useEffect } from "react";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { toast } from "sonner";

export function PushNotificationProvider() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    requestPermission,
  } = usePushNotifications();

  useEffect(() => {
    const initializePushNotifications = async () => {
      // Skip if not supported or already subscribed
      if (!isSupported || isSubscribed || isLoading) {
        return;
      }

      // Skip if permission is denied
      if (permission === 'denied') {
        return;
      }

      // Auto-subscribe if permission is already granted
      if (permission === 'granted') {
        const success = await subscribe();
        if (success) {
          console.log('Auto-subscribed to push notifications');
        }
        return;
      }

      // For default permission, wait a bit before asking
      // This gives the user time to interact with the app first
      setTimeout(async () => {
        const newPermission = await requestPermission();
        
        if (newPermission === 'granted') {
          const success = await subscribe();
          if (success) {
            toast.success('Push notifications enabled! You\'ll receive appointment reminders.');
          }
        } else if (newPermission === 'denied') {
          toast.info('Enable notifications in your browser settings to receive appointment reminders.');
        }
      }, 3000); // Wait 3 seconds after app load
    };

    initializePushNotifications();
  }, [isSupported, permission, isSubscribed, isLoading, subscribe, requestPermission]);

  // Log push notification status for debugging
  useEffect(() => {
    if (!isLoading) {
      console.log('Push Notifications Status:', {
        isSupported,
        permission,
        isSubscribed,
      });
    }
  }, [isSupported, permission, isSubscribed, isLoading]);

  // This component doesn't render anything visible
  return null;
}