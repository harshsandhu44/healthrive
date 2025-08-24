"use client";

import { useState, useEffect } from "react";
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
import { QuickActions } from "./components/quick-actions";
import { DataTable } from "./components/data-table";
import { PatientDialog } from "./components/patient-dialog";
import { PatientForm } from "./components/patient-form";
import { Patient, PatientCreate } from "@/lib/schemas/patient";
import { PatientsService } from "@/services/patients";
import { SearchIcon } from "lucide-react";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const loadPatients = async (search?: string) => {
    try {
      setLoading(true);
      const result = await PatientsService.getPatients({
        search: search || undefined,
        limit: 100,
      });
      setPatients(result.data);
    } catch (error) {
      toast.error("Failed to load patients");
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = () => {
    loadPatients(searchQuery);
  };

  const handleAddPatient = async (data: PatientCreate) => {
    try {
      setSubmitting(true);
      const newPatient = await PatientsService.createPatient(data);
      setPatients(prev => [newPatient, ...prev]);
      setShowAddDialog(false);
      toast.success("Patient added successfully");
    } catch (error) {
      toast.error("Failed to add patient");
      console.error("Error adding patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePatient = async (data: PatientCreate) => {
    if (!editingPatient) return;
    
    try {
      setSubmitting(true);
      const updatedPatient = await PatientsService.updatePatient({
        id: editingPatient.id,
        ...data,
      });
      setPatients(prev => 
        prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
      );
      setEditingPatient(null);
      toast.success("Patient updated successfully");
    } catch (error) {
      toast.error("Failed to update patient");
      console.error("Error updating patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    try {
      setSubmitting(true);
      await PatientsService.deletePatient(patient.id);
      setPatients(prev => prev.filter(p => p.id !== patient.id));
      toast.success("Patient deleted successfully");
    } catch (error) {
      toast.error("Failed to delete patient");
      console.error("Error deleting patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="space-y-6">
      <section className="font-mono">
        <h1 className="text-3xl">Patients</h1>
        <p>Manage your patients here!</p>
      </section>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Here you can perform quick actions on patients. You can add, edit,
            or delete patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuickActions 
            onAddPatient={() => setShowAddDialog(true)}
            onSearchPatient={handleSearch}
          />
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients ({patients.length})</CardTitle>
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
              onEdit={setEditingPatient}
              onDelete={handleDeletePatient}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Patient Dialog */}
      {showAddDialog && (
        <PatientDialog
          title="Add New Patient"
          description="Enter the patient's information to add them to the system."
          content={
            <PatientForm 
              onSubmit={handleAddPatient}
              isLoading={submitting}
            />
          }
        >
          <div />
        </PatientDialog>
      )}

      {/* Edit Patient Dialog */}
      {editingPatient && (
        <PatientDialog
          title="Edit Patient"
          description="Update the patient's information."
          content={
            <PatientForm 
              patient={editingPatient}
              onSubmit={handleUpdatePatient}
              isLoading={submitting}
            />
          }
        >
          <div />
        </PatientDialog>
      )}
    </main>
  );
}
