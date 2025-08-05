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
import { EditPatientForm } from "@/components/forms/edit-patient-form";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Patient } from "@/lib/types/entities";
import { PropsWithChildren } from "react";

interface EditPatientModalProps extends PropsWithChildren {
  patient: Patient;
}

export const EditPatientModal = ({ patient, children }: EditPatientModalProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Patient</DrawerTitle>
          <DrawerDescription>
            Update patient information and medical details.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-12 container overflow-y-auto">
          <EditPatientForm 
            patient={patient}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Update patient information and medical details.
          </DialogDescription>
        </DialogHeader>
        <EditPatientForm 
          patient={patient}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};