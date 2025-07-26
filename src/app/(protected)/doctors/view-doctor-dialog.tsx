'use client';

import { CalendarIcon, StethoscopeIcon, UserIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Doctor } from './actions';

interface ViewDoctorDialogProps {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDoctorDialog({
  doctor,
  open,
  onOpenChange,
}: ViewDoctorDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <StethoscopeIcon className='h-5 w-5' />
            Doctor Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold mb-2'>{doctor.name}</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Specialization
                  </p>
                  <p className='text-sm'>{doctor.specialization}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Gender
                  </p>
                  <Badge variant='secondary' className='capitalize'>
                    {doctor.gender}
                  </Badge>
                </div>
              </div>
            </div>

            {doctor.department_id && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Department
                </p>
                <p className='text-sm'>{doctor.department_id}</p>
              </div>
            )}
          </div>

          {/* System Information */}
          <div className='border-t pt-4'>
            <h4 className='text-sm font-semibold mb-3 flex items-center gap-2'>
              <UserIcon className='h-4 w-4' />
              System Information
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Doctor ID:</span>
                <span className='font-mono text-xs'>{doctor.id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Organization:</span>
                <span className='font-mono text-xs'>{doctor.org_id}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className='border-t pt-4'>
            <h4 className='text-sm font-semibold mb-3 flex items-center gap-2'>
              <CalendarIcon className='h-4 w-4' />
              Timeline
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Added:</span>
                <span>{formatDate(doctor.created_at)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Last Updated:</span>
                <span>{formatDate(doctor.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
