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

interface ActionResult {
  success: boolean;
  data?: Appointment;
  error?: string;
  details?: Record<string, string[]>;
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

    // Revalidate the appointments page to show the new appointment
    revalidatePath("/appointments");

    return {
      success: true,
      data: insertedAppointment as Appointment
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