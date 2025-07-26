'use client';

import { BuildingIcon, CalendarIcon, UserIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Department } from './actions';

interface ViewDepartmentDialogProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDepartmentDialog({
  department,
  open,
  onOpenChange,
}: ViewDepartmentDialogProps) {
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
            <BuildingIcon className='h-5 w-5' />
            Department Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold mb-2'>{department.name}</h3>
              <p className='text-sm text-muted-foreground'>
                Department in your organization
              </p>
            </div>
          </div>

          {/* System Information */}
          <div className='border-t pt-4'>
            <h4 className='text-sm font-semibold mb-3 flex items-center gap-2'>
              <UserIcon className='h-4 w-4' />
              System Information
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Department ID:</span>
                <span className='font-mono text-xs'>{department.id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Organization:</span>
                <span className='font-mono text-xs'>{department.org_id}</span>
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
                <span className='text-muted-foreground'>Created:</span>
                <span>{formatDate(department.created_at)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Last Updated:</span>
                <span>{formatDate(department.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
