import {
  enableEditAppointmentFlag,
  enableDeleteAppointmentFlag,
  enableSearchAppointmentFlag,
} from "@/flags";
import { createClient } from "@/lib/db/server";
import { AppointmentsTable } from "./components/appointments-table";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return <div>Please sign in to view appointments.</div>;
  }

  // Get feature flag values
  const canEditAppointment = await enableEditAppointmentFlag();
  const canDeleteAppointment = await enableDeleteAppointmentFlag();
  const canSearchAppointment = await enableSearchAppointmentFlag();

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patients!inner(id, first_name, last_name, phone_number)
    `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("datetime", { ascending: true });

  if (error) {
    console.error("Failed to fetch appointments:", error);
    return <div>Error loading appointments. Please try again.</div>;
  }

  return (
    <section className="space-y-6">
      <AppointmentsTable
        data={appointments || []}
        canEdit={canEditAppointment}
        canDelete={canDeleteAppointment}
        canSearch={canSearchAppointment}
      />
    </section>
  );
}
