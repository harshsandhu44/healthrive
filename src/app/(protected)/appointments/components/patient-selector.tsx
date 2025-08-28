"use client";

import * as React from "react";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/lib/db/client";
interface PatientSelectorData {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface PatientSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PatientSelector({ 
  value, 
  onValueChange, 
  placeholder = "Select patient...",
  className 
}: PatientSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [patients, setPatients] = React.useState<PatientSelectorData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPatients() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data, error } = await supabase
          .from("patients")
          .select("id, first_name, last_name, phone_number")
          .eq("user_id", user.id)
          .order("first_name", { ascending: true });

        if (error) {
          console.error("Failed to fetch patients:", error);
          return;
        }

        setPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const selectedPatient = patients.find(patient => patient.id === value);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {loading ? (
              "Loading patients..."
            ) : selectedPatient ? (
              <span className="flex items-center gap-2">
                <span className="font-medium">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </span>
                <span className="text-sm text-muted-foreground font-mono">
                  {selectedPatient.phone_number}
                </span>
              </span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search patients..." />
            <CommandList>
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <UserPlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No patients found.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create a patient first to schedule appointments.
                  </p>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={`${patient.first_name} ${patient.last_name} ${patient.phone_number}`}
                    onSelect={() => {
                      onValueChange(patient.id === value ? "" : patient.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {patient.phone_number}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}