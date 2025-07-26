'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { Department } from './actions';
import { updateDepartment } from './actions';

const editDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Department name is required')
    .max(100, 'Department name too long'),
});

type EditDepartmentFormData = z.infer<typeof editDepartmentSchema>;

interface EditDepartmentDialogProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
}: EditDepartmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditDepartmentFormData>({
    resolver: zodResolver(editDepartmentSchema),
    defaultValues: {
      name: department.name,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: department.name,
      });
    }
  }, [open, department, form]);

  const onSubmit = async (data: EditDepartmentFormData) => {
    setIsSubmitting(true);
    try {
      await updateDepartment(department.id, data);
      toast.success('Department updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update department. Please try again.');
      console.error('Error updating department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the department&apos;s information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Cardiology, Emergency Medicine'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Department'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
