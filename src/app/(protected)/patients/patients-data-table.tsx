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
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  User,
  ArrowUpDown,
  Calendar,
  Phone,
  Mail,
  FileText,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { type Patient } from "@/lib/types/entities";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deletePatient } from "./actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const statusColors = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  inactive: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  discharged: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

const genderColors = {
  male: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  female: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
};

interface PatientActionsProps {
  patient: Patient;
}

function PatientActions({ patient }: PatientActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeletePatient = () => {
    if (confirm(`Are you sure you want to delete patient ${patient.name}? This action cannot be undone.`)) {
      startTransition(async () => {
        try {
          await deletePatient(patient.id);
          router.refresh();
        } catch (error) {
          console.error('Error deleting patient:', error);
          alert('Failed to delete patient. Please try again.');
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={`/patients/${patient.id}`}>
            <User className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem disabled>
          <Edit className="mr-2 h-4 w-4" />
          Edit Patient
        </DropdownMenuItem>
        
        <DropdownMenuItem disabled>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Appointment
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem disabled>
          <Phone className="mr-2 h-4 w-4" />
          Call Patient
        </DropdownMenuItem>
        
        <DropdownMenuItem disabled>
          <Mail className="mr-2 h-4 w-4" />
          Email Patient
        </DropdownMenuItem>
        
        <DropdownMenuItem disabled>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleDeletePatient}
          className="text-red-600 focus:text-red-600"
          disabled={isPending}
        >
          <FileText className="mr-2 h-4 w-4" />
          {isPending ? 'Deleting...' : 'Delete Patient'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface PatientsDataTableProps {
  data: Patient[];
}

export function PatientsDataTable({ data }: PatientsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false }
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Patient Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground">
            ID: {row.original.id}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "age",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Age
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("age")} years</div>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const gender = row.getValue("gender") as keyof typeof genderColors;
        return (
          <Badge
            variant="secondary"
            className={cn(genderColors[gender], "capitalize")}
          >
            {gender}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contactInfo",
      header: "Contact",
      cell: ({ row }) => {
        const contactInfo = row.original.contactInfo;
        return (
          <div className="space-y-1">
            <div className="text-sm">{contactInfo.phone}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
              {contactInfo.email}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "insurance",
      header: "Insurance",
      cell: ({ row }) => {
        const insurance = row.original.insurance;
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{insurance.provider}</div>
            <div className="text-xs text-muted-foreground">
              {insurance.policyNumber}
            </div>
          </div>
        );
      },
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
      accessorKey: "registrationDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Registered
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("registrationDate"));
        return (
          <div className="text-sm">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.getValue("registrationDate"));
        const dateB = new Date(rowB.getValue("registrationDate"));
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/patients/${patient.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">View patient details</span>
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <PatientActions patient={patient} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Filter patients..."
          value={
            (table.getColumn("name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={
            (table.getColumn("status")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="discharged">Discharged</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn("gender")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("gender")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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
                            header.getContext()
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
                        cell.getContext()
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
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} patient(s) total.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}