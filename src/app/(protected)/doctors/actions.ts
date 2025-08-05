"use server";

import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { DoctorRow } from "@/lib/types/database";
import type { Doctor } from "@/lib/types/entities";
import { transformDoctorRow } from "@/lib/transforms/database";
import type { TablesInsert, TablesUpdate } from "@/lib/types/supabase";
import { generateDoctorId } from "@/lib/utils";

/**
 * Generates a unique doctor ID with collision detection
 * Retries up to 5 times if ID already exists
 */
async function generateUniqueDoctorId(supabase: Awaited<ReturnType<typeof createClient>>, organizationId: string): Promise<string> {
  const maxRetries = 5;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const doctorId = generateDoctorId();
    
    // Check if ID already exists in the organization
    const { data, error } = await supabase
      .from("doctors")
      .select("id")
      .eq("id", doctorId)
      .eq("organization_id", organizationId)
      .single();
    
    // If no data found (and no other error), the ID is unique
    if (!data && (!error || error.code === "PGRST116")) {
      return doctorId;
    }
    
    // If there was an actual error (not just "no rows"), throw it
    if (error && error.code !== "PGRST116") {
      console.error("Error checking doctor ID uniqueness:", error);
      throw error;
    }
    
    // ID exists, try again (unless it's the last attempt)
    if (attempt === maxRetries - 1) {
      throw new Error("Unable to generate unique doctor ID after multiple attempts");
    }
  }
  
  throw new Error("Unable to generate unique doctor ID");
}

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const { orgId } = await auth();
    const organizationId = orgId;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("organization_id", organizationId)
      .order("name");

    if (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }

    return (data as DoctorRow[]).map(transformDoctorRow);
  } catch (error) {
    console.error("Error in getDoctors:", error);
    throw error;
  }
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  try {
    const { orgId } = await auth();
    const organizationId = orgId;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      console.error("Error fetching doctor:", error);
      throw error;
    }

    return transformDoctorRow(data as DoctorRow);
  } catch (error) {
    console.error("Error in getDoctor:", error);
    throw error;
  }
}

export async function createDoctor(
  doctorData: Omit<Doctor, "id">,
): Promise<Doctor> {
  try {
    const { orgId } = await auth();
    const organizationId = orgId;

    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const supabase = await createClient();

    // Generate unique doctor ID
    const doctorId = await generateUniqueDoctorId(supabase, organizationId);

    const insertData: TablesInsert<"doctors"> = {
      id: doctorId,
      organization_id: organizationId,
      name: doctorData.name,
      date_of_birth: doctorData.dateOfBirth,
      specialization: doctorData.specialization,
      gender: doctorData.gender,
      phone: doctorData.contactInfo.phone,
      email: doctorData.contactInfo.email,
    };

    const { data: doctor, error } = await supabase
      .from("doctors")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating doctor:", error);
      throw error;
    }

    // Revalidate the doctors route
    revalidatePath("/doctors");

    return transformDoctorRow(doctor as DoctorRow);
  } catch (error) {
    console.error("Error in createDoctor:", error);
    throw error;
  }
}

export async function updateDoctor(
  id: string,
  doctorData: Partial<Omit<Doctor, "id">>,
): Promise<Doctor> {
  try {
    const { orgId } = await auth();
    const organizationId = orgId;

    const supabase = await createClient();

    const updateData: TablesUpdate<"doctors"> = {};

    if (doctorData.name) updateData.name = doctorData.name;
    if (doctorData.dateOfBirth)
      updateData.date_of_birth = doctorData.dateOfBirth;
    if (doctorData.specialization)
      updateData.specialization = doctorData.specialization;
    if (doctorData.gender) updateData.gender = doctorData.gender;
    if (doctorData.contactInfo?.phone)
      updateData.phone = doctorData.contactInfo.phone;
    if (doctorData.contactInfo?.email)
      updateData.email = doctorData.contactInfo.email;

    const { data: doctor, error } = await supabase
      .from("doctors")
      .update(updateData)
      .eq("id", id)
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating doctor:", error);
      throw error;
    }

    // Revalidate the doctors route
    revalidatePath("/doctors");

    return transformDoctorRow(doctor as DoctorRow);
  } catch (error) {
    console.error("Error in updateDoctor:", error);
    throw error;
  }
}

export async function deleteDoctor(id: string): Promise<void> {
  try {
    const { orgId } = await auth();
    const organizationId = orgId;

    const supabase = await createClient();

    const { error } = await supabase
      .from("doctors")
      .delete()
      .eq("id", id)
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Error deleting doctor:", error);
      throw error;
    }

    // Revalidate the doctors route
    revalidatePath("/doctors");
  } catch (error) {
    console.error("Error in deleteDoctor:", error);
    throw error;
  }
}
