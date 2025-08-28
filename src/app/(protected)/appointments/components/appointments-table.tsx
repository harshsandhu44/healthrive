"use client";

import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createAppointmentsColumns } from "./appointments-columns";
import { AppointmentsTableToolbar } from "./appointments-table-toolbar";

interface AppointmentsTableProps {
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  canEdit?: boolean;
  canDelete?: boolean;
  canSearch?: boolean;
}

export function AppointmentsTable({ 
  data, 
  canEdit = true, 
  canDelete = true, 
  canSearch = true 
}: AppointmentsTableProps) {
  const columns = createAppointmentsColumns({ canEdit, canDelete });
  
  const ToolbarComponent = ({ table }: { table: Table<any> }) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
    <AppointmentsTableToolbar table={table} canDelete={canDelete} canSearch={canSearch} />
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={ToolbarComponent}
    />
  );
}