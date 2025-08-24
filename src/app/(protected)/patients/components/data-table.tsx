"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontalIcon, EyeIcon, EditIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/lib/schemas/patient";
import { DeletePatientDialog } from "./delete-patient-dialog";

interface DataTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function DataTable({ patients, onEdit, onDelete }: DataTableProps) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateId = (id: string) => {
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No patients found.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-mono text-xs">
                {truncateId(patient.id)}
              </TableCell>
              <TableCell className="font-medium">
                {patient.first_name} {patient.last_name}
              </TableCell>
              <TableCell>{formatDate(patient.date_of_birth)}</TableCell>
              <TableCell>{patient.phone_number}</TableCell>
              <TableCell>
                {patient.blood_type ? (
                  <Badge variant="secondary">{patient.blood_type}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {patient.city && patient.state ? (
                  `${patient.city}, ${patient.state}`
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(patient)}>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeletePatientDialog
                      patient={patient}
                      onConfirm={onDelete}
                    >
                      <DropdownMenuItem className="text-destructive">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DeletePatientDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}