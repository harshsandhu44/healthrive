'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Patient } from './actions';

interface ViewPatientDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewPatientDialog({
  patient,
  open,
  onOpenChange,
}: ViewPatientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            View complete information for {patient.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Patient ID
              </p>
              <p className='text-sm font-mono'>{patient.id}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Full Name
              </p>
              <p className='text-sm'>{patient.full_name}</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p className='text-sm'>{patient.email || 'Not provided'}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Phone Number
              </p>
              <p className='text-sm'>
                {patient.phone_number || 'Not provided'}
              </p>
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Medical Records
            </p>
            {patient.medical_records ? (
              <pre className='mt-1 text-xs bg-muted p-3 rounded-md overflow-auto max-h-32'>
                {JSON.stringify(patient.medical_records, null, 2)}
              </pre>
            ) : (
              <p className='text-sm text-muted-foreground'>
                No medical records available
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Created
              </p>
              <p className='text-sm'>
                {new Date(patient.created_at).toLocaleDateString()} at{' '}
                {new Date(patient.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Last Updated
              </p>
              <p className='text-sm'>
                {new Date(patient.updated_at).toLocaleDateString()} at{' '}
                {new Date(patient.updated_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
