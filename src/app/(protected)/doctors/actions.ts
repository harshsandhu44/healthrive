'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface Department {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'rather not say';
  department_id: string | null;
  department_name?: string | null;
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
      .select(
        `
        *,
        departments:department_id (
          name
        )
      `
      )
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Failed to fetch doctors');
    }

    // Transform the data to include department_name
    const transformedData = (data || []).map(
      (doctor: Doctor & { departments?: { name: string } | null }) => ({
        ...doctor,
        department_name: doctor.departments?.name || null,
      })
    );

    return transformedData;
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

export async function updateDoctor(
  id: string,
  formData: {
    name: string;
    specialization: string;
    gender: 'male' | 'female' | 'rather not say';
    department_id?: string;
  }
) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('doctors')
      .update({
        name: formData.name,
        specialization: formData.specialization,
        gender: formData.gender,
        department_id: formData.department_id || null,
      })
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error updating doctor:', error);
      throw new Error('Failed to update doctor');
    }

    revalidatePath('/doctors');

    return { success: true };
  } catch (error) {
    console.error('Error in updateDoctor action:', error);
    throw error;
  }
}

export async function deleteDoctor(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error deleting doctor:', error);
      throw new Error('Failed to delete doctor');
    }

    revalidatePath('/doctors');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteDoctor action:', error);
    throw error;
  }
}

export async function getDepartmentsForDoctor(): Promise<Department[]> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('departments')
      .select('id, name')
      .eq('org_id', orgId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching departments:', error);
      throw new Error('Failed to fetch departments');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDepartmentsForDoctor action:', error);
    throw error;
  }
}
