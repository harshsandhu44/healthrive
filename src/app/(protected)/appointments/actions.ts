'use server'

import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import type { AppointmentRow } from '@/lib/types/database'
import type { Appointment } from '@/lib/mock-data'
import { transformAppointmentRow } from '@/lib/transforms/database'

const FALLBACK_ORG_ID = 'org_30ml1ttUdsl67pQecd3KPXnBVHT' // Development fallback

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('organization_id', organizationId)
      .order('time', { ascending: true })
    
    if (error) {
      console.error('Error fetching appointments:', error)
      throw error
    }
    
    return (data as AppointmentRow[]).map(transformAppointmentRow)
  } catch (error) {
    console.error('Error in getAppointments:', error)
    throw error
  }
}

export async function getTodaysAppointments(): Promise<Appointment[]> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('time', startOfDay.toISOString())
      .lt('time', endOfDay.toISOString())
      .order('time', { ascending: true })
    
    if (error) {
      console.error('Error fetching today\'s appointments:', error)
      throw error
    }
    
    return (data as AppointmentRow[]).map(transformAppointmentRow)
  } catch (error) {
    console.error('Error in getTodaysAppointments:', error)
    throw error
  }
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching appointment:', error)
      throw error
    }
    
    return transformAppointmentRow(data as AppointmentRow)
  } catch (error) {
    console.error('Error in getAppointment:', error)
    throw error
  }
}

export async function createAppointment(appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        organization_id: organizationId,
        patient_name: appointmentData.patientName,
        doctor_name: appointmentData.doctorName,
        time: appointmentData.time,
        type: appointmentData.type,
        status: appointmentData.status,
        duration: appointmentData.duration,
        reason: appointmentData.reason,
        location: appointmentData.location,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating appointment:', error)
      throw error
    }
    
    return transformAppointmentRow(appointment as AppointmentRow)
  } catch (error) {
    console.error('Error in createAppointment:', error)
    throw error
  }
}

export async function updateAppointment(id: string, appointmentData: Partial<Omit<Appointment, 'id'>>): Promise<Appointment> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const updateData: any = {}
    
    if (appointmentData.patientName) updateData.patient_name = appointmentData.patientName
    if (appointmentData.doctorName) updateData.doctor_name = appointmentData.doctorName
    if (appointmentData.time) updateData.time = appointmentData.time
    if (appointmentData.type) updateData.type = appointmentData.type
    if (appointmentData.status) updateData.status = appointmentData.status
    if (appointmentData.duration) updateData.duration = appointmentData.duration
    if (appointmentData.reason) updateData.reason = appointmentData.reason
    if (appointmentData.location) updateData.location = appointmentData.location
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating appointment:', error)
      throw error
    }
    
    return transformAppointmentRow(appointment as AppointmentRow)
  } catch (error) {
    console.error('Error in updateAppointment:', error)
    throw error
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId)
    
    if (error) {
      console.error('Error deleting appointment:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in deleteAppointment:', error)
    throw error
  }
}