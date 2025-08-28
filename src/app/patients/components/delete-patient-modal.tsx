"use client";

import { useState, useTransition, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deletePatient, getPatientWithAppointments } from "@/lib/actions/patient-actions";
import { Patient } from "@/lib/schemas/patient";

interface DeletePatientModalProps {
  patient: Patient;
  children?: React.ReactNode;
}

export function DeletePatientModal({
  patient,
  children,
}: DeletePatientModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  // Load appointment count when modal opens
  useEffect(() => {
    if (open && appointmentCount === null) {
      setIsLoadingCount(true);
      getPatientWithAppointments(patient.id)
        .then((result) => {
          if (result.success) {
            setAppointmentCount(result.appointmentCount || 0);
          } else {
            console.error("Failed to load appointment count:", result.error);
            setAppointmentCount(0);
          }
        })
        .catch((error) => {
          console.error("Error loading appointment count:", error);
          setAppointmentCount(0);
        })
        .finally(() => {
          setIsLoadingCount(false);
        });
    }
  }, [open, appointmentCount, patient.id]);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deletePatient(patient.id);
        
        if (result.success) {
          toast.success(
            appointmentCount && appointmentCount > 0
              ? `Patient and ${appointmentCount} appointment${appointmentCount > 1 ? 's' : ''} deleted successfully`
              : "Patient deleted successfully"
          );
          setOpen(false);
        } else {
          toast.error(result.error || "Failed to delete patient");
        }
      } catch (error) {
        toast.error("Failed to delete patient");
        console.error("Delete patient error:", error);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset appointment count when closing
      setAppointmentCount(null);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Patient</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Are you sure you want to delete this patient? This action cannot be undone.</p>
              
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Name:</span>
                    <span>{patient.first_name} {patient.last_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <span className="font-mono">{patient.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Date of Birth:</span>
                    <span>{format(new Date(patient.date_of_birth), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>

              {isLoadingCount ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking appointments...
                </div>
              ) : appointmentCount !== null && appointmentCount > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This patient has <strong>{appointmentCount}</strong> appointment{appointmentCount > 1 ? 's' : ''}.
                    Deleting this patient will also permanently delete {appointmentCount > 1 ? 'these appointments' : 'this appointment'}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending || isLoadingCount}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Patient
            {appointmentCount !== null && appointmentCount > 0 && ` & ${appointmentCount} Appointment${appointmentCount > 1 ? 's' : ''}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}