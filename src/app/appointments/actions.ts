"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/db/server";
import { 
  AppointmentCreateSchema,
  AppointmentUpdateSchema, 
  type AppointmentCreate,
  type AppointmentUpdate,
  type Appointment,
  generateAppointmentId 
} from "@/lib/schemas/appointment";
import { smsService } from "@/services/sms-service";
import { enableAppointmentNotificationFlag } from "@/flags";

interface ActionResult {
  success: boolean;
  data?: Appointment;
  error?: string;
  details?: Record<string, string[]>;
  smsStatus?: 'sent' | 'failed' | 'skipped';
  smsError?: string;
}

export async function createAppointment(data: AppointmentCreate): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    // Validate input data
    const validation = AppointmentCreateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validation.error.flatten().fieldErrors
      };
    }

    const appointmentData = validation.data;
    const id = generateAppointmentId();

    // Note: datetime should be in UTC format from the form
    // Insert appointment
    const { data: insertedAppointment, error: insertError } = await supabase
      .from("appointments")
      .insert({
        id,
        user_id: user.id,
        ...appointmentData,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create appointment:", insertError);
      return {
        success: false,
        error: "Failed to create appointment"
      };
    }

    // Get patient details for SMS notification
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("first_name, last_name, phone_number")
      .eq("id", appointmentData.patient_id)
      .eq("user_id", user.id)
      .single();

    let smsStatus: 'sent' | 'failed' | 'skipped' = 'skipped';
    let smsError: string | undefined;

    // Check if SMS notifications are enabled
    const smsNotificationsEnabled = await enableAppointmentNotificationFlag();

    // Send SMS notification if enabled and patient has a phone number
    if (smsNotificationsEnabled && !patientError && patient?.phone_number) {
      try {
        const smsResult = await smsService.sendAppointmentConfirmation({
          patientName: `${patient.first_name} ${patient.last_name}`,
          patientPhone: patient.phone_number,
          appointmentDate: insertedAppointment.datetime,
          appointmentType: insertedAppointment.appointment_type || undefined,
          location: insertedAppointment.location || undefined,
          reason: insertedAppointment.reason || undefined,
        });

        if (smsResult.success) {
          smsStatus = 'sent';
          console.log(`SMS sent successfully to ${patient.phone_number}. SID: ${smsResult.messageSid}`);
        } else {
          smsStatus = 'failed';
          smsError = smsResult.error;
          console.warn(`Failed to send SMS to ${patient.phone_number}: ${smsResult.error}`);
        }
      } catch (error) {
        smsStatus = 'failed';
        smsError = error instanceof Error ? error.message : 'Unknown SMS error';
        console.error("SMS service error:", error);
      }
    } else {
      if (!smsNotificationsEnabled) {
        console.log("SMS notifications are disabled, skipping SMS");
      } else if (patientError) {
        console.warn("Could not fetch patient for SMS:", patientError);
      } else if (!patient?.phone_number) {
        console.log("Patient has no phone number, skipping SMS");
      }
    }

    // Revalidate the appointments page to show the new appointment
    revalidatePath("/appointments");

    return {
      success: true,
      data: insertedAppointment as Appointment,
      smsStatus,
      smsError,
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      error: "Internal server error"
    };
  }
}

export async function updateAppointment(data: AppointmentUpdate): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    // Validate input data
    const validation = AppointmentUpdateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validation.error.flatten().fieldErrors
      };
    }

    const { id, ...updateData } = validation.data;

    // Note: datetime should be in UTC format from the form
    // Update appointment
    const { data: updatedAppointment, error: updateError } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === "PGRST116") {
        return {
          success: false,
          error: "Appointment not found"
        };
      }
      console.error("Failed to update appointment:", updateError);
      return {
        success: false,
        error: "Failed to update appointment"
      };
    }

    // Revalidate the appointments page to show the updated appointment
    revalidatePath("/appointments");

    return {
      success: true,
      data: updatedAppointment as Appointment
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      error: "Internal server error"
    };
  }
}