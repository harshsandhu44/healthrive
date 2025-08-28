import { createClient } from "@/lib/db/server";
import { Patient } from "@/lib/schemas/patient";
import { PatientsTable } from "./components/patients-table";

export default async function PatientsPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return <div>Please sign in to view patients.</div>;
  }

  const { data: patients, error } = await supabase
    .from("patients")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch patients:", error);
    return <div>Error loading patients. Please try again.</div>;
  }

  return (
    <section>
      <PatientsTable data={(patients as Patient[]) || []} />
    </section>
  );
}
