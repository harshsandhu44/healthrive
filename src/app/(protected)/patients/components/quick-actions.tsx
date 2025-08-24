"use client";

import { PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAddPatient: () => void;
  onSearchPatient: () => void;
}

export function QuickActions({ onAddPatient, onSearchPatient }: QuickActionsProps) {
  const quickActions = [
    {
      label: "Add Patient",
      icon: PlusIcon,
      action: onAddPatient,
    },
    {
      label: "Find Patient",
      icon: SearchIcon,
      action: onSearchPatient,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {quickActions.map((action) => (
        <Button key={action.label} variant="outline" onClick={action.action}>
          <action.icon />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
