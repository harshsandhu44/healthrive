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
  medical_history: z.record(z.unknown()).optional(),
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