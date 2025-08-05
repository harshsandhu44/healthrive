import { PatientsDataTable } from "./patients-data-table";
import { getPatients } from "./actions";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreatePatientModal } from "@/components/modals/create-patient-modal";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <main className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and track all patients across your healthcare facility.
          </p>
        </div>
        <CreatePatientModal>
          <Button>
            <PlusIcon />
            Add Patient
          </Button>
        </CreatePatientModal>
      </div>
      
      <PatientsDataTable data={patients} />
    </main>
  );
}
