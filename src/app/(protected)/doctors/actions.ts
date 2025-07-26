'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

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
