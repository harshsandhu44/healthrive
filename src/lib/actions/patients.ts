'use server'

import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import type { PatientWithMedicalData } from '@/lib/types/database'
import type { Patient } from '@/lib/mock-data'
import { transformPatientWithMedicalData } from '@/lib/transforms/database'

const FALLBACK_ORG_ID = 'org_30ml1ttUdsl67pQecd3KPXnBVHT' // Development fallback

export async function getPatients(): Promise<Patient[]> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        diagnoses(*),
        medications(*),
        procedures(*),
        lab_results(*),
        vital_signs(*),
        clinical_notes(*)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching patients:', error)
      throw error
    }
    
    return (data as PatientWithMedicalData[]).map(transformPatientWithMedicalData)
  } catch (error) {
    console.error('Error in getPatients:', error)
    throw error
  }
}

export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        diagnoses(*),
        medications(*),
        procedures(*),
        lab_results(*),
        vital_signs(*),
        clinical_notes(*)
      `)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching patient:', error)
      throw error
    }
    
    return transformPatientWithMedicalData(data as PatientWithMedicalData)
  } catch (error) {
    console.error('Error in getPatient:', error)
    throw error
  }
}