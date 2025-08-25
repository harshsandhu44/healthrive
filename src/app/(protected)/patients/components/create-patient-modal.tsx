"use client";

import { useState, useEffect } from "react";
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
import { PatientForm } from "./patient-form";

interface CreatePatientModalProps {
  children: React.ReactNode;
}

export function CreatePatientModal({ children }: CreatePatientModalProps) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const handleSuccess = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Patient</DialogTitle>
            <DialogDescription>
              Add a new patient to your practice. Fill in the required information below.
            </DialogDescription>
          </DialogHeader>
          <PatientForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create New Patient</DrawerTitle>
          <DrawerDescription>
            Add a new patient to your practice. Fill in the required information below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
          <PatientForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}