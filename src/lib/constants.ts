export const APP_NAME = "Healthrive";
export const APP_DESCRIPTION =
  "Healthrive is a platform that helps you manage your health and wellness.";

// Appointment Types
export const APPOINTMENT_TYPES = [
  { value: "consultation", label: "Consultation" },
  { value: "follow-up", label: "Follow-up" },
  { value: "surgery", label: "Surgery" },
  { value: "emergency", label: "Emergency" },
] as const;

// Appointment Statuses
export const APPOINTMENT_STATUSES = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;
