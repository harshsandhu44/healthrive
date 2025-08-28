'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/db/server'

export async function deleteAppointment(appointmentId: string) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Delete the appointment
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId)
      .eq('user_id', user.id) // Ensure user can only delete their own appointments

    if (error) {
      console.error('Delete appointment error:', error)
      throw new Error('Failed to delete appointment')
    }

    // Revalidate the appointments page
    revalidatePath('/appointments')

    return { success: true }
  } catch (error) {
    console.error('Delete appointment action error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete appointment' 
    }
  }
}

export async function getAppointmentDetails(appointmentId: string) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get appointment details with patient info
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!inner(first_name, last_name)
      `)
      .eq('id', appointmentId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Get appointment details error:', error)
      throw new Error('Failed to get appointment details')
    }

    return { success: true, appointment }
  } catch (error) {
    console.error('Get appointment details action error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get appointment details' 
    }
  }
}