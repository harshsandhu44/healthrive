"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { UpdateAppointmentModal } from "./update-appointment-modal";
import { DeleteAppointmentModal } from "./delete-appointment-modal";
// Note: Feature flags will be passed as props to avoid client-side async issues

interface AppointmentWithPatient {
  id: string;
  datetime: string;
  user_id: string;
  patient_id: string;
  notes?: string;
  appointment_type?:
    | "consultation"
    | "follow-up"
    | "checkup"
    | "procedure"
    | "emergency"
    | "telehealth"
    | "other";
  duration_minutes: number;
  location?: string;
  reason?: string;
  no_show: boolean;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

interface FeatureFlags {
  canEdit: boolean;
  canDelete: boolean;
}

export const createAppointmentsColumns = ({ canEdit, canDelete }: FeatureFlags): ColumnDef<AppointmentWithPatient>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const datetime = row.getValue("datetime") as string;
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {format(new Date(datetime), "MMM dd, yyyy")}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(datetime), "h:mm a")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "patients",
    id: "patient_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => {
      const patient = row.original
        .patients as AppointmentWithPatient["patients"];
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {patient.first_name} {patient.last_name}
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {patient.phone_number}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "appointment_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("appointment_type") as string;
      return type ? (
        <Badge variant="outline" className="capitalize">
          {type}
        </Badge>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return reason ? (
        <div className="max-w-[200px] truncate" title={reason}>
          {reason}
        </div>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  {
    accessorKey: "duration_minutes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      const duration = row.getValue("duration_minutes") as number;
      return (
        <div className="text-sm">
          {duration >= 60 ? `${duration / 60}h` : `${duration}m`}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="secondary" className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return location ? (
        <div className="text-sm">{location}</div>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(appointment.id)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Copy appointment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View appointment
            </DropdownMenuItem>
            {canEdit && (
              <UpdateAppointmentModal appointment={appointment}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit appointment
                </DropdownMenuItem>
              </UpdateAppointmentModal>
            )}
            {canDelete && (
              <DeleteAppointmentModal appointment={appointment}>
                <DropdownMenuItem 
                  className="text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete appointment
                </DropdownMenuItem>
              </DeleteAppointmentModal>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
