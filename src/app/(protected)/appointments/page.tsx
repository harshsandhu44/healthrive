import { AppointmentsDataTable } from "./appointments-table";
import { getAppointments } from "./actions";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          Manage and track all appointments across your healthcare facility.
        </p>
      </div>
      <AppointmentsDataTable data={appointments} />
    </main>
  );
}
