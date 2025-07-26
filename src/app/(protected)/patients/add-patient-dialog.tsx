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
import { PatientValidation } from '@/lib/types/patient';

import { addPatient } from './actions';

// Enhanced healthcare-specific validation schema
const addPatientSchema = z.object({
  full_name: z
    .string()
    .min(
      PatientValidation.fullName.minLength,
      'Full name must be at least 2 characters'
    )
    .max(PatientValidation.fullName.maxLength, 'Name too long')
    .regex(
      PatientValidation.fullName.pattern,
      'Name contains invalid characters'
    )
    .transform(val => val.trim()),

  email: z
    .union([
      z
        .string()
        .email('Invalid email format')
        .regex(
          PatientValidation.email.pattern,
          'Please enter a valid email address'
        )
        .max(254, 'Email too long')
        .transform(val => val.toLowerCase().trim()),
      z.literal(''),
    ])
    .optional(),

  phone_number: z
    .union([
      z
        .string()
        .regex(
          PatientValidation.phoneNumber.pattern,
          'Invalid phone number format'
        )
        .min(10, 'Phone number too short')
        .max(15, 'Phone number too long')
        .transform(val => val.replace(/\s+/g, ' ').trim()),
      z.literal(''),
    ])
    .optional(),

  medical_records: z
    .string()
    .max(
      PatientValidation.medicalRecords.maxNotesLength,
      'Medical records too long'
    )
    .refine(data => {
      if (!data) return true;
      // Check if it's valid JSON
      try {
        const parsed = JSON.parse(data);
        // Validate JSON structure if needed
        return typeof parsed === 'object';
      } catch {
        // Allow plain text up to reasonable length
        return data.length <= 1000;
      }
    }, 'Invalid medical records format. Use valid JSON or plain text under 1000 characters')
    .optional()
    .or(z.literal('')),
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
            role='form'
            aria-labelledby='patient-form-title'
          >
            <h3 id='patient-form-title' className='sr-only'>
              Patient Information Form
            </h3>
            <FormField
              control={form.control}
              name='full_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='full_name'>
                    Full Name{' '}
                    <span aria-label='required' className='text-red-500'>
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='full_name'
                      placeholder='John Doe'
                      disabled={isSubmitting}
                      aria-required='true'
                      aria-invalid={!!form.formState.errors.full_name}
                      aria-describedby={
                        form.formState.errors.full_name
                          ? 'full_name-error'
                          : undefined
                      }
                      autoComplete='name'
                    />
                  </FormControl>
                  <FormMessage id='full_name-error' role='alert' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='email'>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      placeholder='john.doe@example.com'
                      disabled={isSubmitting}
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby={
                        form.formState.errors.email ? 'email-error' : undefined
                      }
                      autoComplete='email'
                    />
                  </FormControl>
                  <FormMessage id='email-error' role='alert' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='phone_number'>
                    Phone Number (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='phone_number'
                      type='tel'
                      placeholder='+1 (555) 123-4567'
                      disabled={isSubmitting}
                      aria-invalid={!!form.formState.errors.phone_number}
                      aria-describedby={
                        form.formState.errors.phone_number
                          ? 'phone_number-error'
                          : undefined
                      }
                      autoComplete='tel'
                    />
                  </FormControl>
                  <FormMessage id='phone_number-error' role='alert' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='medical_records'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='medical_records'>
                    Medical Records (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id='medical_records'
                      placeholder='JSON format or plain text notes about medical history, allergies, etc.'
                      rows={3}
                      disabled={isSubmitting}
                      aria-invalid={!!form.formState.errors.medical_records}
                      aria-describedby={
                        form.formState.errors.medical_records
                          ? 'medical_records-error'
                          : 'medical_records-help'
                      }
                    />
                  </FormControl>
                  <div
                    id='medical_records-help'
                    className='text-sm text-muted-foreground'
                  >
                    Enter medical information in JSON format or as plain text
                    notes
                  </div>
                  <FormMessage id='medical_records-error' role='alert' />
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
