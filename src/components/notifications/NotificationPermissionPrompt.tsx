'use client';

// Notification permission request component with device-responsive UI

import { useState, useEffect, useCallback } from 'react';
import { Bell, X, BellOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
// Note: Feature flag is checked server-side to avoid client-side issues

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

interface NotificationPermissionPromptProps {
  /** Whether the feature is enabled (checked server-side) */
  enabled?: boolean;
  /** Delay before showing the prompt (in milliseconds) */
  delay?: number;
  /** Custom onPermissionGranted callback */
  onPermissionGranted?: () => void;
  /** Custom onDismiss callback */
  onDismiss?: () => void;
}

export function NotificationPermissionPrompt({
  enabled = true, // Default to enabled, can be controlled from parent
  delay = 3000, // 3 second delay by default
  onPermissionGranted,
  onDismiss
}: NotificationPermissionPromptProps) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const {
    permission,
    isSupported,
    isLoading,
    hasBeenPrompted,
    isDismissed,
    requestPermission,
    dismissPrompt
  } = useNotificationPermission();

  // Check if we should show the prompt (memoized to avoid re-renders)
  const shouldShowPrompt = useCallback(() => {
    return (
      enabled &&
      isSupported &&
      !isLoading &&
      permission === 'default' && // Permission not yet decided
      !hasBeenPrompted && // Haven't asked before
      !isDismissed && // Not dismissed
      typeof window !== 'undefined'
    );
  }, [enabled, isSupported, isLoading, permission, hasBeenPrompted, isDismissed]);

  // Initialize visibility with delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (shouldShowPrompt()) {
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [delay, shouldShowPrompt]);

  // Handle permission request
  const handleAllowNotifications = async () => {
    setIsRequesting(true);
    
    try {
      const result = await requestPermission();
      
      if (result === 'granted') {
        onPermissionGranted?.();
        setIsVisible(false);
      } else if (result === 'denied') {
        // Show a brief message or handle denial
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  // Handle dismissal
  const handleDismiss = (permanent: boolean = false) => {
    dismissPrompt(permanent);
    setIsVisible(false);
    onDismiss?.();
  };

  // Don't render if shouldn't show
  if (!isVisible) return null;

  const content = {
    title: "Stay Updated with Notifications",
    description: "Get notified about upcoming appointments, important updates, and system messages. You can change this setting anytime in your browser.",
    benefits: [
      "Appointment reminders 5 minutes before your scheduled time",
      "Important updates about your healthcare",
      "System notifications and alerts"
    ]
  };


  // Render mobile drawer
  if (isMobile) {
    return (
      <Drawer open={isVisible} onOpenChange={(open) => !open && handleDismiss()}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>{content.title}</span>
            </DrawerTitle>
            <DrawerDescription>
              {content.description}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">You&apos;ll receive notifications for:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DrawerFooter>
            <Button 
              onClick={handleAllowNotifications}
              disabled={isRequesting}
              size="lg"
            >
              <Bell className="mr-2 h-4 w-4" />
              {isRequesting ? 'Requesting...' : 'Allow Notifications'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleDismiss(false)}
              size="lg"
            >
              Maybe Later
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDismiss(true)}
              className="text-xs text-muted-foreground"
            >
              <BellOff className="mr-1 h-3 w-3" />
              Don&apos;t ask again
            </Button>
            
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Render desktop dialog
  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>{content.title}</span>
          </DialogTitle>
          <DialogDescription>
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">You&apos;ll receive notifications for:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-x-0">
          <div className="flex space-x-2">
            <Button 
              onClick={handleAllowNotifications}
              disabled={isRequesting}
              className="flex-1"
            >
              <Bell className="mr-2 h-4 w-4" />
              {isRequesting ? 'Requesting...' : 'Allow Notifications'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleDismiss(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleDismiss(true)}
            className="text-xs text-muted-foreground"
          >
            <BellOff className="mr-1 h-3 w-3" />
            Don&apos;t ask again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}