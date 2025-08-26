import { Button } from "@/components/ui/button";
import { CreateAppointmentModal } from "./components/create-appointment-modal";
import { PlusIcon } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AppointmentsLayout({ children }: LayoutProps) {
  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono">
          <h1 className="text-5xl">Appointments</h1>
          <p>Manage your patient appointments and schedules.</p>
        </div>
        <CreateAppointmentModal>
          <Button variant="outline">
            <PlusIcon />
            Create Appointment
          </Button>
        </CreateAppointmentModal>
      </div>
      {children}
    </main>
  );
}