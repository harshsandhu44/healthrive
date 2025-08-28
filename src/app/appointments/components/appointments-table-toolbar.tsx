"use client";

import { X } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";
import { BulkDeleteAppointmentsModal } from "./bulk-delete-appointments-modal";
interface AppointmentsTableToolbarProps {
  table: Table<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  canDelete?: boolean;
  canSearch?: boolean;
}

export function AppointmentsTableToolbar({ 
  table, 
  canDelete = true, 
  canSearch = true 
}: AppointmentsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedAppointments = selectedRows.map(row => row.original);

  const handleBulkDeleteSuccess = () => {
    // Reset row selection after successful deletion
    table.resetRowSelection();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {canSearch && (
          <>
            <Input
              placeholder="Search appointments (patient, type, reason)..."
              value={table.getState().globalFilter ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="h-8 w-[150px] lg:w-[350px]"
            />
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters();
                  table.setGlobalFilter("");
                }}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {canDelete && selectedRows.length > 0 && (
          <BulkDeleteAppointmentsModal 
            appointments={selectedAppointments}
            onSuccess={handleBulkDeleteSuccess}
          >
            <Button variant="outline" size="sm">
              Delete ({selectedRows.length})
            </Button>
          </BulkDeleteAppointmentsModal>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}