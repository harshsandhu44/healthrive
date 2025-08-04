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

export async function createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    // Create patient record
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .insert({
        organization_id: organizationId,
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        date_of_birth: patientData.dateOfBirth,
        contact_phone: patientData.contactInfo.phone,
        contact_email: patientData.contactInfo.email,
        emergency_contact_name: patientData.emergencyContact.name,
        emergency_contact_phone: patientData.emergencyContact.phone,
        emergency_contact_relationship: patientData.emergencyContact.relationship,
        insurance_provider: patientData.insurance.provider,
        insurance_policy_number: patientData.insurance.policyNumber,
        allergies: patientData.allergies,
        family_history: patientData.familyHistory,
        smoking_status: patientData.socialHistory.smokingStatus,
        alcohol_consumption: patientData.socialHistory.alcoholConsumption,
      })
      .select()
      .single()
    
    if (patientError) {
      console.error('Error creating patient:', patientError)
      throw patientError
    }
    
    return await getPatient(patient.id) as Patient
  } catch (error) {
    console.error('Error in createPatient:', error)
    throw error
  }
}

export async function updatePatient(id: string, patientData: Partial<Omit<Patient, 'id'>>): Promise<Patient> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    const updateData: any = {}
    
    if (patientData.name) updateData.name = patientData.name
    if (patientData.age) updateData.age = patientData.age
    if (patientData.gender) updateData.gender = patientData.gender
    if (patientData.dateOfBirth) updateData.date_of_birth = patientData.dateOfBirth
    if (patientData.contactInfo?.phone) updateData.contact_phone = patientData.contactInfo.phone
    if (patientData.contactInfo?.email) updateData.contact_email = patientData.contactInfo.email
    if (patientData.emergencyContact?.name) updateData.emergency_contact_name = patientData.emergencyContact.name
    if (patientData.emergencyContact?.phone) updateData.emergency_contact_phone = patientData.emergencyContact.phone
    if (patientData.emergencyContact?.relationship) updateData.emergency_contact_relationship = patientData.emergencyContact.relationship
    if (patientData.insurance?.provider) updateData.insurance_provider = patientData.insurance.provider
    if (patientData.insurance?.policyNumber) updateData.insurance_policy_number = patientData.insurance.policyNumber
    if (patientData.allergies) updateData.allergies = patientData.allergies
    if (patientData.familyHistory) updateData.family_history = patientData.familyHistory
    if (patientData.socialHistory?.smokingStatus) updateData.smoking_status = patientData.socialHistory.smokingStatus
    if (patientData.socialHistory?.alcoholConsumption) updateData.alcohol_consumption = patientData.socialHistory.alcoholConsumption
    
    const { error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .eq('organization_id', organizationId)
    
    if (error) {
      console.error('Error updating patient:', error)
      throw error
    }
    
    return await getPatient(id) as Patient
  } catch (error) {
    console.error('Error in updatePatient:', error)
    throw error
  }
}

export async function deletePatient(id: string): Promise<void> {
  try {
    const { orgId } = await auth()
    const organizationId = orgId || FALLBACK_ORG_ID
    
    const supabase = await createClient()
    
    // Delete related medical records first (due to foreign key constraints)
    await Promise.all([
      supabase.from('diagnoses').delete().eq('patient_id', id),
      supabase.from('medications').delete().eq('patient_id', id),
      supabase.from('procedures').delete().eq('patient_id', id),
      supabase.from('lab_results').delete().eq('patient_id', id),
      supabase.from('vital_signs').delete().eq('patient_id', id),
      supabase.from('clinical_notes').delete().eq('patient_id', id),
    ])
    
    // Delete patient record
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId)
    
    if (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in deletePatient:', error)
    throw error
  }
}