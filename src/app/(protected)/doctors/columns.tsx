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

import type { Doctor } from './actions';
import { deleteDoctor } from './actions';
import { EditDoctorDialog } from './edit-doctor-dialog';
import { ViewDoctorDialog } from './view-doctor-dialog';

function ActionsCell({ doctor }: { doctor: Doctor }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(doctor.id);
        toast.success('Doctor deleted successfully');
      } catch (error) {
        toast.error('Failed to delete doctor. Please try again.');
        console.error('Error deleting doctor:', error);
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
            Edit Doctor
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className='text-destructive focus:text-destructive'
          >
            <TrashIcon className='mr-2 h-4 w-4' />
            Delete Doctor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewDoctorDialog
        doctor={doctor}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <EditDoctorDialog
        doctor={doctor}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

export const columns: ColumnDef<Doctor>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className='font-medium'>{name}</div>;
    },
  },
  {
    accessorKey: 'specialization',
    header: 'Specialization',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string;
      return (
        <div className='capitalize'>
          {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </div>
      );
    },
  },
  {
    accessorKey: 'department_name',
    header: 'Department',
    cell: ({ row }) => {
      const departmentName = row.getValue('department_name') as string | null;
      return (
        <div className='text-muted-foreground'>
          {departmentName || 'No department'}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Added',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell doctor={row.original} />,
  },
];
