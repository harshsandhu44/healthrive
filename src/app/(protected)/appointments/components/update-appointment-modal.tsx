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

interface UpdateAppointmentModalProps {
  appointment: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function UpdateAppointmentModal({
  appointment: _appointment, // eslint-disable-line @typescript-eslint/no-unused-vars
  children,
  onSuccess: _onSuccess, // eslint-disable-line @typescript-eslint/no-unused-vars
}: UpdateAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuccess = () => {
    setOpen(false);
    // onSuccess?.();
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
            <DrawerTitle>Update Appointment</DrawerTitle>
            <DrawerDescription>
              Update appointment details.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <div>Update form will be implemented here</div>
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
        <div>Update form will be implemented here</div>
      </DialogContent>
    </Dialog>
  );
}