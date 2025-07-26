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
import { Textarea } from '@/components/ui/textarea';

import { addPatient } from './actions';

const addPatientSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Name too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
  medical_records: z.string().optional().or(z.literal('')),
});

type AddPatientFormData = z.infer<typeof addPatientSchema>;

interface AddPatientDialogProps {
  children: React.ReactNode;
}

export function AddPatientDialog({ children }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddPatientFormData>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      medical_records: '',
    },
  });

  const onSubmit = async (data: AddPatientFormData) => {
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

      await addPatient(payload);
      toast.success('Patient added successfully');
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to add patient. Please try again.');
      console.error('Error adding patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Add a new patient record. The patient will be visible to your
            organization when they book an appointment.
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
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Patient'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
