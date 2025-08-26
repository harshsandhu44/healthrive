import { NextRequest, NextResponse } from 'next/server';
import { pushNotificationService } from '@/lib/server/push-notifications';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Use service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get current user to test with
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError || !users || users.length === 0) {
      return NextResponse.json({ error: 'No users found for testing' }, { status: 404 });
    }

    const testUser = users[0];

    // Create a test notification
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: testUser.id,
        type: 'test_notification',
        title: 'Test Push Notification',
        message: 'This is a test push notification to verify the system is working.',
        scheduled_for: new Date().toISOString(),
        data: {
          test: true,
          timestamp: Date.now()
        }
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Failed to create test notification:', notificationError);
      return NextResponse.json({ error: 'Failed to create test notification' }, { status: 500 });
    }

    // Send the test notification
    const success = await pushNotificationService.sendToUser(testUser.id, {
      title: 'Test Push Notification',
      body: 'This is a test push notification to verify the system is working.',
      tag: 'test-notification',
      data: {
        test: true,
        timestamp: Date.now(),
        url: '/'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      notification,
      pushSent: success
    });

  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Test both cron jobs
  try {
    console.log('Testing cron jobs...');

    // Test scheduling cron job
    const scheduleResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/cron/schedule`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const scheduleResult = await scheduleResponse.json();

    // Test notifications cron job  
    const notificationsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/cron/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const notificationsResult = await notificationsResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Cron jobs tested',
      results: {
        schedule: scheduleResult,
        notifications: notificationsResult
      }
    });

  } catch (error) {
    console.error('Cron job test error:', error);
    return NextResponse.json(
      { error: 'Failed to test cron jobs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}