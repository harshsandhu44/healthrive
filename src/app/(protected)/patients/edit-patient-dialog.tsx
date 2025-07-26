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
import { Textarea } from '@/components/ui/textarea';

import type { Patient } from './actions';
import { updatePatient } from './actions';

const editPatientSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Name too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
  medical_records: z.string().optional().or(z.literal('')),
});

type EditPatientFormData = z.infer<typeof editPatientSchema>;

interface EditPatientDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
}: EditPatientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditPatientFormData>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      full_name: patient.full_name,
      email: patient.email || '',
      phone_number: patient.phone_number || '',
      medical_records: patient.medical_records
        ? JSON.stringify(patient.medical_records, null, 2)
        : '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        full_name: patient.full_name,
        email: patient.email || '',
        phone_number: patient.phone_number || '',
        medical_records: patient.medical_records
          ? JSON.stringify(patient.medical_records, null, 2)
          : '',
      });
    }
  }, [open, patient, form]);

  const onSubmit = async (data: EditPatientFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        full_name: data.full_name,
        email: data.email || undefined,
        phone_number: data.phone_number || undefined,
        medical_records: data.medical_records
          ? (() => {
              try {
                return JSON.parse(data.medical_records);
              } catch {
                return { notes: data.medical_records };
              }
            })()
          : undefined,
      };

      await updatePatient(patient.id, payload);
      toast.success('Patient updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update patient. Please try again.');
      console.error('Error updating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Update the patient&apos;s information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='full_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='John Doe'
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='john.doe@example.com'
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
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='+1 (555) 123-4567'
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
              name='medical_records'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Records (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='JSON format or plain text notes about medical history, allergies, etc.'
                      rows={3}
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
                {isSubmitting ? 'Updating...' : 'Update Patient'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
