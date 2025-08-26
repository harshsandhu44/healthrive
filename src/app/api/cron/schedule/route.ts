import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enableCronJobsFlag } from '@/flags';

export async function GET(request: NextRequest) {
  try {
    // Check if cron jobs are enabled via feature flag
    const cronEnabled = await enableCronJobsFlag();
    if (!cronEnabled) {
      console.log('Cron jobs are disabled via feature flag');
      return NextResponse.json({ 
        success: true, 
        message: 'Cron jobs are disabled via feature flag',
        scheduledCount: 0 
      });
    }

    // Verify the request is from a cron job (optional security check)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    console.log('Cron job: Scheduling appointment reminders...');

    // Get appointments that are scheduled for the next 6-24 hours
    // and don't already have reminder notifications scheduled
    const { data: appointments, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        id,
        patient_id,
        user_id,
        datetime,
        appointment_type,
        status
      `)
      .eq('status', 'scheduled')
      .gte('datetime', new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()) // Next 6 hours
      .lte('datetime', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()) // Next 24 hours
      .is('reminder_notification_id', null); // No reminder already scheduled

    if (error) {
      console.error('Failed to fetch appointments:', error);
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }

    if (!appointments || appointments.length === 0) {
      console.log('No appointments found for scheduling reminders');
      return NextResponse.json({ 
        success: true, 
        message: 'No appointments to schedule reminders for',
        scheduledCount: 0 
      });
    }

    console.log(`Found ${appointments.length} appointments to schedule reminders for`);

    let scheduledCount = 0;

    // Schedule reminder notifications for each appointment
    for (const appointment of appointments) {
      try {
        // Calculate reminder time (5 minutes before appointment)
        const reminderTime = new Date(
          new Date(appointment.datetime).getTime() - 5 * 60 * 1000
        );

        // Create notification for patient
        const { data: patientNotification, error: patientError } = await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: appointment.patient_id,
            type: 'appointment_reminder',
            title: 'Upcoming Appointment Reminder',
            message: `Your appointment is scheduled in 5 minutes.`,
            scheduled_for: reminderTime.toISOString(),
            data: {
              appointment_id: appointment.id,
              appointment_type: appointment.appointment_type,
              appointment_time: appointment.datetime
            }
          })
          .select('id')
          .single();

        if (patientError) {
          console.error(`Failed to schedule patient reminder for appointment ${appointment.id}:`, patientError);
          continue;
        }

        // Create notification for provider (user who created the appointment)
        const { data: providerNotification, error: providerError } = await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: appointment.user_id,
            type: 'appointment_reminder',
            title: 'Upcoming Appointment Reminder',
            message: `You have an appointment starting in 5 minutes.`,
            scheduled_for: reminderTime.toISOString(),
            data: {
              appointment_id: appointment.id,
              appointment_type: appointment.appointment_type,
              appointment_time: appointment.datetime
            }
          })
          .select('id')
          .single();

        if (providerError) {
          console.error(`Failed to schedule provider reminder for appointment ${appointment.id}:`, providerError);
          continue;
        }

        // Update appointment with reminder notification IDs
        const { error: updateError } = await supabaseAdmin
          .from('appointments')
          .update({
            reminder_notification_id: patientNotification.id,
            provider_reminder_notification_id: providerNotification.id
          })
          .eq('id', appointment.id);

        if (updateError) {
          console.error(`Failed to update appointment ${appointment.id} with reminder IDs:`, updateError);
          continue;
        }

        scheduledCount++;
        console.log(`Scheduled reminders for appointment ${appointment.id} at ${reminderTime.toISOString()}`);

      } catch (error) {
        console.error(`Error scheduling reminder for appointment ${appointment.id}:`, error);
        continue;
      }
    }

    console.log(`Successfully scheduled ${scheduledCount} appointment reminders`);

    return NextResponse.json({ 
      success: true, 
      message: `Scheduled ${scheduledCount} appointment reminders`,
      scheduledCount 
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule appointment reminders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}