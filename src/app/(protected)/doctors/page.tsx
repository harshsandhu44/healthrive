import { DoctorsDataTable } from "./doctors-table";
import { getDoctors } from "@/lib/actions/doctors";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
        <p className="text-muted-foreground">
          Manage and view all doctors in your healthcare facility.
        </p>
      </div>

      <DoctorsDataTable data={doctors} />
    </main>
  );
}
