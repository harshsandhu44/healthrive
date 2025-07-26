'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { AppointmentWithDetails } from './actions';
import { deleteAppointment } from './actions';
import { EditAppointmentDialog } from './edit-appointment-dialog';
import { ViewAppointmentDialog } from './view-appointment-dialog';

function ActionsCell({ appointment }: { appointment: AppointmentWithDetails }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(appointment.id);
        toast.success('Appointment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete appointment. Please try again.');
        console.error('Error deleting appointment:', error);
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
            Edit Appointment
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className='text-destructive focus:text-destructive'
          >
            <TrashIcon className='mr-2 h-4 w-4' />
            Delete Appointment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewAppointmentDialog
        appointment={appointment}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <EditAppointmentDialog
        appointment={appointment}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <Badge
      variant='secondary'
      className={
        statusStyles[status as keyof typeof statusStyles] ||
        'bg-gray-100 text-gray-800'
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export const columns: ColumnDef<AppointmentWithDetails>[] = [
  {
    accessorKey: 'id',
    header: 'Appointment ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return <div className='font-mono text-xs'>{id}</div>;
    },
  },
  {
    accessorKey: 'patient_name',
    header: 'Patient',
    cell: ({ row }) => {
      const name = row.getValue('patient_name') as string;
      const phone = row.original.patient_phone;
      return (
        <div>
          <div className='font-medium'>{name}</div>
          {phone && (
            <div className='text-xs text-muted-foreground'>{phone}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'doctor_name',
    header: 'Doctor',
    cell: ({ row }) => {
      const name = row.getValue('doctor_name') as string;
      const specialization = row.original.doctor_specialization;
      return (
        <div>
          <div className='font-medium'>{name}</div>
          {specialization && (
            <div className='text-xs text-muted-foreground'>
              {specialization}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'datetime',
    header: 'Date & Time',
    cell: ({ row }) => {
      const datetime = new Date(row.getValue('datetime'));
      return (
        <div>
          <div className='font-medium'>{datetime.toLocaleDateString()}</div>
          <div className='text-xs text-muted-foreground'>
            {datetime.toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <StatusBadge status={status} />;
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
    cell: ({ row }) => <ActionsCell appointment={row.original} />,
  },
];
