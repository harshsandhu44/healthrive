'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { AppointmentWithDetails } from './actions';

interface ViewAppointmentDialogProps {
  appointment: AppointmentWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: ViewAppointmentDialogProps) {
  const appointmentDate = new Date(appointment.datetime);

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            View complete information for appointment {appointment.id}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Appointment ID
              </p>
              <p className='text-sm font-mono'>{appointment.id}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Status
              </p>
              <Badge
                variant='secondary'
                className={
                  statusStyles[appointment.status] ||
                  'bg-gray-100 text-gray-800'
                }
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Patient Information
            </p>
            <div className='mt-1 p-3 bg-muted rounded-md'>
              <p className='font-medium'>{appointment.patient_name}</p>
              <p className='text-sm text-muted-foreground'>
                Patient ID: {appointment.patient_id}
              </p>
              {appointment.patient_phone && (
                <p className='text-sm text-muted-foreground'>
                  Phone: {appointment.patient_phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Doctor Information
            </p>
            <div className='mt-1 p-3 bg-muted rounded-md'>
              <p className='font-medium'>{appointment.doctor_name}</p>
              <p className='text-sm text-muted-foreground'>
                Doctor ID: {appointment.doctor_id}
              </p>
              {appointment.doctor_specialization && (
                <p className='text-sm text-muted-foreground'>
                  Specialization: {appointment.doctor_specialization}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Appointment Schedule
            </p>
            <div className='mt-1 p-3 bg-muted rounded-md'>
              <p className='font-medium'>
                {appointmentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className='text-sm text-muted-foreground'>
                {appointmentDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Created
              </p>
              <p className='text-sm'>
                {new Date(appointment.created_at).toLocaleDateString()} at{' '}
                {new Date(appointment.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Last Updated
              </p>
              <p className='text-sm'>
                {new Date(appointment.updated_at).toLocaleDateString()} at{' '}
                {new Date(appointment.updated_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
