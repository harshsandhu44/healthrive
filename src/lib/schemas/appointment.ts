import { z } from "zod";
import { ulid } from "ulid";

export const AppointmentStatusEnum = z.enum([
  "pending",
  "confirmed", 
  "completed",
  "cancelled"
]);

export const AppointmentTypeEnum = z.enum([
  "consultation",
  "follow-up",
  "checkup",
  "procedure",
  "emergency",
  "telehealth",
  "other"
]);

export const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
export const APPOINTMENT_TYPES = ["consultation", "follow-up", "checkup", "procedure", "emergency", "telehealth", "other"] as const;
export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

export const AppointmentSchema = z.object({
  id: z.string().length(26, "ID must be a valid ULID"),
  datetime: z.string().refine((datetime) => {
    const parsed = new Date(datetime);
    return !isNaN(parsed.getTime());
  }, "Must be a valid datetime"),
  user_id: z.string().uuid(),
  patient_id: z.string().length(26, "Patient ID must be a valid ULID"),
  notes: z.string().optional(),
  appointment_type: AppointmentTypeEnum.optional(),
  duration_minutes: z.number().min(5).max(480).default(30),
  location: z.string().optional(),
  reason: z.string().optional(),
  no_show: z.boolean().default(false),
  status: AppointmentStatusEnum.default("pending"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const AppointmentCreateSchema = AppointmentSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true, 
  user_id: true 
}).extend({
  duration_minutes: z.number().min(5).max(480).default(30),
  no_show: z.boolean().default(false),
  status: AppointmentStatusEnum.default("pending"),
});

export const AppointmentUpdateSchema = AppointmentSchema.partial().required({ id: true });

export type Appointment = z.infer<typeof AppointmentSchema>;
export type AppointmentCreate = z.infer<typeof AppointmentCreateSchema>;
export type AppointmentUpdate = z.infer<typeof AppointmentUpdateSchema>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;
export type AppointmentType = z.infer<typeof AppointmentTypeEnum>;

export const generateAppointmentId = () => ulid();

export const appointmentStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const appointmentTypeOptions = [
  { value: "consultation", label: "Consultation" },
  { value: "follow-up", label: "Follow-up" },
  { value: "checkup", label: "Check-up" },
  { value: "procedure", label: "Procedure" },
  { value: "emergency", label: "Emergency" },
  { value: "telehealth", label: "Telehealth" },
  { value: "other", label: "Other" },
] as const;

export const durationOptions = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
] as const;