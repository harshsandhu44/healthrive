import { createClient } from "@/lib/db/server";
import { Patient } from "@/lib/schemas/patient";

export interface PatientsListOptions {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface PatientsListResult {
  data: Patient[];
  count: number | null;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Server-side data fetching functions for server components
export async function getPatients(
  options: PatientsListOptions = {}
): Promise<PatientsListResult> {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const limit = options.limit || 50;
  const offset = options.offset || 0;

  // Build query
  let query = supabase
    .from("patients")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Add search filter
  if (options.search) {
    query = query.or(
      `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,phone_number.ilike.%${options.search}%`
    );
  }

  // Add pagination
  if (limit > 0) {
    query = query.limit(limit);
  }
  if (offset > 0) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch patients:", error);
    throw new Error("Failed to fetch patients");
  }

  return {
    data: data as Patient[],
    count,
    pagination: {
      limit,
      offset,
      hasMore: count ? offset + limit < count : false,
    },
  };
}

export async function getPatientById(id: string): Promise<Patient> {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  // Fetch patient (RLS will ensure user can only access their own patients)
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Patient not found");
    }
    console.error("Failed to fetch patient:", error);
    throw new Error("Failed to fetch patient");
  }

  return data as Patient;
}