'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Department } from './actions';
import { deleteDepartment } from './actions';
import { EditDepartmentDialog } from './edit-department-dialog';
import { ViewDepartmentDialog } from './view-department-dialog';

function ActionsCell({ department }: { department: Department }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(department.id);
        toast.success('Department deleted successfully');
      } catch (error) {
        toast.error('Failed to delete department. Please try again.');
        console.error('Error deleting department:', error);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <EyeIcon className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon className='mr-2 h-4 w-4' />
            Edit Department
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className='text-destructive focus:text-destructive'
          >
            <TrashIcon className='mr-2 h-4 w-4' />
            Delete Department
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewDepartmentDialog
        department={department}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <EditDepartmentDialog
        department={department}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: 'name',
    header: 'Department Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className='font-medium'>{name}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell department={row.original} />,
  },
];
