'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface Patient {
  id: string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  medical_records: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export async function getPatients(): Promise<Patient[]> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    // Only show patients who have appointments with this organization
    const { data, error } = await supabase
      .from('patients')
      .select(
        `
        *,
        appointments:appointments!inner(org_id)
      `
      )
      .eq('appointments.org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patients:', error);
      throw new Error('Failed to fetch patients');
    }

    // Remove the appointments relation from the returned data for cleaner response
    const cleanedData = (data || []).map(
      ({ appointments: _appointments, ...patient }) => patient
    );

    return cleanedData;
  } catch (error) {
    console.error('Error in getPatients action:', error);
    throw error;
  }
}

export async function addPatient(formData: {
  full_name: string;
  email?: string;
  phone_number?: string;
  medical_records?: Record<string, unknown>;
}) {
  try {
    await auth();

    const supabase = createClient();

    const { error } = await supabase.from('patients').insert([
      {
        full_name: formData.full_name,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        medical_records: formData.medical_records || null,
      },
    ]);

    if (error) {
      console.error('Error adding patient:', error);
      throw new Error('Failed to add patient');
    }

    revalidatePath('/patients');

    return { success: true };
  } catch (error) {
    console.error('Error in addPatient action:', error);
    throw error;
  }
}

export async function updatePatient(
  id: string,
  formData: {
    full_name: string;
    email?: string;
    phone_number?: string;
    medical_records?: Record<string, unknown>;
  }
) {
  try {
    await auth();

    const supabase = createClient();

    const { error } = await supabase
      .from('patients')
      .update({
        full_name: formData.full_name,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        medical_records: formData.medical_records || null,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating patient:', error);
      throw new Error('Failed to update patient');
    }

    revalidatePath('/patients');

    return { success: true };
  } catch (error) {
    console.error('Error in updatePatient action:', error);
    throw error;
  }
}

export async function deletePatient(id: string) {
  try {
    await auth();

    const supabase = createClient();

    const { error } = await supabase.from('patients').delete().eq('id', id);

    if (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Failed to delete patient');
    }

    revalidatePath('/patients');

    return { success: true };
  } catch (error) {
    console.error('Error in deletePatient action:', error);
    throw error;
  }
}

export async function searchPatients(query: string): Promise<Patient[]> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    // Only search patients who have appointments with this organization
    const { data, error } = await supabase
      .from('patients')
      .select(
        `
        *,
        appointments:appointments!inner(org_id)
      `
      )
      .eq('appointments.org_id', orgId)
      .or(
        `full_name.ilike.%${query}%,phone_number.ilike.%${query}%,id.ilike.%${query}%`
      )
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error searching patients:', error);
      throw new Error('Failed to search patients');
    }

    // Remove the appointments relation from the returned data for cleaner response
    const cleanedData = (data || []).map(
      ({ appointments: _appointments, ...patient }) => patient
    );

    return cleanedData;
  } catch (error) {
    console.error('Error in searchPatients action:', error);
    throw error;
  }
}
