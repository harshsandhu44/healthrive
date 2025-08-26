// Push notification utilities and client-side management
import { createClient } from "@/lib/db/client";

// VAPID public key - this should match your server's VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}

export class PushNotificationManager {
  private static instance: PushNotificationManager;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  private constructor() {}

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  // Initialize service worker and push notifications
  async initialize(): Promise<boolean> {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('Service workers not supported');
        return false;
      }

      // Check if push notifications are supported
      if (!('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return false;
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service worker registered successfully');

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Request notification permission from user
  async requestPermission(): Promise<NotificationPermission> {
    try {
      if (!('Notification' in window)) {
        console.warn('Notifications not supported');
        return 'denied';
      }

      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Subscribe user to push notifications
  async subscribe(): Promise<PushSubscriptionData | null> {
    try {
      if (!this.registration) {
        console.error('Service worker not registered');
        return null;
      }

      if (!VAPID_PUBLIC_KEY) {
        console.error('VAPID public key not configured');
        return null;
      }

      // Check permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Push notification permission not granted');
        return null;
      }

      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subscriptionData = this.extractSubscriptionData(this.subscription);
      
      // Save subscription to database
      await this.saveSubscription(subscriptionData);

      console.log('Push subscription successful:', subscriptionData);
      return subscriptionData;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        this.subscription = null;
      }

      // Remove subscription from database
      await this.removeSubscription();

      console.log('Push unsubscription successful');
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  // Check if user is currently subscribed
  async isSubscribed(): Promise<boolean> {
    try {
      if (!this.registration) {
        return false;
      }

      this.subscription = await this.registration.pushManager.getSubscription();
      return this.subscription !== null;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  // Get current subscription
  async getSubscription(): Promise<PushSubscriptionData | null> {
    try {
      if (!this.registration) {
        return null;
      }

      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (this.subscription) {
        return this.extractSubscriptionData(this.subscription);
      }

      return null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }

  // Convert VAPID key from base64 URL to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Extract subscription data from PushSubscription object
  private extractSubscriptionData(subscription: PushSubscription): PushSubscriptionData {
    const keys = subscription.getKey ? {
      p256dh: subscription.getKey('p256dh'),
      auth: subscription.getKey('auth'),
    } : { p256dh: null, auth: null };

    return {
      endpoint: subscription.endpoint,
      p256dh: keys.p256dh ? this.arrayBufferToBase64(keys.p256dh) : '',
      auth: keys.auth ? this.arrayBufferToBase64(keys.auth) : '',
      userAgent: navigator.userAgent,
    };
  }

  // Convert ArrayBuffer to base64 string
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return window.btoa(binary);
  }

  // Save subscription to database
  private async saveSubscription(subscriptionData: PushSubscriptionData): Promise<void> {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.rpc('upsert_push_subscription', {
        p_user_id: user.id,
        p_endpoint: subscriptionData.endpoint,
        p_p256dh: subscriptionData.p256dh,
        p_auth: subscriptionData.auth,
        p_user_agent: subscriptionData.userAgent || null,
      });

      if (error) {
        throw error;
      }

      console.log('Push subscription saved to database');
    } catch (error) {
      console.error('Failed to save push subscription:', error);
      throw error;
    }
  }

  // Remove subscription from database
  private async removeSubscription(): Promise<void> {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (this.subscription) {
        const { error } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', this.subscription.endpoint);

        if (error) {
          throw error;
        }
      }

      console.log('Push subscription removed from database');
    } catch (error) {
      console.error('Failed to remove push subscription:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const pushNotificationManager = PushNotificationManager.getInstance();