import { Suspense } from "react";
import { getPatients } from "@/lib/data/patients";
import { PatientsClient } from "./components/patients-client";

interface PatientsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;

  // Fetch initial data on server-side
  const { data: initialPatients, count } = await getPatients({
    search,
    limit: 100,
  });

  return (
    <main className="space-y-6">
      <section className="font-mono">
        <h1 className="text-3xl">Patients</h1>
        <p>Manage your patients here!</p>
      </section>

      <Suspense
        fallback={
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        }
      >
        <PatientsClient 
          initialPatients={initialPatients}
          initialCount={count}
        />
      </Suspense>
    </main>
  );
}