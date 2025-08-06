"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  DataExportRequest,
  DataExportType,
  ExportedData,
  AuditLogEntry,
  LoginEvent,
  ActivitySummary,
} from "@/lib/types/data-export";
import { getPatients } from "../../patients/actions";
import { getAppointments } from "../../appointments/actions";
import { generateId } from "@/lib/utils";

/**
 * Create a new data export request
 */
export async function createDataExportRequest(
  dataTypes: DataExportType[],
  format: "json" | "csv" | "xml" = "json",
  includeFiles: boolean = false,
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  try {
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!userId || !orgId || !user) {
      return { success: false, error: "Authentication required" };
    }

    const supabase = await createClient();
    const requestId = generateId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create export request record
    const exportRequest: Omit<DataExportRequest, "id"> = {
      userId,
      organizationId: orgId,
      status: "pending",
      requestedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      format,
      includeFiles,
      dataTypes,
    };

    const { error } = await supabase.from("data_export_requests").insert({
      id: requestId,
      user_id: userId,
      organization_id: orgId,
      status: exportRequest.status,
      requested_at: exportRequest.requestedAt,
      expires_at: exportRequest.expiresAt,
      format: exportRequest.format,
      include_files: exportRequest.includeFiles,
      data_types: exportRequest.dataTypes,
    });

    if (error) {
      console.error("Error creating export request:", error);
      return { success: false, error: "Failed to create export request" };
    }

    // Log the export request
    await logAuditEvent(
      userId,
      "data_export_requested",
      "data_export_request",
      requestId,
      { dataTypes, format, includeFiles },
    );

    // Start background processing (in a real app, this would be a background job)
    processDataExport(requestId).catch(console.error);

    return { success: true, requestId };
  } catch (error) {
    console.error("Error in createDataExportRequest:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get user's data export requests
 */
export async function getDataExportRequests(): Promise<DataExportRequest[]> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("data_export_requests")
      .select("*")
      .eq("user_id", userId)
      .eq("organization_id", orgId)
      .order("requested_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching export requests:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      organizationId: row.organization_id,
      status: row.status,
      requestedAt: row.requested_at,
      completedAt: row.completed_at,
      expiresAt: row.expires_at,
      downloadUrl: row.download_url,
      format: row.format,
      includeFiles: row.include_files,
      dataTypes: row.data_types,
    }));
  } catch (error) {
    console.error("Error in getDataExportRequests:", error);
    return [];
  }
}

/**
 * Download data export
 */
export async function downloadDataExport(requestId: string): Promise<{
  success: boolean;
  data?: ExportedData;
  error?: string;
}> {
  try {
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!userId || !orgId || !user) {
      return { success: false, error: "Authentication required" };
    }

    const supabase = await createClient();

    // Verify export request belongs to user and is ready
    const { data: request, error: requestError } = await supabase
      .from("data_export_requests")
      .select("*")
      .eq("id", requestId)
      .eq("user_id", userId)
      .eq("organization_id", orgId)
      .single();

    if (requestError || !request) {
      return { success: false, error: "Export request not found" };
    }

    if (request.status !== "completed") {
      return { success: false, error: "Export not ready for download" };
    }

    if (new Date() > new Date(request.expires_at)) {
      return { success: false, error: "Export has expired" };
    }

    // Generate the export data
    const exportedData = await generateExportData(
      request.data_types,
      userId,
      orgId,
    );

    // Log the download
    await logAuditEvent(
      userId,
      "data_export_downloaded",
      "data_export_request",
      requestId,
    );

    return { success: true, data: exportedData };
  } catch (error) {
    console.error("Error in downloadDataExport:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Process data export request (background processing)
 */
async function processDataExport(requestId: string): Promise<void> {
  try {
    const supabase = await createClient();

    // Update status to processing
    await supabase
      .from("data_export_requests")
      .update({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    // Simulate processing time (in real app, this would do actual work)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Update status to completed
    await supabase
      .from("data_export_requests")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    revalidatePath("/settings/data-export");
  } catch (error) {
    console.error("Error processing data export:", error);

    // Update status to failed
    const supabase = await createClient();
    await supabase
      .from("data_export_requests")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);
  }
}

/**
 * Generate exported data based on requested types
 */
async function generateExportData(
  dataTypes: DataExportType[],
  userId: string,
  organizationId: string,
): Promise<ExportedData> {
  const user = await currentUser();
  const exportedData: ExportedData = {
    exportMetadata: {
      exportId: generateId(),
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
      organizationId,
      version: "1.0",
      format: "json",
      dataTypes,
    },
  };

  if (dataTypes.includes("personal_info") && user) {
    exportedData.personalInfo = {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      name: user.fullName || "",
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : "",
      lastLoginAt: user.lastSignInAt
        ? new Date(user.lastSignInAt).toISOString()
        : undefined,
      preferences: user.unsafeMetadata,
    };
  }

  if (dataTypes.includes("patient_records")) {
    try {
      exportedData.patientRecords = await getPatients();
    } catch (error) {
      console.error("Error exporting patient records:", error);
    }
  }

  if (dataTypes.includes("appointments")) {
    try {
      exportedData.appointments = await getAppointments();
    } catch (error) {
      console.error("Error exporting appointments:", error);
    }
  }

  if (dataTypes.includes("consent_history")) {
    // In a real app, you'd fetch consent history from your database
    exportedData.consentHistory = [];
  }

  if (dataTypes.includes("audit_logs")) {
    exportedData.auditLogs = await getAuditLogs(userId, organizationId);
  }

  if (dataTypes.includes("usage_data")) {
    exportedData.usageData = {
      loginHistory: await getLoginHistory(userId),
      activitySummary: await getActivitySummary(userId, organizationId),
    };
  }

  return exportedData;
}

/**
 * Log audit events
 */
async function logAuditEvent(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from("audit_logs").insert({
      id: generateId(),
      user_id: userId,
      action,
      resource,
      resource_id: resourceId,
      details,
      timestamp: new Date().toISOString(),
      ip_address: null, // Would be captured from request in real app
      user_agent: null, // Would be captured from request in real app
    });
  } catch (error) {
    console.error("Error logging audit event:", error);
  }
}

/**
 * Get audit logs for user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getAuditLogs(
  userId: string,
  organizationId: string,
): Promise<AuditLogEntry[]> {
  try {
    const supabase = await createClient();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("timestamp", twelveMonthsAgo.toISOString())
      .order("timestamp", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Error fetching audit logs:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      timestamp: row.timestamp,
      userId: row.user_id,
      action: row.action,
      resource: row.resource,
      resourceId: row.resource_id,
      details: row.details,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
    }));
  } catch (error) {
    console.error("Error in getAuditLogs:", error);
    return [];
  }
}

/**
 * Get login history for user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getLoginHistory(userId: string): Promise<LoginEvent[]> {
  // In a real app, you'd fetch from your auth logs
  // For now, return empty array as Clerk doesn't expose this data directly
  return [];
}

/**
 * Get activity summary for user
 */
async function getActivitySummary(
  userId: string,
  _organizationId: string,
): Promise<ActivitySummary> {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    // Get counts for various activities
    const [patientsResult, appointmentsResult, exportsResult] =
      await Promise.all([
        supabase
          .from("patients")
          .select("id", { count: "exact" })
          .eq("organization_id", _organizationId),
        supabase
          .from("appointments")
          .select("id", { count: "exact" })
          .eq("organization_id", _organizationId),
        supabase
          .from("data_export_requests")
          .select("id", { count: "exact" })
          .eq("user_id", userId),
      ]);

    return {
      totalLogins: 0, // Would be fetched from auth logs
      lastLoginAt: user?.lastSignInAt
        ? new Date(user.lastSignInAt).toISOString()
        : undefined,
      patientsCreated: patientsResult.count || 0,
      appointmentsScheduled: appointmentsResult.count || 0,
      dataExports: exportsResult.count || 0,
      accountCreatedAt: user?.createdAt
        ? new Date(user.createdAt).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating activity summary:", error);
    return {
      totalLogins: 0,
      patientsCreated: 0,
      appointmentsScheduled: 0,
      dataExports: 0,
      accountCreatedAt: new Date().toISOString(),
    };
  }
}
