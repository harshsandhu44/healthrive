'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface Department {
  id: string;
  name: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export async function getDepartments(): Promise<Department[]> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching departments:', error);
      throw new Error('Failed to fetch departments');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDepartments action:', error);
    throw error;
  }
}

export async function addDepartment(formData: { name: string }) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase.from('departments').insert([
      {
        name: formData.name,
        org_id: orgId,
      },
    ]);

    if (error) {
      console.error('Error adding department:', error);
      throw new Error('Failed to add department');
    }

    revalidatePath('/departments');

    return { success: true };
  } catch (error) {
    console.error('Error in addDepartment action:', error);
    throw error;
  }
}

export async function updateDepartment(id: string, formData: { name: string }) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('departments')
      .update({
        name: formData.name,
      })
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error updating department:', error);
      throw new Error('Failed to update department');
    }

    revalidatePath('/departments');

    return { success: true };
  } catch (error) {
    console.error('Error in updateDepartment action:', error);
    throw error;
  }
}

export async function deleteDepartment(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error deleting department:', error);
      throw new Error('Failed to delete department');
    }

    revalidatePath('/departments');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteDepartment action:', error);
    throw error;
  }
}
