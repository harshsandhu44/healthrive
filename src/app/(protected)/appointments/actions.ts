'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  datetime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  org_id: string;
  created_at: string;
  updated_at: string;
  patients?: {
    id: string;
    full_name: string;
    phone_number: string | null;
  };
  doctors?: {
    id: string;
    name: string;
    specialization: string;
  };
}

export interface AppointmentWithDetails extends Appointment {
  patient_name: string;
  patient_phone: string | null;
  doctor_name: string;
  doctor_specialization: string;
}

export async function getAppointments(): Promise<AppointmentWithDetails[]> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('appointments')
      .select(
        `
        *,
        patients:patient_id (
          id,
          full_name,
          phone_number
        ),
        doctors:doctor_id (
          id,
          name,
          specialization
        )
      `
      )
      .eq('org_id', orgId)
      .order('datetime', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }

    const transformedData = (data || []).map((appointment: Appointment) => ({
      ...appointment,
      patient_name: appointment.patients?.full_name || 'Unknown Patient',
      patient_phone: appointment.patients?.phone_number || null,
      doctor_name: appointment.doctors?.name || 'Unknown Doctor',
      doctor_specialization: appointment.doctors?.specialization || '',
    }));

    return transformedData;
  } catch (error) {
    console.error('Error in getAppointments action:', error);
    throw error;
  }
}

export async function addAppointment(formData: {
  patient_id: string;
  doctor_id: string;
  datetime: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase.from('appointments').insert([
      {
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        datetime: formData.datetime,
        status: formData.status || 'pending',
        org_id: orgId,
      },
    ]);

    if (error) {
      console.error('Error adding appointment:', error);
      throw new Error('Failed to add appointment');
    }

    revalidatePath('/appointments');

    return { success: true };
  } catch (error) {
    console.error('Error in addAppointment action:', error);
    throw error;
  }
}

export async function updateAppointment(
  id: string,
  formData: {
    patient_id: string;
    doctor_id: string;
    datetime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  }
) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('appointments')
      .update({
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        datetime: formData.datetime,
        status: formData.status,
      })
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment');
    }

    revalidatePath('/appointments');

    return { success: true };
  } catch (error) {
    console.error('Error in updateAppointment action:', error);
    throw error;
  }
}

export async function deleteAppointment(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error deleting appointment:', error);
      throw new Error('Failed to delete appointment');
    }

    revalidatePath('/appointments');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteAppointment action:', error);
    throw error;
  }
}

export async function getDoctorsForAppointment() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found. Please select an organization.');
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('doctors')
      .select('id, name, specialization')
      .eq('org_id', orgId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Failed to fetch doctors');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDoctorsForAppointment action:', error);
    throw error;
  }
}
