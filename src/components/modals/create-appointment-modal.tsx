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
import { CreateAppointmentForm } from "@/components/forms/create-appointment-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { PropsWithChildren } from "react";

export const CreateAppointmentModal = ({ children }: PropsWithChildren) => {
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
          <DrawerTitle>Create Appointment</DrawerTitle>
          <DrawerDescription>
            Create a new appointment for your patient.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-12 container overflow-y-auto">
          <CreateAppointmentForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment for your patient.
          </DialogDescription>
        </DialogHeader>
        <CreateAppointmentForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
