// Re-export Supabase generated types for easier imports
import type { Tables } from './supabase'

export type PatientRow = Tables<'patients'>
export type DoctorRow = Tables<'doctors'>
export type AppointmentRow = Tables<'appointments'>
export type DiagnosisRow = Tables<'diagnoses'>
export type MedicationRow = Tables<'medications'>
export type ProcedureRow = Tables<'procedures'>
export type LabResultRow = Tables<'lab_results'>
export type VitalSignsRow = Tables<'vital_signs'>
export type ClinicalNoteRow = Tables<'clinical_notes'>

// Extended types with joined data
export interface PatientWithMedicalData extends PatientRow {
  diagnoses: DiagnosisRow[]
  medications: MedicationRow[]
  procedures: ProcedureRow[]
  lab_results: LabResultRow[]
  vital_signs: VitalSignsRow[]
  clinical_notes: ClinicalNoteRow[]
}