'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
  DialogTrigger,
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

import { addDepartment } from './actions';

const addDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Department name is required')
    .max(100, 'Department name too long'),
});

type AddDepartmentFormData = z.infer<typeof addDepartmentSchema>;

interface AddDepartmentDialogProps {
  children: React.ReactNode;
}

export function AddDepartmentDialog({ children }: AddDepartmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddDepartmentFormData>({
    resolver: zodResolver(addDepartmentSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: AddDepartmentFormData) => {
    setIsSubmitting(true);
    try {
      await addDepartment(data);
      toast.success('Department added successfully');
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to add department. Please try again.');
      console.error('Error adding department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Add a new department to your organization. Enter the department name
            below.
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
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Department'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
