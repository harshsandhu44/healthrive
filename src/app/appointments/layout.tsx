import { PlusIcon } from "lucide-react";
import { enableCreateAppointmentFlag } from "@/flags";
import { Button } from "@/components/ui/button";
import { CreateAppointmentModal } from "./components/create-appointment-modal";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AppointmentsLayout({ children }: LayoutProps) {
  // Get feature flag values
  const canCreateAppointment = await enableCreateAppointmentFlag();

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="font-mono">
          <h1 className="text-3xl font-semibold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your patient appointments and schedules.
          </p>
        </div>
        {canCreateAppointment && (
          <CreateAppointmentModal>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </CreateAppointmentModal>
        )}
      </div>
      {children}
    </main>
  );
}
