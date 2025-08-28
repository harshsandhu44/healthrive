"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { Patient } from "@/lib/schemas/patient";
import { patientsColumns } from "./patients-columns";
import { PatientsTableToolbar } from "./patients-table-toolbar";

interface PatientsTableProps {
  data: Patient[];
}

export function PatientsTable({ data }: PatientsTableProps) {
  return (
    <DataTable
      columns={patientsColumns}
      data={data}
      toolbar={PatientsTableToolbar}
    />
  );
}