import { Button } from "@/components/ui/button";
import { CreatePatientModal } from "./components/create-patient-modal";
import { PlusIcon } from "lucide-react";

export default function PatientsLayout({ children }: LayoutProps<"/patients">) {
  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono">
          <h1 className="text-5xl">Patients</h1>
          <p>View all your patients and their details.</p>
        </div>
        <CreatePatientModal>
          <Button variant="outline">
            <PlusIcon />
            Create Patient
          </Button>
        </CreatePatientModal>
      </div>
      {children}
    </main>
  );
}
