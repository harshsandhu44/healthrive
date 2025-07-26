'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'rather not say';
  department_id: string | null;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Failed to fetch doctors');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDoctors action:', error);
    throw error;
  }
}

export async function addDoctor(formData: {
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'rather not say';
  department_id?: string;
}) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase.from('doctors').insert([
      {
        name: formData.name,
        specialization: formData.specialization,
        gender: formData.gender,
        department_id: formData.department_id || null,
        org_id: orgId,
      },
    ]);

    if (error) {
      console.error('Error adding doctor:', error);
      throw new Error('Failed to add doctor');
    }

    revalidatePath('/doctors');

    return { success: true };
  } catch (error) {
    console.error('Error in addDoctor action:', error);
    throw error;
  }
}
