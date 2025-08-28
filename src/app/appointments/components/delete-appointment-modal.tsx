"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

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
import { deleteAppointment } from "@/lib/actions/appointment-actions";

interface AppointmentWithPatient {
  id: string;
  datetime: string;
  appointment_type?: string;
  patients: {
    first_name: string;
    last_name: string;
  };
}

interface DeleteAppointmentModalProps {
  appointment: AppointmentWithPatient;
  children?: React.ReactNode;
}

export function DeleteAppointmentModal({
  appointment,
  children,
}: DeleteAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteAppointment(appointment.id);
        
        if (result.success) {
          toast.success("Appointment deleted successfully");
          setOpen(false);
        } else {
          toast.error(result.error || "Failed to delete appointment");
        }
      } catch (error) {
        toast.error("Failed to delete appointment");
        console.error("Delete appointment error:", error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>Are you sure you want to delete this appointment? This action cannot be undone.</p>
              
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Patient:</span>
                    <span>{appointment.patients.first_name} {appointment.patients.last_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Date & Time:</span>
                    <span>{format(new Date(appointment.datetime), "MMM dd, yyyy 'at' h:mm a")}</span>
                  </div>
                  {appointment.appointment_type && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{appointment.appointment_type}</span>
                    </div>
                  )}
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
            Delete Appointment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}