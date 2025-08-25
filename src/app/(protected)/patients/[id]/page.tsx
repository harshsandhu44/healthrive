import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPatientById } from "@/lib/data/patients";

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  const { id } = await params;
  
  let patient;
  try {
    patient = await getPatientById(id);
  } catch (error) {
    console.error("Error fetching patient:", error);
    notFound();
  }

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
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/patients">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-muted-foreground">Patient Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <EditIcon className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
          <Button variant="outline" className="text-destructive hover:text-destructive">
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic patient information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                  <p className="font-mono text-sm">{patient.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-lg font-medium">{patient.first_name} {patient.last_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p>{formatDate(patient.date_of_birth)}</p>
                  <p className="text-sm text-muted-foreground">{getAge(patient.date_of_birth)} years old</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p>{patient.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                  {patient.blood_type ? (
                    <Badge variant="secondary" className="mt-1">{patient.blood_type}</Badge>
                  ) : (
                    <p className="text-muted-foreground">Not specified</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {(patient.address || patient.city || patient.state || patient.post_code) && (
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Patient&apos;s contact address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.address && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Street Address</p>
                    <p>{patient.address}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {patient.city && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">City</p>
                      <p>{patient.city}</p>
                    </div>
                  )}
                  {patient.state && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">State</p>
                      <p>{patient.state}</p>
                    </div>
                  )}
                  {patient.post_code && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Post Code</p>
                      <p>{patient.post_code}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {patient.medical_history && Object.keys(patient.medical_history).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Patient&apos;s medical history and notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(patient.medical_history, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}