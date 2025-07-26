'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Row,
  type HeaderGroup,
  type Header,
  type Cell,
} from '@tanstack/react-table';
import { memo, useMemo } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
}

// Memoized row component for better performance with large datasets
const TableRowMemo = memo(function TableRowMemo<TData>({
  row,
}: {
  row: Row<TData>;
}) {
  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      className='hover:bg-muted/50 transition-colors'
    >
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id} className='px-4 py-3'>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
});

// Memoized header component
const TableHeaderMemo = memo(function TableHeaderMemo<TData>({
  headerGroups,
}: {
  headerGroups: HeaderGroup<TData>[];
}) {
  return (
    <TableHeader>
      {headerGroups.map(headerGroup => (
        <TableRow key={headerGroup.id} className='hover:bg-transparent'>
          {headerGroup.headers.map((header: Header<TData, unknown>) => (
            <TableHead key={header.id} className='px-4 py-3 font-medium'>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
});

export const DataTable = memo(function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
}: DataTableProps<TData, TValue>) {
  // Memoize columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, [columns]);

  // Memoize table configuration
  const table = useReactTable({
    data,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: false, // Disable if not needed for performance
    enableColumnResizing: false, // Disable if not needed
    debugTable: false, // Disable debug in production
    debugHeaders: false,
    debugColumns: false,
  });

  // Memoize rows for better performance
  const rows = useMemo(() => table.getRowModel().rows, [table]);
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);

  // Show loading state
  if (loading) {
    return (
      <div className='rounded-md border'>
        <Table>
          <TableHeaderMemo headerGroups={headerGroups} />
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                {columns.map((_, colIndex) => (
                  <TableCell
                    key={`loading-cell-${colIndex}`}
                    className='px-4 py-3'
                  >
                    <div className='h-4 bg-muted animate-pulse rounded' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeaderMemo headerGroups={headerGroups} />
        <TableBody>
          {rows?.length ? (
            rows.map(row => <TableRowMemo key={row.id} row={row} />)
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center text-muted-foreground'
              >
                No patients found. Try adjusting your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
