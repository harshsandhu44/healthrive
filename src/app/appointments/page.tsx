import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/db/server";
import { AppointmentsTable } from "./components/appointments-table";
import { CreateAppointmentModal } from "./components/create-appointment-modal";
import { 
  enableCreateAppointmentFlag, 
  enableEditAppointmentFlag, 
  enableDeleteAppointmentFlag, 
  enableSearchAppointmentFlag 
} from "@/flags";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return <div>Please sign in to view appointments.</div>;
  }

  // Get feature flag values
  const canCreateAppointment = await enableCreateAppointmentFlag();
  const canEditAppointment = await enableEditAppointmentFlag();
  const canDeleteAppointment = await enableDeleteAppointmentFlag();
  const canSearchAppointment = await enableSearchAppointmentFlag();

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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            {count === 0 ? "No appointments found" : `${count ?? 0} appointments`}
          </p>
        </div>
        {canCreateAppointment && (
          <CreateAppointmentModal>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </CreateAppointmentModal>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          <AppointmentsTable 
            data={appointments || []} 
            canEdit={canEditAppointment}
            canDelete={canDeleteAppointment}
            canSearch={canSearchAppointment}
          />
        </CardContent>
      </Card>
    </section>
  );
}
