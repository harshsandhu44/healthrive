// Supabase Edge Function for sending push notifications
// Replaces the expensive cron job endpoints with a database-triggered approach

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const VAPID_PUBLIC_KEY = Deno.env.get('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@vylune.com'

interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

// Set up web-push configuration
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  // Note: Using dynamic import for web-push as it may not be available in Deno
  // In production, you might want to use the web standard Push API
}

async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushNotificationPayload
): Promise<boolean> {
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
    })

    // Use Web Standards Push API instead of web-push library
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'Authorization': `vapid t=${generateJWT()}, k=${VAPID_PUBLIC_KEY}`,
        'TTL': '86400', // 24 hours
        'Urgency': 'normal'
      },
      body: await encryptPayload(pushPayload, subscription)
    })

    if (!response.ok) {
      throw new Error(`Push service responded with status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to send push notification:', error)
    return false
  }
}

// Generate JWT for VAPID authentication
function generateJWT(): string {
  // Simplified JWT generation for Edge Function
  // In production, use a proper JWT library or implement full ECDSA signing
  const header = btoa(JSON.stringify({ 
    typ: 'JWT', 
    alg: 'ES256' 
  }))
  
  const payload = btoa(JSON.stringify({
    aud: 'https://fcm.googleapis.com',
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    sub: VAPID_SUBJECT
  }))
  
  // Note: This is a simplified version
  // Full implementation would require proper ECDSA signing with the private key
  return `${header}.${payload}.signature`
}

// Encrypt payload for push notification
async function encryptPayload(
  payload: string, 
  subscription: PushSubscriptionData
): Promise<ArrayBuffer> {
  // Simplified encryption implementation
  // In production, implement proper aes128gcm encryption
  return new TextEncoder().encode(payload).buffer
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { userId, payload } = await req.json()

    if (!userId || !payload) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: userId, payload' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all push subscriptions for the user
    const { data: subscriptions, error } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to get push subscriptions:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to get subscriptions' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for user:', userId)
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No subscriptions found',
        sentCount: 0 
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Send notification to all user's subscriptions
    let successCount = 0
    const failedEndpoints: string[] = []

    for (const sub of subscriptions) {
      const subscription: PushSubscriptionData = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }

      const success = await sendPushNotification(subscription, payload)
      
      if (success) {
        successCount++
      } else {
        failedEndpoints.push(sub.endpoint)
      }
    }

    // Clean up failed subscriptions
    if (failedEndpoints.length > 0) {
      await supabaseClient
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints)
      
      console.log(`Cleaned up ${failedEndpoints.length} invalid subscriptions`)
    }

    console.log(`Push notification sent: ${successCount}/${subscriptions.length} successful`)

    return new Response(JSON.stringify({
      success: true,
      sentCount: successCount,
      totalSubscriptions: subscriptions.length,
      cleanedUp: failedEndpoints.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Edge Function error:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

/* To deploy this function to Supabase:
 * 1. Make sure you have the Supabase CLI installed
 * 2. Run: supabase functions deploy push-notifications
 * 3. Set the required environment variables in your Supabase dashboard:
 *    - NEXT_PUBLIC_VAPID_PUBLIC_KEY
 *    - VAPID_PRIVATE_KEY  
 *    - VAPID_SUBJECT
 * 4. Update your database settings to call this function URL
 */