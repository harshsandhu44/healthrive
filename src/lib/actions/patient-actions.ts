'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/db/server'

export async function deletePatient(patientId: string) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Delete the patient (appointments will be cascaded due to foreign key constraint)
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId)
      .eq('user_id', user.id) // Ensure user can only delete their own patients

    if (error) {
      console.error('Delete patient error:', error)
      throw new Error('Failed to delete patient')
    }

    // Revalidate both patients and appointments pages since appointments may be affected
    revalidatePath('/patients')
    revalidatePath('/appointments')

    return { success: true }
  } catch (error) {
    console.error('Delete patient action error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete patient' 
    }
  }
}

export async function getPatientWithAppointments(patientId: string) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get patient details
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .eq('user_id', user.id)
      .single()

    if (patientError) {
      console.error('Get patient error:', patientError)
      throw new Error('Failed to get patient details')
    }

    // Get count of associated appointments
    const { count: appointmentCount, error: countError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId)
      .eq('user_id', user.id)

    if (countError) {
      console.error('Get appointment count error:', countError)
      throw new Error('Failed to get appointment count')
    }

    return { success: true, patient, appointmentCount: appointmentCount || 0 }
  } catch (error) {
    console.error('Get patient with appointments action error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get patient details' 
    }
  }
}