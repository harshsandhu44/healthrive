import type { Patient, Appointment } from "./entities";
import type { ConsentData } from "./consent";

export interface DataExportRequest {
  id: string;
  userId: string;
  organizationId: string;
  status: "pending" | "processing" | "completed" | "failed" | "expired";
  requestedAt: string;
  completedAt?: string;
  expiresAt: string;
  downloadUrl?: string;
  format: "json" | "csv" | "xml";
  includeFiles: boolean;
  dataTypes: DataExportType[];
}

export type DataExportType = 
  | "personal_info"
  | "patient_records" 
  | "appointments"
  | "consent_history"
  | "audit_logs"
  | "usage_data";

export interface ExportedData {
  exportMetadata: {
    exportId: string;
    exportedAt: string;
    exportedBy: string;
    organizationId: string;
    version: string;
    format: "json" | "csv" | "xml";
    dataTypes: DataExportType[];
  };
  personalInfo?: {
    userId: string;
    email: string;
    name: string;
    createdAt: string;
    lastLoginAt?: string;
    preferences?: Record<string, unknown>;
  };
  patientRecords?: Patient[];
  appointments?: Appointment[];
  consentHistory?: ConsentData[];
  auditLogs?: AuditLogEntry[];
  usageData?: {
    loginHistory: LoginEvent[];
    activitySummary: ActivitySummary;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginEvent {
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}

export interface ActivitySummary {
  totalLogins: number;
  lastLoginAt?: string;
  patientsCreated: number;
  appointmentsScheduled: number;
  dataExports: number;
  accountCreatedAt: string;
}

export const DATA_EXPORT_TYPES: Array<{
  key: DataExportType;
  label: string;
  description: string;
  sensitive: boolean;
}> = [
  {
    key: "personal_info",
    label: "Personal Information",
    description: "Basic account information, preferences, and profile data",
    sensitive: false,
  },
  {
    key: "patient_records",
    label: "Patient Records",
    description: "All patient data including medical history, diagnoses, and treatments",
    sensitive: true,
  },
  {
    key: "appointments",
    label: "Appointments",
    description: "Scheduled appointments and related information",
    sensitive: true,
  },
  {
    key: "consent_history",
    label: "Consent History",
    description: "GDPR consent preferences and modification history",
    sensitive: false,
  },
  {
    key: "audit_logs",
    label: "Audit Logs",
    description: "Activity logs and access history (last 12 months)",
    sensitive: false,
  },
  {
    key: "usage_data",
    label: "Usage Analytics",
    description: "Login history and platform usage statistics",
    sensitive: false,
  },
];