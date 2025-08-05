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
import { CreateDoctorForm } from "@/components/forms/create-doctor-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { PropsWithChildren } from "react";

export const CreateDoctorModal = ({ children }: PropsWithChildren) => {
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
          <DrawerTitle>Add a doctor</DrawerTitle>
          <DrawerDescription>
            Add a new doctor for your patient.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-12 container overflow-y-auto">
          <CreateDoctorForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a doctor</DialogTitle>
          <DialogDescription>Add a new doctor.</DialogDescription>
        </DialogHeader>
        <CreateDoctorForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};
