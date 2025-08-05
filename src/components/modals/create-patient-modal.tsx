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
import { CreatePatientForm } from "@/components/forms/create-patient-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { PropsWithChildren } from "react";

export const CreatePatientModal = ({ children }: PropsWithChildren) => {
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
          <DrawerTitle>Create Patient</DrawerTitle>
          <DrawerDescription>
            Add a new patient to your healthcare facility.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-12 container overflow-y-auto">
          <CreatePatientForm 
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
          <DialogTitle>Create Patient</DialogTitle>
          <DialogDescription>
            Add a new patient to your healthcare facility.
          </DialogDescription>
        </DialogHeader>
        <CreatePatientForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};