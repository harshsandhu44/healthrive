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
import { UpdatePatientForm } from "./update-patient-form";
import { Patient } from "@/lib/schemas/patient";
import { useIsMobile } from "@/hooks/use-mobile";

interface UpdatePatientModalProps {
  patient: Patient;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function UpdatePatientModal({
  patient,
  children,
  onSuccess,
}: UpdatePatientModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
    window.location.reload();
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
            <DrawerTitle>Update Patient</DrawerTitle>
            <DrawerDescription>
              Update {patient.first_name} {patient.last_name}&apos;s information.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <UpdatePatientForm
              patient={patient}
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
          <DialogTitle>Update Patient</DialogTitle>
          <DialogDescription>
            Update {patient.first_name} {patient.last_name}&apos;s information.
          </DialogDescription>
        </DialogHeader>
        <UpdatePatientForm
          patient={patient}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}