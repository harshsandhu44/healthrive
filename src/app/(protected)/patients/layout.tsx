import { Button } from "@/components/ui/button";
import { CreatePatientModal } from "./components/create-patient-modal";
import { PlusIcon } from "lucide-react";

export default function PatientsLayout({ children }: LayoutProps<"/patients">) {
  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono">
        <div>
          <h1 className="text-3xl font-semibold">Patients</h1>
          <p className="text-muted-foreground">
            View all your patients and their details.
          </p>
        </div>
        <CreatePatientModal>
          <Button>
            <PlusIcon />
            Create Patient
          </Button>
        </CreatePatientModal>
      </div>
      {children}
    </main>
  );
}
