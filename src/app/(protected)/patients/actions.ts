"use server";

import { createClient } from "@/lib/db/server";
import { 
  PatientCreateSchema, 
  type PatientCreate,
  type Patient,
  generatePatientId 
} from "@/lib/schemas/patient";

interface ActionResult {
  success: boolean;
  data?: Patient;
  error?: string;
  details?: Record<string, string[]>;
}

export async function createPatient(data: PatientCreate): Promise<ActionResult> {
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
    const validation = PatientCreateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid input data",
        details: validation.error.flatten().fieldErrors
      };
    }

    const patientData = validation.data;
    const id = generatePatientId();

    // Insert patient
    const { data: insertedPatient, error: insertError } = await supabase
      .from("patients")
      .insert({
        id,
        user_id: user.id,
        ...patientData,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create patient:", insertError);
      return {
        success: false,
        error: "Failed to create patient"
      };
    }

    return {
      success: true,
      data: insertedPatient as Patient
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      error: "Internal server error"
    };
  }
}
