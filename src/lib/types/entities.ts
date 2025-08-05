// Frontend-friendly interfaces that transform Supabase types

// Transform Supabase appointment to frontend format
export interface Appointment {
  id: string;
  patientName: string;
  patientId: string | null;
  time: string | null;
  type: string | null;
  status: string | null;
  doctor: string | null;
  notes: string | null;
}

// Transform Supabase patient to frontend format with medical data
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: string | null;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  diagnoses: Diagnosis[];
  medications: Medication[];
  procedures: Procedure[];
  labResults: LabResult[];
  vitalSigns: VitalSigns[];
  clinicalNotes: ClinicalNote[];
  allergies: string[];
  socialHistory: {
    smokingStatus: string | null;
    alcoholConsumption: string | null;
  };
  familyHistory: string[];
  insurance: {
    provider: string;
    policyNumber: string;
  };
  status: string | null;
  registrationDate: string | null;
}

// Transform Supabase doctor to frontend format
export interface Doctor {
  id: string;
  name: string;
  dateOfBirth: string | null;
  specialization: string | null;
  gender: string | null;
  contactInfo: {
    phone: string;
    email: string;
  };
}

// Medical record interfaces for frontend display
export interface Diagnosis {
  code: string | null;
  description: string | null;
  dateOfDiagnosis: string | null;
  status: string | null;
}

export interface Medication {
  name: string;
  dosage: string | null;
  frequency: string | null;
  route: string | null;
  startDate: string | null;
  endDate: string | null;
  reason: string | null;
}

export interface Procedure {
  code: string | null;
  description: string | null;
  dateOfProcedure: string | null;
  provider: string | null;
}

export interface LabResult {
  testName: string | null;
  result: string | null;
  units: string | null;
  referenceRange: string | null;
  dateOfTest: string | null;
}

export interface VitalSigns {
  dateTime: string | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  heartRate: number | null;
  temperature: number | null;
  respiratoryRate: number | null;
  weight: number | null;
  height: number | null;
}

export interface ClinicalNote {
  dateTime: string | null;
  noteType: string | null;
  content: string | null;
  provider: string | null;
}