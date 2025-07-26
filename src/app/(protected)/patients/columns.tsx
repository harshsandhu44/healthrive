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

import type { Patient } from './actions';
import { deletePatient } from './actions';
import { EditPatientDialog } from './edit-patient-dialog';
import { ViewPatientDialog } from './view-patient-dialog';

function ActionsCell({ patient }: { patient: Patient }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (
      confirm(
        'Are you sure you want to delete this patient? This action cannot be undone and will affect all organizations.'
      )
    ) {
      try {
        await deletePatient(patient.id);
        toast.success('Patient deleted successfully');
      } catch (error) {
        toast.error('Failed to delete patient. Please try again.');
        console.error('Error deleting patient:', error);
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
            Edit Patient
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className='text-destructive focus:text-destructive'
          >
            <TrashIcon className='mr-2 h-4 w-4' />
            Delete Patient
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewPatientDialog
        patient={patient}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <EditPatientDialog
        patient={patient}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'id',
    header: 'Patient ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return <div className='font-mono text-xs'>{id}</div>;
    },
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    cell: ({ row }) => {
      const name = row.getValue('full_name') as string;
      return <div className='font-medium'>{name}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string | null;
      return (
        <div className='text-muted-foreground'>{email || 'Not provided'}</div>
      );
    },
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.getValue('phone_number') as string | null;
      return (
        <div className='text-muted-foreground'>{phone || 'Not provided'}</div>
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
    cell: ({ row }) => <ActionsCell patient={row.original} />,
  },
];
