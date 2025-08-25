import { enableCreatePatientFlag, enableSearchPatientFlag } from "@/flags";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreatePatientModal } from "../components/create-patient-modal";

export default async function QuickActions() {
  const enableCreate = await enableCreatePatientFlag();
  const enableSearch = await enableSearchPatientFlag();

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Perform common tasks quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-2">
          <CreatePatientModal>
            <Button disabled={!enableCreate} variant="outline">
              Create Patient
            </Button>
          </CreatePatientModal>
          <Button disabled={!enableSearch} variant="outline">
            Search Patients
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
