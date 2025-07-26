// Strict TypeScript definitions for healthcare patient data
// Ensures HIPAA compliance and data integrity

export interface MedicalRecord {
  // Allergies information
  allergies?: Array<{
    name: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
    reaction?: string;
    confirmedDate?: string;
  }>;

  // Current medications
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    prescribedDate: string;
    prescribedBy?: string;
    endDate?: string;
    status: 'active' | 'discontinued' | 'completed';
  }>;

  // Medical conditions
  conditions?: Array<{
    name: string;
    diagnosedDate: string;
    status: 'active' | 'resolved' | 'chronic' | 'under-investigation';
    severity?: 'mild' | 'moderate' | 'severe';
    diagnosedBy?: string;
  }>;

  // Vital signs (most recent)
  vitals?: {
    bloodPressure?: {
      systolic: number;
      diastolic: number;
      unit: 'mmHg';
    };
    heartRate?: {
      value: number;
      unit: 'bpm';
    };
    temperature?: {
      value: number;
      unit: 'celsius' | 'fahrenheit';
    };
    weight?: {
      value: number;
      unit: 'kg' | 'lbs';
    };
    height?: {
      value: number;
      unit: 'cm' | 'inches';
    };
    oxygenSaturation?: {
      value: number;
      unit: '%';
    };
    lastRecorded: string; // ISO date string
  };

  // Emergency contact information
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
  };

  // Insurance information (minimal for privacy)
  insurance?: {
    provider: string;
    policyNumber: string; // Should be encrypted
    groupNumber?: string;
    effectiveDate?: string;
    expirationDate?: string;
  };

  // General notes (should be sanitized)
  notes?: string;

  // Blood type
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

  // Preferred language
  preferredLanguage?: string;

  // Accessibility needs
  accessibilityNeeds?: string[];

  // Last updated information
  lastUpdated: string; // ISO date string
  updatedBy: string; // User ID who made the update
}

export interface Patient {
  id: string; // Format: pt-xxxx
  full_name: string;
  email?: string;
  phone_number?: string;
  medical_records?: MedicalRecord;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// For form validation and API requests
export interface CreatePatientRequest {
  full_name: string;
  email?: string;
  phone_number?: string;
  medical_records?: Partial<MedicalRecord>;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: string;
}

// For API responses
export interface PatientResponse extends Patient {
  // Can include computed fields or additional metadata
  hasActiveAppointments?: boolean;
  lastAppointmentDate?: string;
  nextAppointmentDate?: string;
}

// Validation constraints
export const PatientValidation = {
  fullName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phoneNumber: {
    pattern: /^\+?[\d\s()-]{10,15}$/,
  },
  medicalRecords: {
    maxNotesLength: 10000,
    maxAllergyNameLength: 100,
    maxMedicationNameLength: 200,
    maxConditionNameLength: 200,
  },
} as const;

// Sensitive data fields that require special handling
export const SensitivePatientFields = [
  'email',
  'phone_number',
  'medical_records',
  'medical_records.insurance',
  'medical_records.emergencyContact',
] as const;

export type SensitivePatientField = (typeof SensitivePatientFields)[number];
