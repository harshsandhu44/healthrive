import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/db/server";
import { AppointmentsTable } from "./components/appointments-table";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return <div>Please sign in to view appointments.</div>;
  }

  const { data: appointments, error, count } = await supabase
    .from("appointments")
    .select(`
      *,
      patients!inner(id, first_name, last_name, phone_number)
    `, { count: "exact" })
    .eq("user_id", user.id)
    .order("datetime", { ascending: true });

  if (error) {
    console.error("Failed to fetch appointments:", error);
    return <div>Error loading appointments. Please try again.</div>;
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            {count === 0 ? "No appointments found" : `${count ?? 0} appointments`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentsTable data={appointments || []} />
        </CardContent>
      </Card>
    </section>
  );
}
