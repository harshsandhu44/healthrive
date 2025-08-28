"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

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
import { bulkDeleteAppointments } from "@/lib/actions/appointment-actions";

interface AppointmentWithPatient {
  id: string;
  datetime: string;
  appointment_type?: string;
  patients: {
    first_name: string;
    last_name: string;
  };
}

interface BulkDeleteAppointmentsModalProps {
  appointments: AppointmentWithPatient[];
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function BulkDeleteAppointmentsModal({
  appointments,
  onSuccess,
  children,
}: BulkDeleteAppointmentsModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const appointmentCount = appointments.length;
  const appointmentIds = appointments.map((apt) => apt.id);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await bulkDeleteAppointments(appointmentIds);

        if (result.success) {
          toast.success(
            result.message ||
              `Successfully deleted ${appointmentCount} appointments`,
          );
          setOpen(false);
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to delete appointments");
        }
      } catch (error) {
        toast.error("Failed to delete appointments");
        console.error("Bulk delete appointments error:", error);
      }
    });
  };

  // Show first few appointments as preview
  const previewAppointments = appointments.slice(0, 3);
  const hasMore = appointments.length > 3;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Appointments</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You are about to permanently delete {appointmentCount}{" "}
                  appointment{appointmentCount > 1 ? "s" : ""}. This action
                  cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm font-medium">Selected appointments:</p>
                <div className="rounded-lg border p-3 bg-muted/50 max-h-48 overflow-y-auto">
                  <div className="space-y-3">
                    {previewAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex justify-between items-start text-sm"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">
                            {appointment.patients.first_name}{" "}
                            {appointment.patients.last_name}
                          </div>
                          <div className="text-muted-foreground">
                            {format(
                              new Date(appointment.datetime),
                              "MMM dd, yyyy 'at' h:mm a",
                            )}
                          </div>
                        </div>
                        {appointment.appointment_type && (
                          <div className="text-xs bg-secondary px-2 py-1 rounded capitalize">
                            {appointment.appointment_type}
                          </div>
                        )}
                      </div>
                    ))}
                    {hasMore && (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        ... and {appointments.length - 3} more appointment
                        {appointments.length - 3 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete {appointmentCount} Appointment
            {appointmentCount > 1 ? "s" : ""}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
