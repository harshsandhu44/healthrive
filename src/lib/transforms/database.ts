import type { 
  PatientWithMedicalData, 
  DoctorRow, 
  AppointmentRow 
} from '@/lib/types/database'
import type { 
  Patient, 
  Doctor, 
  Appointment
} from '@/lib/types/entities'

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Transform database patient with medical data to Patient interface
export function transformPatientWithMedicalData(dbPatient: PatientWithMedicalData): Patient {
  return {
    // Demographics
    id: dbPatient.id,
    name: dbPatient.name,
    dateOfBirth: dbPatient.date_of_birth,
    age: calculateAge(dbPatient.date_of_birth),
    gender: dbPatient.gender,
    contactInfo: {
      address: dbPatient.address || '',
      phone: dbPatient.phone || '',
      email: dbPatient.email || '',
    },
    emergencyContact: {
      name: dbPatient.emergency_contact_name || '',
      phone: dbPatient.emergency_contact_phone || '',
      relationship: dbPatient.emergency_contact_relationship || '',
    },
    
    // Medical History
    diagnoses: dbPatient.diagnoses?.map(d => ({
      code: d.code || '',
      description: d.description || '',
      dateOfDiagnosis: d.date_of_diagnosis || '',
      status: (d.status as 'active' | 'resolved' | 'chronic') || 'active',
    })) || [],
    
    medications: dbPatient.medications?.map(m => ({
      name: m.name,
      dosage: m.dosage || '',
      frequency: m.frequency || '',
      route: (m.route as 'oral' | 'intravenous' | 'topical' | 'injection' | 'inhalation') || 'oral',
      startDate: m.start_date || '',
      endDate: m.end_date || null,
      reason: m.reason || '',
    })) || [],
    
    procedures: dbPatient.procedures?.map(p => ({
      code: p.code || '',
      description: p.description || '',
      dateOfProcedure: p.date_of_procedure || '',
      provider: p.provider || '',
    })) || [],
    
    labResults: dbPatient.lab_results?.map(l => ({
      testName: l.test_name || '',
      result: l.result || '',
      units: l.units || '',
      referenceRange: l.reference_range || '',
      dateOfTest: l.date_of_test || '',
    })) || [],
    
    vitalSigns: dbPatient.vital_signs?.map(v => ({
      dateTime: v.date_time || '',
      bloodPressureSystolic: v.blood_pressure_systolic || 0,
      bloodPressureDiastolic: v.blood_pressure_diastolic || 0,
      heartRate: v.heart_rate || 0,
      temperature: v.temperature || 0,
      respiratoryRate: v.respiratory_rate || 0,
      weight: v.weight || 0,
      height: v.height || 0,
    })) || [],
    
    clinicalNotes: dbPatient.clinical_notes?.map(n => ({
      dateTime: n.date_time || '',
      noteType: (n.note_type as 'progress' | 'discharge' | 'admission' | 'consultation') || 'progress',
      content: n.content || '',
      provider: n.provider || '',
    })) || [],
    
    // Other Information
    allergies: dbPatient.allergies || [],
    socialHistory: {
      smokingStatus: (dbPatient.smoking_status as 'never' | 'former' | 'current') || 'never',
      alcoholConsumption: (dbPatient.alcohol_consumption as 'none' | 'occasional' | 'moderate' | 'heavy') || 'none',
    },
    familyHistory: dbPatient.family_history || [],
    insurance: {
      provider: dbPatient.insurance_provider || '',
      policyNumber: dbPatient.insurance_policy_number || '',
    },
    
    // System Information
    status: (dbPatient.status as 'active' | 'inactive' | 'discharged') || 'active',
    registrationDate: dbPatient.registration_date || dbPatient.created_at,
  }
}

// Transform database doctor to Doctor interface
export function transformDoctorRow(dbDoctor: DoctorRow): Doctor {
  return {
    id: dbDoctor.id,
    name: dbDoctor.name,
    dateOfBirth: dbDoctor.date_of_birth || '',
    specialization: dbDoctor.specialization || '',
    gender: dbDoctor.gender || 'male',
    contactInfo: {
      phone: dbDoctor.phone || '',
      email: dbDoctor.email || '',
    },
  }
}

// Transform database appointment to Appointment interface
export function transformAppointmentRow(dbAppointment: AppointmentRow): Appointment {
  return {
    id: dbAppointment.id,
    patientName: dbAppointment.patient_name,
    patientId: dbAppointment.patient_id || '',
    time: dbAppointment.time || '',
    type: (dbAppointment.type as 'consultation' | 'follow-up' | 'surgery' | 'emergency') || 'consultation',
    status: (dbAppointment.status as 'scheduled' | 'in-progress' | 'completed' | 'cancelled') || 'scheduled',
    doctor: dbAppointment.doctor || '',
    notes: dbAppointment.notes || null,
  }
}