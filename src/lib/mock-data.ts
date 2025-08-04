export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  type: "consultation" | "follow-up" | "surgery" | "emergency";
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  doctor: string;
  notes?: string;
}

export interface Diagnosis {
  code: string; // ICD-10 code
  description: string;
  dateOfDiagnosis: string;
  status: "active" | "resolved" | "chronic";
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  route: "oral" | "intravenous" | "topical" | "injection" | "inhalation";
  startDate: string;
  endDate?: string;
  reason: string;
}

export interface Procedure {
  code: string; // CPT code
  description: string;
  dateOfProcedure: string;
  provider: string;
}

export interface LabResult {
  testName: string;
  result: string;
  units: string;
  referenceRange: string;
  dateOfTest: string;
}

export interface VitalSigns {
  dateTime: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number; // in Fahrenheit
  respiratoryRate: number;
  weight: number; // in lbs
  height: number; // in inches
}

export interface ClinicalNote {
  dateTime: string;
  noteType: "progress" | "discharge" | "admission" | "consultation";
  content: string;
  provider: string;
}

export interface Patient {
  // Demographics
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female";
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
  
  // Medical History
  diagnoses: Diagnosis[];
  medications: Medication[];
  procedures: Procedure[];
  labResults: LabResult[];
  vitalSigns: VitalSigns[];
  clinicalNotes: ClinicalNote[];
  
  // Other Information
  allergies: string[];
  socialHistory: {
    smokingStatus: "never" | "former" | "current";
    alcoholConsumption: "none" | "occasional" | "moderate" | "heavy";
  };
  familyHistory: string[];
  insurance: {
    provider: string;
    policyNumber: string;
  };
  
  // System Information
  status: "active" | "inactive" | "discharged";
  registrationDate: string;
}

export interface DashboardMetrics {
  appointments: {
    current: number;
    previous: number;
    change: number;
  };
  patients: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface ChartData {
  date: string;
  appointments: number;
  patients: number;
}

// Mock data for dashboard metrics (current vs previous month)
export const dashboardMetrics: DashboardMetrics = {
  appointments: {
    current: 156,
    previous: 124,
    change: 25.8, // percentage increase
  },
  patients: {
    current: 89,
    previous: 76,
    change: 17.1, // percentage increase
  },
};

// Mock data for appointments and patients chart (last 30 days)
export const appointmentsChartData: ChartData[] = [
  { date: "2024-07-05", appointments: 3, patients: 2 },
  { date: "2024-07-06", appointments: 5, patients: 4 },
  { date: "2024-07-07", appointments: 2, patients: 2 },
  { date: "2024-07-08", appointments: 7, patients: 5 },
  { date: "2024-07-09", appointments: 4, patients: 3 },
  { date: "2024-07-10", appointments: 6, patients: 4 },
  { date: "2024-07-11", appointments: 8, patients: 6 },
  { date: "2024-07-12", appointments: 5, patients: 4 },
  { date: "2024-07-13", appointments: 3, patients: 3 },
  { date: "2024-07-14", appointments: 4, patients: 3 },
  { date: "2024-07-15", appointments: 9, patients: 7 },
  { date: "2024-07-16", appointments: 6, patients: 5 },
  { date: "2024-07-17", appointments: 7, patients: 5 },
  { date: "2024-07-18", appointments: 5, patients: 4 },
  { date: "2024-07-19", appointments: 8, patients: 6 },
  { date: "2024-07-20", appointments: 4, patients: 3 },
  { date: "2024-07-21", appointments: 6, patients: 5 },
  { date: "2024-07-22", appointments: 9, patients: 7 },
  { date: "2024-07-23", appointments: 7, patients: 5 },
  { date: "2024-07-24", appointments: 5, patients: 4 },
  { date: "2024-07-25", appointments: 8, patients: 6 },
  { date: "2024-07-26", appointments: 6, patients: 5 },
  { date: "2024-07-27", appointments: 4, patients: 4 },
  { date: "2024-07-28", appointments: 7, patients: 5 },
  { date: "2024-07-29", appointments: 9, patients: 7 },
  { date: "2024-07-30", appointments: 8, patients: 6 },
  { date: "2024-07-31", appointments: 6, patients: 5 },
  { date: "2024-08-01", appointments: 10, patients: 8 },
  { date: "2024-08-02", appointments: 7, patients: 6 },
  { date: "2024-08-03", appointments: 5, patients: 4 },
];

// Mock data for today's appointments
export const todaysAppointments: Appointment[] = [
  {
    id: "apt-001",
    patientName: "Sarah Johnson",
    patientId: "PT-001",
    time: "09:00 AM",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Smith",
    notes: "Annual checkup",
  },
  {
    id: "apt-002",
    patientName: "Michael Chen",
    patientId: "PT-002",
    time: "10:30 AM",
    type: "follow-up",
    status: "in-progress",
    doctor: "Dr. Johnson",
    notes: "Post-surgery follow-up",
  },
  {
    id: "apt-003",
    patientName: "Emily Davis",
    patientId: "PT-003",
    time: "11:15 AM",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Wilson",
    notes: "Skin condition consultation",
  },
  {
    id: "apt-004",
    patientName: "Robert Brown",
    patientId: "PT-004",
    time: "02:00 PM",
    type: "emergency",
    status: "scheduled",
    doctor: "Dr. Martinez",
    notes: "Urgent care - chest pain",
  },
  {
    id: "apt-005",
    patientName: "Lisa Anderson",
    patientId: "PT-005",
    time: "03:30 PM",
    type: "follow-up",
    status: "completed",
    doctor: "Dr. Lee",
    notes: "Blood test results review",
  },
  {
    id: "apt-006",
    patientName: "David Wilson",
    patientId: "PT-006",
    time: "04:15 PM",
    type: "surgery",
    status: "scheduled",
    doctor: "Dr. Taylor",
    notes: "Minor surgical procedure",
  },
];

// Extended mock data for all appointments (past, present, and future)
export const allAppointments: Appointment[] = [
  // Today's appointments (existing)
  ...todaysAppointments.map(apt => ({
    ...apt,
    time: `2024-08-04T${apt.time.includes('AM') ? 
      apt.time.replace(' AM', '').padStart(5, '0') + ':00' : 
      (parseInt(apt.time.split(':')[0]) + 12).toString().padStart(2, '0') + 
      ':' + apt.time.split(':')[1].replace(' PM', '') + ':00'}`
  })),
  
  // Yesterday's appointments
  {
    id: "apt-007",
    patientName: "Jennifer Martinez",
    patientId: "PT-007",
    time: "2024-08-03T09:30:00",
    type: "consultation",
    status: "completed",
    doctor: "Dr. Smith",
    notes: "Diabetes follow-up consultation",
  },
  {
    id: "apt-008",
    patientName: "James Wilson",
    patientId: "PT-008",
    time: "2024-08-03T14:00:00",
    type: "surgery",
    status: "completed",
    doctor: "Dr. Taylor",
    notes: "Arthroscopic knee surgery",
  },
  {
    id: "apt-009",
    patientName: "Maria Garcia",
    patientId: "PT-009",
    time: "2024-08-03T16:45:00",
    type: "follow-up",
    status: "cancelled",
    doctor: "Dr. Lee",
    notes: "Patient requested rescheduling",
  },
  
  // Tomorrow's appointments
  {
    id: "apt-010",
    patientName: "Thomas Anderson",
    patientId: "PT-010",
    time: "2024-08-05T08:00:00",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Wilson",
    notes: "Initial consultation for back pain",
  },
  {
    id: "apt-011",
    patientName: "Susan Clark",
    patientId: "PT-011",
    time: "2024-08-05T10:15:00",
    type: "follow-up",
    status: "scheduled",
    doctor: "Dr. Johnson",
    notes: "Post-treatment check-up",
  },
  {
    id: "apt-012",
    patientName: "Kevin Brown",
    patientId: "PT-012",
    time: "2024-08-05T13:30:00",
    type: "emergency",
    status: "scheduled",
    doctor: "Dr. Martinez",
    notes: "Urgent cardiac evaluation",
  },
  
  // Next week appointments
  {
    id: "apt-013",
    patientName: "Rachel Green",
    patientId: "PT-013",
    time: "2024-08-07T09:00:00",
    type: "surgery",
    status: "scheduled",
    doctor: "Dr. Taylor",
    notes: "Gallbladder removal surgery",
  },
  {
    id: "apt-014",
    patientName: "Daniel Miller",
    patientId: "PT-014",
    time: "2024-08-07T11:30:00",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Smith",
    notes: "Annual physical examination",
  },
  {
    id: "apt-015",
    patientName: "Amanda Lee",
    patientId: "PT-015",
    time: "2024-08-08T14:00:00",
    type: "follow-up",
    status: "scheduled",
    doctor: "Dr. Wilson",
    notes: "Physical therapy progress review",
  },
  {
    id: "apt-016",
    patientName: "Mark Taylor",
    patientId: "PT-016",
    time: "2024-08-09T10:00:00",
    type: "consultation",
    status: "scheduled",
    doctor: "Dr. Lee",
    notes: "Dermatology consultation",
  },
  
  // Last week appointments
  {
    id: "apt-017",
    patientName: "Linda Johnson",
    patientId: "PT-017",
    time: "2024-07-29T15:30:00",
    type: "follow-up",
    status: "completed",
    doctor: "Dr. Johnson",
    notes: "Hypertension management follow-up",
  },
  {
    id: "apt-018",
    patientName: "Christopher Davis",
    patientId: "PT-018",
    time: "2024-07-30T08:45:00",
    type: "consultation",
    status: "completed",
    doctor: "Dr. Martinez",
    notes: "Chest pain evaluation",
  },
  {
    id: "apt-019",
    patientName: "Michelle White",
    patientId: "PT-019",
    time: "2024-07-31T12:00:00",
    type: "surgery",
    status: "cancelled",
    doctor: "Dr. Taylor",
    notes: "Surgery postponed due to patient illness",
  },
  {
    id: "apt-020",
    patientName: "Brian Thompson",
    patientId: "PT-020",
    time: "2024-08-01T16:15:00",
    type: "emergency",
    status: "completed",
    doctor: "Dr. Wilson",
    notes: "Emergency room visit for allergic reaction",
  },
];

// Mock data for patients with comprehensive medical records
export const allPatients: Patient[] = [
  {
    // Demographics
    id: "PT-001",
    name: "Sarah Johnson",
    dateOfBirth: "1985-03-15",
    age: 39,
    gender: "female",
    contactInfo: {
      address: "123 Oak Street, Springfield, IL 62701",
      phone: "(555) 123-4567",
      email: "sarah.johnson@email.com",
    },
    emergencyContact: {
      name: "John Johnson",
      phone: "(555) 123-4568",
      relationship: "Spouse",
    },
    
    // Medical History
    diagnoses: [
      {
        code: "I10",
        description: "Essential Hypertension",
        dateOfDiagnosis: "2024-06-10T00:00:00",
        status: "active",
      },
      {
        code: "Z00.00",
        description: "Encounter for general adult medical examination without abnormal findings",
        dateOfDiagnosis: "2024-08-04T00:00:00",
        status: "resolved",
      },
    ],
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        route: "oral",
        startDate: "2024-06-10T00:00:00",
        reason: "Hypertension management",
      },
    ],
    procedures: [
      {
        code: "99213",
        description: "Office visit for established patient",
        dateOfProcedure: "2024-08-04T09:00:00",
        provider: "Dr. Smith",
      },
    ],
    labResults: [
      {
        testName: "Complete Blood Count",
        result: "Normal",
        units: "Various",
        referenceRange: "Within normal limits",
        dateOfTest: "2024-08-04T00:00:00",
      },
      {
        testName: "Lipid Panel",
        result: "185",
        units: "mg/dL",
        referenceRange: "< 200",
        dateOfTest: "2024-08-04T00:00:00",
      },
    ],
    vitalSigns: [
      {
        dateTime: "2024-08-04T09:00:00",
        bloodPressureSystolic: 128,
        bloodPressureDiastolic: 82,
        heartRate: 72,
        temperature: 98.6,
        respiratoryRate: 16,
        weight: 145,
        height: 65,
      },
    ],
    clinicalNotes: [
      {
        dateTime: "2024-08-04T09:00:00",
        noteType: "progress",
        content: "Patient presents for annual physical examination. Reports feeling well with no new complaints. Blood pressure well controlled on current medication. Continue current regimen.",
        provider: "Dr. Smith",
      },
    ],
    
    // Other Information
    allergies: ["Penicillin"],
    socialHistory: {
      smokingStatus: "never",
      alcoholConsumption: "occasional",
    },
    familyHistory: ["Hypertension (mother)", "Diabetes Type 2 (father)"],
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS123456789",
    },
    
    // System Information
    status: "active",
    registrationDate: "2023-01-15T00:00:00",
  },
  {
    // Demographics
    id: "PT-002",
    name: "Michael Chen",
    dateOfBirth: "1978-11-22",
    age: 45,
    gender: "male",
    contactInfo: {
      address: "456 Pine Avenue, Springfield, IL 62702",
      phone: "(555) 234-5678",
      email: "michael.chen@email.com",
    },
    emergencyContact: {
      name: "Lisa Chen",
      phone: "(555) 234-5679",
      relationship: "Wife",
    },
    
    // Medical History
    diagnoses: [
      {
        code: "E11.9",
        description: "Type 2 diabetes mellitus without complications",
        dateOfDiagnosis: "2024-02-08T00:00:00",
        status: "active",
      },
      {
        code: "K35.9",
        description: "Acute appendicitis, unspecified",
        dateOfDiagnosis: "2024-07-15T00:00:00",
        status: "resolved",
      },
    ],
    medications: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        route: "oral",
        startDate: "2024-02-08T00:00:00",
        reason: "Type 2 diabetes management",
      },
    ],
    procedures: [
      {
        code: "44970",
        description: "Laparoscopic appendectomy",
        dateOfProcedure: "2024-07-15T08:00:00",
        provider: "Dr. Taylor",
      },
      {
        code: "99214",
        description: "Office visit for established patient",
        dateOfProcedure: "2024-08-04T10:30:00",
        provider: "Dr. Johnson",
      },
    ],
    labResults: [
      {
        testName: "Hemoglobin A1C",
        result: "7.2",
        units: "%",
        referenceRange: "< 7.0",
        dateOfTest: "2024-08-01T00:00:00",
      },
      {
        testName: "Fasting Glucose",
        result: "145",
        units: "mg/dL",
        referenceRange: "70-100",
        dateOfTest: "2024-08-01T00:00:00",
      },
    ],
    vitalSigns: [
      {
        dateTime: "2024-08-04T10:30:00",
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 88,
        heartRate: 78,
        temperature: 98.4,
        respiratoryRate: 18,
        weight: 180,
        height: 70,
      },
    ],
    clinicalNotes: [
      {
        dateTime: "2024-08-04T10:30:00",
        noteType: "progress",
        content: "Post-surgical follow-up visit. Incision sites healing well, no signs of infection. Patient reports good energy levels. Diabetes management discussed, A1C improving but still above target.",
        provider: "Dr. Johnson",
      },
    ],
    
    // Other Information
    allergies: ["Sulfa drugs"],
    socialHistory: {
      smokingStatus: "former",
      alcoholConsumption: "moderate",
    },
    familyHistory: ["Diabetes Type 2 (both parents)", "Heart disease (father)"],
    insurance: {
      provider: "Aetna",
      policyNumber: "AET987654321",
    },
    
    // System Information
    status: "active",
    registrationDate: "2022-08-20T00:00:00",
  },
  {
    // Demographics
    id: "PT-003",
    name: "Emily Davis",
    dateOfBirth: "1992-07-08",
    age: 32,
    gender: "female",
    contactInfo: {
      address: "789 Maple Drive, Springfield, IL 62703",
      phone: "(555) 345-6789",
      email: "emily.davis@email.com",
    },
    emergencyContact: {
      name: "Robert Davis",
      phone: "(555) 345-6790",
      relationship: "Father",
    },
    
    // Medical History
    diagnoses: [
      {
        code: "L20.9",
        description: "Atopic dermatitis, unspecified",
        dateOfDiagnosis: "2024-08-04T00:00:00",
        status: "active",
      },
      {
        code: "T78.40XA",
        description: "Allergy, unspecified, initial encounter",
        dateOfDiagnosis: "2024-05-12T00:00:00",
        status: "resolved",
      },
    ],
    medications: [
      {
        name: "Hydrocortisone cream",
        dosage: "1%",
        frequency: "Apply twice daily",
        route: "topical",
        startDate: "2024-08-04T00:00:00",
        reason: "Eczema treatment",
      },
      {
        name: "EpiPen",
        dosage: "0.3mg",
        frequency: "As needed",
        route: "injection",
        startDate: "2024-05-12T00:00:00",
        reason: "Emergency allergic reaction treatment",
      },
    ],
    procedures: [
      {
        code: "99213",
        description: "Office visit for established patient",
        dateOfProcedure: "2024-08-04T11:15:00",
        provider: "Dr. Wilson",
      },
    ],
    labResults: [
      {
        testName: "Allergen Panel",
        result: "Positive for shellfish",
        units: "Various",
        referenceRange: "Negative",
        dateOfTest: "2024-05-15T00:00:00",
      },
    ],
    vitalSigns: [
      {
        dateTime: "2024-08-04T11:15:00",
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 75,
        heartRate: 68,
        temperature: 98.7,
        respiratoryRate: 14,
        weight: 125,
        height: 64,
      },
    ],
    clinicalNotes: [
      {
        dateTime: "2024-08-04T11:15:00",
        noteType: "progress",
        content: "Patient presents with eczema flare-up on arms and face. Skin appears inflamed with mild scaling. Prescribed topical steroid. Discussed trigger avoidance and skin care routine.",
        provider: "Dr. Wilson",
      },
    ],
    
    // Other Information
    allergies: ["Shellfish", "Tree nuts"],
    socialHistory: {
      smokingStatus: "never",
      alcoholConsumption: "none",
    },
    familyHistory: ["Allergies (mother)", "Asthma (sister)"],
    insurance: {
      provider: "United Healthcare",
      policyNumber: "UHC456789123",
    },
    
    // System Information
    status: "active",
    registrationDate: "2023-05-10T00:00:00",
  },
];