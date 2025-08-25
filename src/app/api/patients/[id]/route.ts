import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";
import {
  PatientUpdateSchema,
  type Patient,
} from "@/lib/schemas/patient";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/patients/[id] - Get a single patient by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
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
        return NextResponse.json(
          { error: "Patient not found" },
          { status: 404 }
        );
      }
      console.error("Failed to fetch patient:", error);
      return NextResponse.json(
        { error: "Failed to fetch patient" },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Patient);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/patients/[id] - Update a patient
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = PatientUpdateSchema.safeParse({ id, ...body });
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _patientId, ...updateData } = validation.data;

    // Update patient
    const { data, error } = await supabase
      .from("patients")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Patient not found" },
          { status: 404 }
        );
      }
      console.error("Failed to update patient:", error);
      return NextResponse.json(
        { error: "Failed to update patient" },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Patient);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/patients/[id] - Delete a patient
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Delete patient
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to delete patient:", error);
      return NextResponse.json(
        { error: "Failed to delete patient" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Patient deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}