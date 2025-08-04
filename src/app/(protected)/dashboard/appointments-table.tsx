"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { todaysAppointments, type Appointment } from "./mock-data";
import { cn } from "@/lib/utils";

const statusColors = {
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "in-progress": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const typeColors = {
  consultation: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  "follow-up": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  surgery: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  emergency: "bg-red-500/10 text-red-700 dark:text-red-400",
};

function AppointmentActions({ appointment }: { appointment: Appointment }) {
  const handleAction = (action: string) => {
    console.log(`${action} appointment:`, appointment.id);
    // In a real app, this would make an API call
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {appointment.status === "scheduled" && (
          <>
            <DropdownMenuItem
              onClick={() => handleAction("start")}
              className="text-blue-600"
            >
              <Clock className="mr-2 h-4 w-4" />
              Start Appointment
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("cancel")}
              className="text-red-600"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </DropdownMenuItem>
          </>
        )}
        {appointment.status === "in-progress" && (
          <DropdownMenuItem
            onClick={() => handleAction("complete")}
            className="text-green-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Complete
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleAction("view-patient")}>
          <User className="mr-2 h-4 w-4" />
          View Patient
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppointmentsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Appointments</CardTitle>
        <CardDescription>
          Manage and track appointments scheduled for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaysAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {appointment.time}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.patientId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(typeColors[appointment.type], "capitalize")}
                  >
                    {appointment.type}
                  </Badge>
                </TableCell>
                <TableCell>{appointment.doctor}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      statusColors[appointment.status],
                      "capitalize",
                    )}
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {appointment.notes}
                </TableCell>
                <TableCell className="text-right">
                  <AppointmentActions appointment={appointment} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
