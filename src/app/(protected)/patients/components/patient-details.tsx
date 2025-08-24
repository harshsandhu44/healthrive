"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Patient } from "@/lib/schemas/patient";

interface PatientDetailsProps {
  patient: Patient;
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <Separator className="mt-2 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Patient ID</p>
            <p className="font-mono text-sm">{patient.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{patient.first_name} {patient.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p>{formatDate(patient.date_of_birth)} ({getAge(patient.date_of_birth)} years old)</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p>{patient.phone_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blood Type</p>
            {patient.blood_type ? (
              <Badge variant="secondary">{patient.blood_type}</Badge>
            ) : (
              <p className="text-muted-foreground">Not specified</p>
            )}
          </div>
        </div>
      </div>

      {(patient.address || patient.city || patient.state || patient.post_code) && (
        <div>
          <h3 className="text-lg font-semibold">Address Information</h3>
          <Separator className="mt-2 mb-4" />
          <div className="space-y-2">
            {patient.address && (
              <div>
                <p className="text-sm text-muted-foreground">Street Address</p>
                <p>{patient.address}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patient.city && (
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p>{patient.city}</p>
                </div>
              )}
              {patient.state && (
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p>{patient.state}</p>
                </div>
              )}
              {patient.post_code && (
                <div>
                  <p className="text-sm text-muted-foreground">Post Code</p>
                  <p>{patient.post_code}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {patient.medical_history && Object.keys(patient.medical_history).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Medical History</h3>
          <Separator className="mt-2 mb-4" />
          <div className="bg-muted/50 rounded-lg p-4">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(patient.medical_history, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}