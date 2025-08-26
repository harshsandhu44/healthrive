"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { UpdateAppointmentForm } from "./update-appointment-form";
import { Appointment } from "@/lib/schemas/appointment";

interface UpdateAppointmentModalProps {
  appointment: Appointment;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function UpdateAppointmentModal({
  appointment,
  children,
  onSuccess,
}: UpdateAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
    // Revalidation now handled in server action for seamless experience
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Update Appointment</DrawerTitle>
            <DrawerDescription>
              Update appointment details.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <UpdateAppointmentForm 
              appointment={appointment} 
              onSuccess={handleSuccess} 
              onCancel={handleCancel} 
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Appointment</DialogTitle>
          <DialogDescription>
            Update appointment details.
          </DialogDescription>
        </DialogHeader>
        <UpdateAppointmentForm 
          appointment={appointment} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </DialogContent>
    </Dialog>
  );
}