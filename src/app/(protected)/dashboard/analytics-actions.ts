'use server';

import { auth } from '@clerk/nextjs/server';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

import { createClient } from '@/lib/supabase/server';

export interface DashboardMetrics {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface AppointmentTrend {
  date: string;
  appointments: number;
  completed: number;
  cancelled: number;
}

export interface DepartmentStats {
  name: string;
  totalAppointments: number;
  totalDoctors: number;
  avgAppointmentsPerDoctor: number;
}

export interface DoctorPerformance {
  id: string;
  name: string;
  specialization: string;
  department: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  completionRate: number;
}

export interface PatientDemographics {
  totalPatients: number;
  newPatientsThisMonth: number;
  patientsWithEmail: number;
  patientsWithPhone: number;
  patientsWithMedicalRecords: number;
}

export interface RecentActivity {
  id: string;
  type:
    | 'appointment_created'
    | 'appointment_updated'
    | 'patient_created'
    | 'doctor_created';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error('Organization not found');
    }

    const supabase = createClient();
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Get total patients who have appointments with this organization
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*, appointments:appointments!inner(org_id)', {
        count: 'exact',
        head: true,
      })
      .eq('appointments.org_id', orgId);

    // Get total doctors for this org
    const { count: totalDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId);

    // Get total appointments for this org
    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId);

    // Get today's appointments
    const { count: todayAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .gte('datetime', startOfToday.toISOString())
      .lte('datetime', endOfToday.toISOString());

    // Get appointments by status
    const { count: pendingAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'pending');

    const { count: confirmedAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'confirmed');

    const { count: completedAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'completed');

    const { count: cancelledAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'cancelled');

    return {
      totalPatients: totalPatients || 0,
      totalDoctors: totalDoctors || 0,
      totalAppointments: totalAppointments || 0,
      todayAppointments: todayAppointments || 0,
      pendingAppointments: pendingAppointments || 0,
      confirmedAppointments: confirmedAppointments || 0,
      completedAppointments: completedAppointments || 0,
      cancelledAppointments: cancelledAppointments || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}

export async function getAppointmentTrends(
  days: number = 7
): Promise<AppointmentTrend[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error('Organization not found');
    }

    const supabase = createClient();
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);

    const { data, error } = await supabase
      .from('appointments')
      .select('datetime, status')
      .eq('org_id', orgId)
      .gte('datetime', startOfDay(startDate).toISOString())
      .lte('datetime', endOfDay(endDate).toISOString())
      .order('datetime');

    if (error) {
      throw error;
    }

    // Group by date
    const trendsMap = new Map<
      string,
      { appointments: number; completed: number; cancelled: number }
    >();

    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = subDays(endDate, days - 1 - i);
      const dateKey = format(date, 'yyyy-MM-dd');
      trendsMap.set(dateKey, { appointments: 0, completed: 0, cancelled: 0 });
    }

    // Populate with data
    data?.forEach(appointment => {
      const dateKey = format(new Date(appointment.datetime), 'yyyy-MM-dd');
      const stats = trendsMap.get(dateKey);
      if (stats) {
        stats.appointments++;
        if (appointment.status === 'completed') stats.completed++;
        if (appointment.status === 'cancelled') stats.cancelled++;
      }
    });

    return Array.from(trendsMap.entries()).map(([date, stats]) => ({
      date,
      ...stats,
    }));
  } catch (error) {
    console.error('Error fetching appointment trends:', error);
    throw error;
  }
}

export async function getDepartmentStats(): Promise<DepartmentStats[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error('Organization not found');
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('departments')
      .select(
        `
        name,
        doctors:doctors(count),
        appointments:doctors(appointments(count))
      `
      )
      .eq('org_id', orgId);

    if (error) {
      throw error;
    }

    return (data || []).map(dept => {
      const doctorCount = dept.doctors?.[0]?.count || 0;
      const appointmentCount =
        dept.appointments?.reduce(
          (total, doctor) => total + (doctor.appointments?.[0]?.count || 0),
          0
        ) || 0;

      return {
        name: dept.name,
        totalDoctors: doctorCount,
        totalAppointments: appointmentCount,
        avgAppointmentsPerDoctor:
          doctorCount > 0 ? Math.round(appointmentCount / doctorCount) : 0,
      };
    });
  } catch (error) {
    console.error('Error fetching department stats:', error);
    throw error;
  }
}

export async function getDoctorPerformance(): Promise<DoctorPerformance[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error('Organization not found');
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('doctors')
      .select(
        `
        id,
        name,
        specialization,
        departments:department_id(name),
        appointments(status)
      `
      )
      .eq('org_id', orgId);

    if (error) {
      throw error;
    }

    return (data || []).map(doctor => {
      const appointments = doctor.appointments || [];
      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(
        a => a.status === 'completed'
      ).length;
      const cancelledAppointments = appointments.filter(
        a => a.status === 'cancelled'
      ).length;
      const completionRate =
        totalAppointments > 0
          ? (completedAppointments / totalAppointments) * 100
          : 0;

      return {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        department: doctor.departments?.name || 'No Department',
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        completionRate: Math.round(completionRate),
      };
    });
  } catch (error) {
    console.error('Error fetching doctor performance:', error);
    throw error;
  }
}

export async function getPatientDemographics(): Promise<PatientDemographics> {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const supabase = createClient();
    const thirtyDaysAgo = subDays(new Date(), 30);

    // Get total patients who have appointments with this organization
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*, appointments:appointments!inner(org_id)', {
        count: 'exact',
        head: true,
      })
      .eq('appointments.org_id', orgId);

    // Get new patients this month who have appointments with this organization
    const { count: newPatientsThisMonth } = await supabase
      .from('patients')
      .select('*, appointments:appointments!inner(org_id)', {
        count: 'exact',
        head: true,
      })
      .eq('appointments.org_id', orgId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Get patients with contact info who have appointments with this organization
    const { count: patientsWithEmail } = await supabase
      .from('patients')
      .select('*, appointments:appointments!inner(org_id)', {
        count: 'exact',
        head: true,
      })
      .eq('appointments.org_id', orgId)
      .not('email', 'is', null);

    const { count: patientsWithPhone } = await supabase
      .from('patients')
      .select('*, appointments:appointments!inner(org_id)', {
        count: 'exact',
        head: true,
      })
      .eq('appointments.org_id', orgId)
      .not('phone_number', 'is', null);

    const { count: patientsWithMedicalRecords } = await supabase
      .from('patients')
      .select('*, appointments:appointments!inner(org_id)', {
        count: 'exact',
        head: true,
      })
      .eq('appointments.org_id', orgId)
      .not('medical_records', 'is', null);

    return {
      totalPatients: totalPatients || 0,
      newPatientsThisMonth: newPatientsThisMonth || 0,
      patientsWithEmail: patientsWithEmail || 0,
      patientsWithPhone: patientsWithPhone || 0,
      patientsWithMedicalRecords: patientsWithMedicalRecords || 0,
    };
  } catch (error) {
    console.error('Error fetching patient demographics:', error);
    throw error;
  }
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error('Organization not found');
    }

    const supabase = createClient();

    // Get recent appointments
    const { data: recentAppointments } = await supabase
      .from('appointments')
      .select(
        `
        id,
        created_at,
        updated_at,
        status,
        datetime,
        patients:patient_id(full_name),
        doctors:doctor_id(name)
      `
      )
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent patients who have appointments with this organization
    const { data: recentPatients } = await supabase
      .from('patients')
      .select(
        `
        id, 
        full_name, 
        created_at,
        appointments:appointments!inner(org_id)
      `
      )
      .eq('appointments.org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(5);

    const activities: RecentActivity[] = [];

    // Add appointment activities
    recentAppointments?.forEach(appointment => {
      activities.push({
        id: `appointment-${appointment.id}`,
        type: 'appointment_created',
        title: 'New Appointment',
        description: `${appointment.patients?.full_name} with ${appointment.doctors?.name}`,
        timestamp: appointment.created_at,
        metadata: {
          appointmentId: appointment.id,
          status: appointment.status,
          datetime: appointment.datetime,
        },
      });
    });

    // Add patient activities
    recentPatients?.forEach(patient => {
      activities.push({
        id: `patient-${patient.id}`,
        type: 'patient_created',
        title: 'New Patient',
        description: `${patient.full_name} registered`,
        timestamp: patient.created_at,
        metadata: {
          patientId: patient.id,
        },
      });
    });

    // Sort all activities by timestamp
    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 15);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}
