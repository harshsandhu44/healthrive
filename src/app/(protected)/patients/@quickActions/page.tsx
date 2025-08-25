import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CreatePatientModal } from "../components/create-patient-modal";

export default async function QuickActions() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Perform common tasks quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-1">
          <CreatePatientModal>
            <Button variant="outline">Create Patient</Button>
          </CreatePatientModal>
          <Button asChild variant="outline">
            <Link href={{ pathname: "/patients/search" }}>Search Patients</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
