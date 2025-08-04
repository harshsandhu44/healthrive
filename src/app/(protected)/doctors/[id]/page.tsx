import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Stethoscope,
} from "lucide-react";
import { getDoctor } from "@/lib/actions/doctors";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DoctorDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const genderColors = {
  male: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  female: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
};

const specializationColors = {
  "Internal Medicine": "bg-green-500/10 text-green-700 dark:text-green-400",
  Cardiology: "bg-red-500/10 text-red-700 dark:text-red-400",
  Dermatology: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  "Emergency Medicine": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  "Orthopedic Surgery": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Pediatrics: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  Surgery: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  Psychiatry: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  Neurology: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  "Obstetrics & Gynecology": "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  Radiology: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  Anesthesiology: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
};

export default async function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const { id } = await params;
  const doctor = await getDoctor(id);

  if (!doctor) {
    notFound();
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(doctor.dateOfBirth);

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4">
        <Link href="/doctors">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{doctor.name}</h1>
          <p className="text-muted-foreground">
            Doctor ID: {doctor.id} • {doctor.specialization}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="text-sm mt-1">{doctor.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Age
                </label>
                <p className="text-sm mt-1">{age} years</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <div className="mt-1">
                  <Badge
                    variant="secondary"
                    className={cn(genderColors[doctor.gender], "capitalize")}
                  >
                    {doctor.gender}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p className="text-sm mt-1">
                  {new Date(doctor.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Specialization
              </label>
              <div className="mt-1">
                <Badge
                  variant="secondary"
                  className={cn(
                    specializationColors[
                      doctor.specialization as keyof typeof specializationColors
                    ] || "bg-gray-500/10 text-gray-700 dark:text-gray-400",
                  )}
                >
                  {doctor.specialization}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Doctor ID
              </label>
              <p className="text-sm mt-1 font-mono">{doctor.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone Number
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${doctor.contactInfo.phone}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {doctor.contactInfo.phone}
                </a>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${doctor.contactInfo.email}`}
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {doctor.contactInfo.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>

            <Button variant="outline" className="w-full" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>

            <Button variant="outline" className="w-full" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call Doctor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Department
              </label>
              <p className="text-sm mt-1">{doctor.specialization}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-700 dark:text-green-400"
                >
                  Active
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm mt-1">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
