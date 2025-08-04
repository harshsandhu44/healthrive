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