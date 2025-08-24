import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuickActions } from "./components/quick-actions";

export default function PatientsPage() {
  return (
    <main className="space-y-6">
      <section className="font-mono">
        <h1 className="text-3xl">Patients</h1>
        <p>Manage your patients here!</p>
      </section>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Here you can perform quick actions on patients. You can add, edit,
            or delete patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuickActions />
        </CardContent>
      </Card>

      <section>{/* TODO: add a data grid */}</section>
    </main>
  );
}
