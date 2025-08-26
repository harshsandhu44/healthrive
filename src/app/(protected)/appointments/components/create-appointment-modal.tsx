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

interface CreateAppointmentModalProps {
  children: React.ReactNode;
}

export function CreateAppointmentModal({ children }: CreateAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuccess = () => {
    setOpen(false);
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <DrawerTitle>Create New Appointment</DrawerTitle>
            <DrawerDescription>
              Schedule a new appointment with a patient.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <div>Form will be implemented here</div>
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
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment with a patient.
          </DialogDescription>
        </DialogHeader>
        <div>Form will be implemented here</div>
      </DialogContent>
    </Dialog>
  );
}