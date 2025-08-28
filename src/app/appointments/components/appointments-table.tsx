"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { appointmentsColumns } from "./appointments-columns";
import { AppointmentsTableToolbar } from "./appointments-table-toolbar";

interface AppointmentsTableProps {
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function AppointmentsTable({ data }: AppointmentsTableProps) {
  return (
    <DataTable
      columns={appointmentsColumns}
      data={data}
      toolbar={AppointmentsTableToolbar}
    />
  );
}