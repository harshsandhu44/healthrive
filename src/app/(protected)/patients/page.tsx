"use client";

import { PatientsDataTable } from "./patients-data-table";
import { allPatients } from "@/lib/mock-data";

export default function PatientsPage() {

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">
          Manage and track all patients across your healthcare facility.
        </p>
      </div>
      
      <PatientsDataTable data={allPatients} />
    </main>
  );
}
