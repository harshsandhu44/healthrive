import { NextRequest, NextResponse } from 'next/server';
import { pushNotificationService } from '@/lib/server/push-notifications';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (optional security check)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Cron job: Processing due notifications...');
    
    // Process all due notifications and send push notifications
    const sentCount = await pushNotificationService.processDueNotifications();
    
    return NextResponse.json({ 
      success: true, 
      message: `Processed notifications successfully`,
      sentCount 
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to process notifications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}