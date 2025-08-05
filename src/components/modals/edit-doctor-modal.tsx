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
import { EditDoctorForm } from "@/components/forms/edit-doctor-form";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Doctor } from "@/lib/types/entities";
import { PropsWithChildren } from "react";

interface EditDoctorModalProps extends PropsWithChildren {
  doctor: Doctor;
}

export const EditDoctorModal = ({ doctor, children }: EditDoctorModalProps) => {
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
          <DrawerTitle>Edit Doctor</DrawerTitle>
          <DrawerDescription>
            Update doctor information and professional details.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-12 container overflow-y-auto">
          <EditDoctorForm 
            doctor={doctor}
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
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>
            Update doctor information and professional details.
          </DialogDescription>
        </DialogHeader>
        <EditDoctorForm 
          doctor={doctor}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};