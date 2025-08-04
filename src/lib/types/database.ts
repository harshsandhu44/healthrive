// Database row types matching SQL schema
export interface PatientRow {
  id: string
  organization_id: string
  name: string
  date_of_birth: string
  gender: 'male' | 'female'
  address: string | null
  phone: string | null
  email: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  insurance_provider: string | null
  insurance_policy_number: string | null
  smoking_status: string | null
  alcohol_consumption: string | null
  allergies: string[] | null
  family_history: string[] | null
  status: string
  registration_date: string | null
  created_at: string
  updated_at: string
}

export interface DoctorRow {
  id: string
  organization_id: string
  name: string
  date_of_birth: string | null
  gender: 'male' | 'female' | null
  specialization: string | null
  phone: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface AppointmentRow {
  id: string
  organization_id: string
  patient_name: string
  patient_id: string | null
  time: string | null
  type: string | null
  status: string | null
  doctor: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DiagnosisRow {
  id: string
  patient_id: string
  code: string | null
  description: string | null
  date_of_diagnosis: string | null
  status: string | null
  created_at: string
}

export interface MedicationRow {
  id: string
  patient_id: string
  name: string
  dosage: string | null
  frequency: string | null
  route: string | null
  start_date: string | null
  end_date: string | null
  reason: string | null
  created_at: string
}

export interface ProcedureRow {
  id: string
  patient_id: string
  code: string | null
  description: string | null
  date_of_procedure: string | null
  provider: string | null
  created_at: string
}

export interface LabResultRow {
  id: string
  patient_id: string
  test_name: string | null
  result: string | null
  units: string | null
  reference_range: string | null
  date_of_test: string | null
  created_at: string
}

export interface VitalSignsRow {
  id: string
  patient_id: string
  date_time: string | null
  blood_pressure_systolic: number | null
  blood_pressure_diastolic: number | null
  heart_rate: number | null
  temperature: number | null
  respiratory_rate: number | null
  weight: number | null
  height: number | null
  created_at: string
}

export interface ClinicalNoteRow {
  id: string
  patient_id: string
  date_time: string | null
  note_type: string | null
  content: string | null
  provider: string | null
  created_at: string
}

// Extended types with joined data
export interface PatientWithMedicalData extends PatientRow {
  diagnoses: DiagnosisRow[]
  medications: MedicationRow[]
  procedures: ProcedureRow[]
  lab_results: LabResultRow[]
  vital_signs: VitalSignsRow[]
  clinical_notes: ClinicalNoteRow[]
}