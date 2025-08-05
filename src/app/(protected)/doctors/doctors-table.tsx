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
  Phone,
  Mail,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { type Doctor } from "@/lib/types/entities";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteDoctor } from "./actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { EditDoctorModal } from "@/components/modals/edit-doctor-modal";

const genderColors = {
  male: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  female: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
};

const specializationColors = {
  "Internal Medicine": "bg-green-500/10 text-green-700 dark:text-green-400",
  Cardiology: "bg-red-500/10 text-red-700 dark:text-red-400",
  Dermatology: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  "Emergency Medicine": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  "Orthopedic Surgery": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Pediatrics: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  Surgery: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  Psychiatry: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  Neurology: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  "Obstetrics & Gynecology": "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  Radiology: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  Anesthesiology: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
};

interface DoctorActionsProps {
  doctor: Doctor;
}

function DoctorActions({ doctor }: DoctorActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteDoctor = () => {
    if (
      confirm(
        `Are you sure you want to delete doctor ${doctor.name}? This action cannot be undone.`,
      )
    ) {
      startTransition(async () => {
        try {
          await deleteDoctor(doctor.id);
          router.refresh();
        } catch (error) {
          console.error("Error deleting doctor:", error);
          alert("Failed to delete doctor. Please try again.");
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
          <Link href={`/doctors/${doctor.id}`}>
            <User className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>

        <EditDoctorModal doctor={doctor}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Doctor
          </DropdownMenuItem>
        </EditDoctorModal>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={!doctor.contactInfo.phone}
          onClick={() => router.push(`tel:${doctor.contactInfo.phone}`)}
        >
          <Phone className="mr-2 h-4 w-4" />
          Call Doctor
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={!doctor.contactInfo.email}
          onClick={() => router.push(`mailto:${doctor.contactInfo.email}`)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email Doctor
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDeleteDoctor}
          className="text-red-600 focus:text-red-600"
          disabled={isPending}
        >
          <Edit className="mr-2 h-4 w-4" />
          {isPending ? "Deleting..." : "Delete Doctor"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DoctorsDataTableProps {
  data: Doctor[];
}

export function DoctorsDataTable({ data }: DoctorsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const columns: ColumnDef<Doctor>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Doctor Name
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
      accessorKey: "dateOfBirth",
      header: "Age",
      cell: ({ row }) => {
        const age = calculateAge(row.getValue("dateOfBirth"));
        return <div>{age} years</div>;
      },
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
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => {
        const specialization = row.getValue("specialization") as string;
        return (
          <Badge
            variant="secondary"
            className={cn(
              specializationColors[
                specialization as keyof typeof specializationColors
              ] || "bg-gray-500/10 text-gray-700 dark:text-gray-400",
            )}
          >
            {specialization}
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/doctors/${doctor.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">View doctor details</span>
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <DoctorActions doctor={doctor} />
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

  const uniqueSpecializations = Array.from(
    new Set(data.map((doctor) => doctor.specialization).filter(Boolean)),
  ).sort();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Filter doctors..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={
            (table.getColumn("specialization")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("specialization")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {uniqueSpecializations.map((specialization) => (
              <SelectItem key={specialization} value={specialization!}>
                {specialization}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn("gender")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("gender")
              ?.setFilterValue(value === "all" ? "" : value)
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
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} doctor(s) total.
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
