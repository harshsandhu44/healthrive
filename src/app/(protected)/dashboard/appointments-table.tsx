"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ArrowUpDown,
} from "lucide-react";
import { todaysAppointments, type Appointment } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getTodaysAppointments } from "../appointments/actions";

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

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("time")}</div>
    ),
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Patient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("patientName")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.patientId}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as keyof typeof typeColors;
      return (
        <Badge
          variant="secondary"
          className={cn(typeColors[type], "capitalize")}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Doctor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("doctor")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusColors;
      return (
        <Badge
          variant="secondary"
          className={cn(statusColors[status], "capitalize")}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("notes")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const appointment = row.original;
      return <AppointmentActions appointment={appointment} />;
    },
  },
];

interface DataTableProps {
  data: Appointment[];
}

function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Filter patients..."
          value={
            (table.getColumn("patientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("patientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} appointment(s) total.
        </div>
      </div>
    </div>
  );
}

export async function AppointmentsTable() {
  const appointments = await getTodaysAppointments();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Appointments</CardTitle>
        <CardDescription>
          Manage and track appointments scheduled for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable data={appointments} />
      </CardContent>
    </Card>
  );
}
