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