"use client";

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

  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Appointment</DrawerTitle>
          <DrawerDescription>
            Create a new appointment for your patient.
          </DrawerDescription>
        </DrawerHeader>
        <CreateAppointmentForm />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment for your patient.
          </DialogDescription>
        </DialogHeader>
        <CreateAppointmentForm />
      </DialogContent>
    </Dialog>
  );
};
