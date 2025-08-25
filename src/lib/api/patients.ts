import { Patient, PatientCreate, PatientUpdate } from "@/lib/schemas/patient";

interface PatientsListResponse {
  data: Patient[];
  count: number | null;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface APIError {
  error: string;
  details?: Record<string, string[]>;
}

class APIClientError extends Error {
  constructor(public status: number, public data: APIError) {
    super(data.error);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new APIClientError(response.status, data);
  }
  
  return data;
}

export class PatientsAPI {
  private static readonly BASE_URL = "/api/patients";

  static async getPatients(options?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<PatientsListResponse> {
    const searchParams = new URLSearchParams();
    
    if (options?.limit) {
      searchParams.set("limit", options.limit.toString());
    }
    if (options?.offset) {
      searchParams.set("offset", options.offset.toString());
    }
    if (options?.search) {
      searchParams.set("search", options.search);
    }

    const url = `${this.BASE_URL}?${searchParams.toString()}`;
    const response = await fetch(url);
    
    return handleResponse<PatientsListResponse>(response);
  }

  static async getPatientById(id: string): Promise<Patient> {
    const response = await fetch(`${this.BASE_URL}/${id}`);
    return handleResponse<Patient>(response);
  }

  static async createPatient(patientData: PatientCreate): Promise<Patient> {
    const response = await fetch(this.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });
    
    return handleResponse<Patient>(response);
  }

  static async updatePatient(patientData: PatientUpdate): Promise<Patient> {
    const { id, ...updateData } = patientData;
    
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    
    return handleResponse<Patient>(response);
  }

  static async deletePatient(id: string): Promise<{ message: string }> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "DELETE",
    });
    
    return handleResponse<{ message: string }>(response);
  }
}

// Export error class for error handling in components
export { APIClientError };