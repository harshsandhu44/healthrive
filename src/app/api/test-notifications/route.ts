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
  // Test database notification functions (replaces old cron job testing)
  try {
    console.log('Testing database notification functions...');

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

    // Test the new database functions
    const { data: scheduleResult, error: scheduleError } = await supabaseAdmin
      .rpc('schedule_appointment_reminders');

    const { data: notificationsResult, error: notificationsError } = await supabaseAdmin
      .rpc('process_due_notifications');

    return NextResponse.json({
      success: true,
      message: 'Database notification functions tested',
      results: {
        schedule: {
          success: !scheduleError,
          count: scheduleResult || 0,
          error: scheduleError?.message
        },
        notifications: {
          success: !notificationsError,
          count: notificationsResult || 0,
          error: notificationsError?.message
        }
      }
    });

  } catch (error) {
    console.error('Database function test error:', error);
    return NextResponse.json(
      { error: 'Failed to test database functions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}