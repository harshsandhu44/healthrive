'use server'

import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import type { DoctorRow } from '@/lib/types/database'
import type { Doctor } from '@/lib/mock-data'
import { transformDoctorRow } from '@/lib/transforms/database'

const FALLBACK_ORG_ID = 'org_30ml1ttUdsl67pQecd3KPXnBVHT' // Development fallback

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name')
    
    if (error) {
      console.error('Error fetching doctors:', error)
      throw error
    }
    
    return (data as DoctorRow[]).map(transformDoctorRow)
  } catch (error) {
    console.error('Error in getDoctors:', error)
    throw error
  }
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching doctor:', error)
      throw error
    }
    
    return transformDoctorRow(data as DoctorRow)
  } catch (error) {
    console.error('Error in getDoctor:', error)
    throw error
  }
}

export async function createDoctor(doctorData: Omit<Doctor, 'id'>): Promise<Doctor> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data: doctor, error } = await supabase
      .from('doctors')
      .insert({
        organization_id: organizationId,
        name: doctorData.name,
        date_of_birth: doctorData.dateOfBirth,
        specialization: doctorData.specialization,
        gender: doctorData.gender,
        contact_phone: doctorData.contactInfo.phone,
        contact_email: doctorData.contactInfo.email,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating doctor:', error)
      throw error
    }
    
    return transformDoctorRow(doctor as DoctorRow)
  } catch (error) {
    console.error('Error in createDoctor:', error)
    throw error
  }
}

export async function updateDoctor(id: string, doctorData: Partial<Omit<Doctor, 'id'>>): Promise<Doctor> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const updateData: any = {}
    
    if (doctorData.name) updateData.name = doctorData.name
    if (doctorData.dateOfBirth) updateData.date_of_birth = doctorData.dateOfBirth
    if (doctorData.specialization) updateData.specialization = doctorData.specialization
    if (doctorData.gender) updateData.gender = doctorData.gender
    if (doctorData.contactInfo?.phone) updateData.contact_phone = doctorData.contactInfo.phone
    if (doctorData.contactInfo?.email) updateData.contact_email = doctorData.contactInfo.email
    
    const { data: doctor, error } = await supabase
      .from('doctors')
      .update(updateData)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating doctor:', error)
      throw error
    }
    
    return transformDoctorRow(doctor as DoctorRow)
  } catch (error) {
    console.error('Error in updateDoctor:', error)
    throw error
  }
}

export async function deleteDoctor(id: string): Promise<void> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId)
    
    if (error) {
      console.error('Error deleting doctor:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in deleteDoctor:', error)
    throw error
  }
}