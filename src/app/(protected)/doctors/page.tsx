import { DoctorsDataTable } from "./doctors-table";
import { getDoctors } from "./actions";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateDoctorModal } from "@/components/modals/create-doctor-modal";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">
            Manage and view all doctors in your healthcare facility.
          </p>
        </div>
        <CreateDoctorModal>
          <Button>
            <PlusIcon />
            Add Doctor
          </Button>
        </CreateDoctorModal>
      </div>

      <DoctorsDataTable data={doctors} />
    </main>
  );
}
