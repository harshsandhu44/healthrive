"use client";

import { PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function QuickActions() {
  const quickActions = [
    {
      label: "Add Patient",
      icon: PlusIcon,
      action: () => console.log("Add Patient"),
    },
    {
      label: "Find Patient",
      icon: SearchIcon,
      action: () => console.log("Find Patient"),
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
