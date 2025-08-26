// Server-side push notification utilities
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@vylune.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class PushNotificationService {
  private supabaseAdmin: any;

  constructor() {
    // Use service role for admin operations
    this.supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  // Send push notification to a specific user
  async sendToUser(userId: string, payload: PushNotificationPayload): Promise<boolean> {
    try {
      // Get all push subscriptions for the user
      const { data: subscriptions, error } = await this.supabaseAdmin
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to get push subscriptions:', error);
        return false;
      }

      if (!subscriptions || subscriptions.length === 0) {
        console.log('No push subscriptions found for user:', userId);
        return false;
      }

      // Send notification to all user's subscriptions
      const sendPromises = subscriptions.map((sub: any) =>
        this.sendToSubscription({
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }, payload)
      );

      const results = await Promise.allSettled(sendPromises);
      
      // Count successful sends
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const totalCount = results.length;

      console.log(`Push notification sent: ${successCount}/${totalCount} subscriptions successful`);

      // Clean up failed subscriptions
      await this.cleanupFailedSubscriptions(results, subscriptions);

      return successCount > 0;
    } catch (error) {
      console.error('Failed to send push notification to user:', error);
      return false;
    }
  }

  // Send push notification to multiple users
  async sendToUsers(userIds: string[], payload: PushNotificationPayload): Promise<number> {
    try {
      const sendPromises = userIds.map(userId => this.sendToUser(userId, payload));
      const results = await Promise.allSettled(sendPromises);
      
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      console.log(`Bulk push notification sent: ${successCount}/${userIds.length} users successful`);
      
      return successCount;
    } catch (error) {
      console.error('Failed to send bulk push notifications:', error);
      return 0;
    }
  }

  // Send push notification to a specific subscription
  private async sendToSubscription(
    subscription: PushSubscriptionData,
    payload: PushNotificationPayload
  ): Promise<void> {
    try {
      const pushPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icons/icon-192.png',
        badge: payload.badge || '/icons/icon-72.png',
        tag: payload.tag || 'vylune-notification',
        requireInteraction: true,
        actions: payload.actions || [
          { action: 'view', title: 'View' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        data: {
          url: '/',
          timestamp: Date.now(),
          ...payload.data
        }
      });

      await webpush.sendNotification(subscription, pushPayload);
      console.log('Push notification sent successfully to:', subscription.endpoint.substring(0, 50) + '...');
    } catch (error: any) {
      console.error('Failed to send push notification:', error);
      
      // If the subscription is invalid, we'll clean it up in the parent function
      if (error.statusCode === 410 || error.statusCode === 404) {
        throw new Error('Invalid subscription');
      }
      
      throw error;
    }
  }

  // Clean up failed/invalid subscriptions
  private async cleanupFailedSubscriptions(
    results: PromiseSettledResult<void>[],
    subscriptions: any[]
  ): Promise<void> {
    try {
      const failedIndexes: number[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'rejected' && result.reason.message === 'Invalid subscription') {
          failedIndexes.push(index);
        }
      });

      if (failedIndexes.length === 0) {
        return;
      }

      // Delete invalid subscriptions from database
      const invalidEndpoints = failedIndexes.map(index => subscriptions[index].endpoint);
      
      const { error } = await this.supabaseAdmin
        .from('push_subscriptions')
        .delete()
        .in('endpoint', invalidEndpoints);

      if (error) {
        console.error('Failed to cleanup invalid subscriptions:', error);
      } else {
        console.log(`Cleaned up ${failedIndexes.length} invalid push subscriptions`);
      }
    } catch (error) {
      console.error('Error during subscription cleanup:', error);
    }
  }

  // Get due notifications that need to be sent
  async getDueNotifications(): Promise<any[]> {
    try {
      const { data, error } = await this.supabaseAdmin
        .rpc('get_due_notifications');

      if (error) {
        console.error('Failed to get due notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting due notifications:', error);
      return [];
    }
  }

  // Mark notifications as sent
  async markNotificationsAsSent(notificationIds: string[]): Promise<void> {
    try {
      const { error } = await this.supabaseAdmin
        .rpc('mark_notifications_as_sent', {
          notification_ids: notificationIds
        });

      if (error) {
        console.error('Failed to mark notifications as sent:', error);
      } else {
        console.log(`Marked ${notificationIds.length} notifications as sent`);
      }
    } catch (error) {
      console.error('Error marking notifications as sent:', error);
    }
  }

  // Process all due notifications and send push notifications
  async processDueNotifications(): Promise<number> {
    try {
      console.log('Processing due notifications...');
      
      const dueNotifications = await this.getDueNotifications();
      
      if (dueNotifications.length === 0) {
        console.log('No due notifications to process');
        return 0;
      }

      console.log(`Found ${dueNotifications.length} due notifications`);
      
      let sentCount = 0;
      const processedIds: string[] = [];

      // Process each notification
      for (const notification of dueNotifications) {
        try {
          const payload: PushNotificationPayload = {
            title: notification.title,
            body: notification.message,
            tag: `appointment-${notification.appointment_id}`,
            data: {
              type: notification.type,
              appointment_id: notification.appointment_id,
              url: '/appointments',
              ...notification.data
            }
          };

          const success = await this.sendToUser(notification.user_id, payload);
          
          if (success) {
            sentCount++;
          }
          
          processedIds.push(notification.id);
        } catch (error) {
          console.error(`Failed to process notification ${notification.id}:`, error);
        }
      }

      // Mark all processed notifications as sent (even if sending failed)
      // This prevents them from being processed again
      if (processedIds.length > 0) {
        await this.markNotificationsAsSent(processedIds);
      }

      console.log(`Processed ${processedIds.length} notifications, sent ${sentCount} successfully`);
      return sentCount;
    } catch (error) {
      console.error('Error processing due notifications:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();