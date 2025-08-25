"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuickActions } from "./quick-actions";
import { DataTable } from "./data-table";
import { PatientDialog } from "./patient-dialog";
import { PatientForm } from "./patient-form";
import { Patient, PatientCreate } from "@/lib/schemas/patient";
import { PatientsAPI, APIClientError } from "@/lib/api/patients";
import { usePatientDialogStore } from "@/stores/patient-dialog-store";
import { SearchIcon } from "lucide-react";

interface PatientsClientProps {
  initialPatients: Patient[];
  initialCount: number | null;
}

export function PatientsClient({ 
  initialPatients, 
  initialCount 
}: PatientsClientProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [count, setCount] = useState(initialCount);

  // Use Zustand store for dialog state management
  const {
    isAddDialogOpen,
    isEditDialogOpen,
    editingPatient,
    isSubmitting,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    setSubmitting,
  } = usePatientDialogStore();

  const loadPatients = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const result = await PatientsAPI.getPatients({
        search: search || undefined,
        limit: 100,
      });
      setPatients(result.data);
      setCount(result.count);
    } catch (error) {
      if (error instanceof APIClientError) {
        toast.error(`Failed to load patients: ${error.message}`);
      } else {
        toast.error("Failed to load patients");
      }
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update patients when search params change (from server navigation)
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam !== searchQuery) {
      setSearchQuery(searchParam || "");
      if (searchParam !== initialSearch) {
        loadPatients(searchParam || "");
      }
    }
  }, [searchParams, searchQuery, initialSearch, loadPatients]);

  const handleSearch = () => {
    loadPatients(searchQuery);
  };

  const handleAddPatient = async (data: PatientCreate) => {
    try {
      setSubmitting(true);
      const newPatient = await PatientsAPI.createPatient(data);
      setPatients((prev) => [newPatient, ...prev]);
      setCount((prev) => (prev ? prev + 1 : 1));
      closeAddDialog();
      toast.success("Patient added successfully");
    } catch (error) {
      if (error instanceof APIClientError) {
        toast.error(`Failed to add patient: ${error.message}`);
        if (error.data.details) {
          console.error("Validation errors:", error.data.details);
        }
      } else {
        toast.error("Failed to add patient");
      }
      console.error("Error adding patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePatient = async (data: PatientCreate) => {
    if (!editingPatient) return;

    try {
      setSubmitting(true);
      const updatedPatient = await PatientsAPI.updatePatient({
        id: editingPatient.id,
        ...data,
      });
      setPatients((prev) =>
        prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
      );
      closeEditDialog();
      toast.success("Patient updated successfully");
    } catch (error) {
      if (error instanceof APIClientError) {
        toast.error(`Failed to update patient: ${error.message}`);
      } else {
        toast.error("Failed to update patient");
      }
      console.error("Error updating patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    try {
      setSubmitting(true);
      await PatientsAPI.deletePatient(patient.id);
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
      setCount((prev) => (prev ? prev - 1 : 0));
      toast.success("Patient deleted successfully");
    } catch (error) {
      if (error instanceof APIClientError) {
        toast.error(`Failed to delete patient: ${error.message}`);
      } else {
        toast.error("Failed to delete patient");
      }
      console.error("Error deleting patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Here you can perform quick actions on patients. You can add, edit,
            or delete patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuickActions onSearchPatient={handleSearch} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
          <CardDescription>
            Search patients by name or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients ({count || patients.length})</CardTitle>
          <CardDescription>
            All registered patients in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Loading patients...</p>
            </div>
          ) : (
            <DataTable
              patients={patients}
              onEdit={openEditDialog}
              onDelete={handleDeletePatient}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Patient Dialog */}
      {isAddDialogOpen && (
        <PatientDialog
          title="Add New Patient"
          description="Enter the patient's information to add them to the system."
          content={
            <PatientForm onSubmit={handleAddPatient} isLoading={isSubmitting} />
          }
        >
          <div />
        </PatientDialog>
      )}

      {/* Edit Patient Dialog */}
      {isEditDialogOpen && editingPatient && (
        <PatientDialog
          title="Edit Patient"
          description="Update the patient's information."
          content={
            <PatientForm
              patient={editingPatient}
              onSubmit={handleUpdatePatient}
              isLoading={isSubmitting}
            />
          }
        >
          <div />
        </PatientDialog>
      )}
    </div>
  );
}