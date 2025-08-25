import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/db/server";

export default async function PatientsPage() {
  const supabase = await createClient();

  const { data: patients, count } = await supabase.from("patients").select("*");
  console.info(patients, count);

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>{count ?? 0} patients</CardDescription>
        </CardHeader>
        <CardContent>{/* TODO: data table */}</CardContent>
      </Card>
    </section>
  );
}
