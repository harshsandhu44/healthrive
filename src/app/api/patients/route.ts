import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";
import {
  PatientCreateSchema,
  generatePatientId,
  type Patient,
} from "@/lib/schemas/patient";

// GET /api/patients - List patients with optional search and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query
    let query = supabase
      .from("patients")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Add search filter
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone_number.ilike.%${search}%`
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
      return NextResponse.json(
        { error: "Failed to fetch patients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data as Patient[],
      count,
      pagination: {
        limit,
        offset,
        hasMore: count ? offset + limit < count : false,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
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
    const validation = PatientCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const patientData = validation.data;
    const id = generatePatientId();

    // Insert patient
    const { data, error } = await supabase
      .from("patients")
      .insert({
        id,
        user_id: user.id,
        ...patientData,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create patient:", error);
      return NextResponse.json(
        { error: "Failed to create patient" },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Patient, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}