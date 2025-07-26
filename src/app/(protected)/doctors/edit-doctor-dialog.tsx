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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Doctor } from './actions';
import { updateDoctor } from './actions';

const editDoctorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  specialization: z
    .string()
    .min(1, 'Specialization is required')
    .max(100, 'Specialization too long'),
  gender: z.enum(['male', 'female', 'rather not say'], {
    required_error: 'Gender is required',
  }),
  department_id: z.string().optional(),
});

type EditDoctorFormData = z.infer<typeof editDoctorSchema>;

interface EditDoctorDialogProps {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDoctorDialog({
  doctor,
  open,
  onOpenChange,
}: EditDoctorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditDoctorFormData>({
    resolver: zodResolver(editDoctorSchema),
    defaultValues: {
      name: doctor.name,
      specialization: doctor.specialization,
      gender: doctor.gender,
      department_id: doctor.department_id || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: doctor.name,
        specialization: doctor.specialization,
        gender: doctor.gender,
        department_id: doctor.department_id || '',
      });
    }
  }, [open, doctor, form]);

  const onSubmit = async (data: EditDoctorFormData) => {
    setIsSubmitting(true);
    try {
      await updateDoctor(doctor.id, data);
      toast.success('Doctor updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update doctor. Please try again.');
      console.error('Error updating doctor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>
            Update the doctor&apos;s information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Dr. John Smith'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='specialization'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Cardiology'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                      <SelectItem value='rather not say'>
                        Rather not say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='department_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='dept-001'
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
                {isSubmitting ? 'Updating...' : 'Update Doctor'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
