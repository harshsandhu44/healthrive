// Hook for managing notification permission state and requests

import { useState, useEffect, useCallback } from 'react';
import { pushNotificationManager } from '@/lib/push-notifications';

interface NotificationPermissionState {
  permission: NotificationPermission;
  isSupported: boolean;
  isLoading: boolean;
  hasBeenPrompted: boolean;
  isDismissed: boolean;
}

interface NotificationPermissionActions {
  requestPermission: () => Promise<NotificationPermission>;
  dismissPrompt: (permanent?: boolean) => void;
  resetDismissal: () => void;
}

const STORAGE_KEY = 'vylune_notification_preferences';

interface StoredPreferences {
  hasBeenPrompted: boolean;
  isDismissedPermanently: boolean;
  lastDismissedAt: number;
}

export function useNotificationPermission(): NotificationPermissionState & NotificationPermissionActions {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [hasBeenPrompted, setHasBeenPrompted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if notifications are supported
  const isSupported = typeof window !== 'undefined' && 
    'Notification' in window && 
    'serviceWorker' in navigator && 
    'PushManager' in window;

  // Load stored preferences
  const loadStoredPreferences = useCallback((): StoredPreferences => {
    if (typeof window === 'undefined') {
      return {
        hasBeenPrompted: false,
        isDismissedPermanently: false,
        lastDismissedAt: 0
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }

    return {
      hasBeenPrompted: false,
      isDismissedPermanently: false,
      lastDismissedAt: 0
    };
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((preferences: Partial<StoredPreferences>) => {
    if (typeof window === 'undefined') return;

    try {
      const current = loadStoredPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }, [loadStoredPreferences]);

  // Initialize permission state and stored preferences
  useEffect(() => {
    if (!isSupported) {
      setIsLoading(false);
      return;
    }

    const initializePermissionState = async () => {
      try {
        // Initialize push notification manager
        await pushNotificationManager.initialize();

        // Get current permission status
        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        // Load stored preferences
        const preferences = loadStoredPreferences();
        setHasBeenPrompted(preferences.hasBeenPrompted || currentPermission !== 'default');
        
        // Check if dismissed (permanently or recently)
        const isDismissedPermanently = preferences.isDismissedPermanently;
        const recentlyDismissed = Date.now() - preferences.lastDismissedAt < 24 * 60 * 60 * 1000; // 24 hours
        setIsDismissed(isDismissedPermanently || recentlyDismissed);

      } catch (error) {
        console.error('Failed to initialize notification permission state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePermissionState();
  }, [isSupported, loadStoredPreferences]);

  // Listen for permission changes (e.g., user changes in browser settings)
  useEffect(() => {
    if (!isSupported) return;

    const checkPermissionChange = () => {
      const currentPermission = Notification.permission;
      if (currentPermission !== permission) {
        setPermission(currentPermission);
        
        // If permission was granted, mark as prompted and not dismissed
        if (currentPermission === 'granted') {
          setHasBeenPrompted(true);
          setIsDismissed(false);
          savePreferences({ 
            hasBeenPrompted: true, 
            isDismissedPermanently: false 
          });
        }
      }
    };

    // Check permission periodically (in case user changes it in browser settings)
    const interval = setInterval(checkPermissionChange, 5000);

    return () => clearInterval(interval);
  }, [permission, isSupported, savePreferences]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    setIsLoading(true);

    try {
      const result = await pushNotificationManager.requestPermission();
      setPermission(result);
      setHasBeenPrompted(true);
      setIsDismissed(false);

      // Save that we've prompted the user
      savePreferences({ 
        hasBeenPrompted: true,
        isDismissedPermanently: false
      });

      // If granted, try to subscribe to push notifications
      if (result === 'granted') {
        await pushNotificationManager.subscribe();
      }

      return result;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, savePreferences]);

  // Dismiss the permission prompt
  const dismissPrompt = useCallback((permanent: boolean = false) => {
    setIsDismissed(true);

    savePreferences({
      isDismissedPermanently: permanent,
      lastDismissedAt: Date.now()
    });
  }, [savePreferences]);

  // Reset dismissal state (for testing or re-prompting)
  const resetDismissal = useCallback(() => {
    setIsDismissed(false);
    savePreferences({
      isDismissedPermanently: false,
      lastDismissedAt: 0
    });
  }, [savePreferences]);

  return {
    // State
    permission,
    isSupported,
    isLoading,
    hasBeenPrompted,
    isDismissed,
    // Actions  
    requestPermission,
    dismissPrompt,
    resetDismissal
  };
}