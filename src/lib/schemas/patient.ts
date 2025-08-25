import { z } from "zod";
import { ulid } from "ulid";

export const BloodTypeEnum = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const MedicalHistorySchema = z.object({
  allergies: z.array(z.string()).optional(),
  current_medications: z.array(z.object({
    name: z.string(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
  })).optional(),
  medical_conditions: z.array(z.string()).optional(),
  past_surgeries: z.array(z.object({
    procedure: z.string(),
    date: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
  family_history: z.object({
    heart_disease: z.boolean().optional(),
    diabetes: z.boolean().optional(),
    cancer: z.boolean().optional(),
    mental_health: z.boolean().optional(),
    other: z.string().optional(),
  }).optional(),
  emergency_contact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  insurance_info: z.object({
    provider: z.string().optional(),
    policy_number: z.string().optional(),
    group_number: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
}).optional();

export const PatientSchema = z.object({
  id: z.string().length(26, "ID must be a valid ULID"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed < new Date();
  }, "Must be a valid date in the past"),
  phone_number: z.string().min(1, "Phone number is required"),
  blood_type: BloodTypeEnum.optional(),
  medical_history: MedicalHistorySchema,
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  post_code: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  user_id: z.string().uuid(),
});

export const PatientCreateSchema = PatientSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true, 
  user_id: true 
});

export const PatientUpdateSchema = PatientSchema.partial().required({ id: true });

export type Patient = z.infer<typeof PatientSchema>;
export type PatientCreate = z.infer<typeof PatientCreateSchema>;
export type PatientUpdate = z.infer<typeof PatientUpdateSchema>;
export type BloodType = z.infer<typeof BloodTypeEnum>;
export type MedicalHistory = z.infer<typeof MedicalHistorySchema>;

export const generatePatientId = () => ulid();

export const bloodTypeOptions = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
] as const;