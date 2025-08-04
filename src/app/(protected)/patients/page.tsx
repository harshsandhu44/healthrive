"use client";

import { useState } from "react";
import { PatientsDataTable } from "./patients-data-table";
import { MedicalHistoryModal } from "./medical-history-modal";
import { allPatients, type Patient } from "@/lib/mock-data";

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false);

  const handleViewMedicalHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsMedicalHistoryOpen(true);
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">
          Manage and track all patients across your healthcare facility.
        </p>
      </div>
      
      <PatientsDataTable 
        data={allPatients} 
        onViewMedicalHistory={handleViewMedicalHistory}
      />
      
      <MedicalHistoryModal
        patient={selectedPatient}
        open={isMedicalHistoryOpen}
        onOpenChange={setIsMedicalHistoryOpen}
      />
    </main>
  );
}
