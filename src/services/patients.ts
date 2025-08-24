import { createClient } from "@/lib/db/client";
import {
  Patient,
  PatientCreate,
  PatientUpdate,
  generatePatientId,
} from "@/lib/schemas/patient";

export class PatientsService {
  static async getPatients(options?: {
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const supabase = createClient();
    let query = supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (options?.search) {
      query = query.or(
        `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,phone_number.ilike.%${options.search}%`,
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }

    return { data: data as Patient[], count };
  }

  static async getPatientById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }

    return data as Patient;
  }

  static async createPatient(patientData: PatientCreate) {
    const supabase = await createClient();
    const id = generatePatientId();

    const { data, error } = await supabase
      .from("patients")
      .insert({
        id,
        ...patientData,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }

    return data as Patient;
  }

  static async updatePatient(patientData: PatientUpdate) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("patients")
      .update(patientData)
      .eq("id", patientData.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update patient: ${error.message}`);
    }

    return data as Patient;
  }

  static async deletePatient(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete patient: ${error.message}`);
    }

    return true;
  }
}
