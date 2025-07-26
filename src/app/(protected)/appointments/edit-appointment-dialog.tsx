'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { searchPatients, type Patient } from '../patients/actions';

import type { AppointmentWithDetails } from './actions';
import { updateAppointment, getDoctorsForAppointment } from './actions';

const editAppointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, 'Time is required'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

type EditAppointmentFormData = z.infer<typeof editAppointmentSchema>;

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface EditAppointmentDialogProps {
  appointment: AppointmentWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: EditAppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientOpen, setPatientOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);

  const appointmentDate = new Date(appointment.datetime);
  const hours = appointmentDate.getHours().toString().padStart(2, '0');
  const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');

  const form = useForm<EditAppointmentFormData>({
    resolver: zodResolver(editAppointmentSchema),
    defaultValues: {
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      date: appointmentDate,
      time: `${hours}:${minutes}`,
      status: appointment.status,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        date: appointmentDate,
        time: `${hours}:${minutes}`,
        status: appointment.status,
      });

      getDoctorsForAppointment()
        .then(setDoctors)
        .catch(error => {
          console.error('Error fetching doctors:', error);
          toast.error('Failed to load doctors');
        });

      setSearchQuery(appointment.patient_name);
      searchPatients(appointment.patient_name)
        .then(setPatients)
        .catch(error => {
          console.error('Error searching patients:', error);
        });
    }
  }, [open, appointment, form, appointmentDate, hours, minutes]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchPatients(searchQuery)
        .then(setPatients)
        .catch(error => {
          console.error('Error searching patients:', error);
          toast.error('Failed to search patients');
        });
    } else {
      setPatients([]);
    }
  }, [searchQuery]);

  const onSubmit = async (data: EditAppointmentFormData) => {
    setIsSubmitting(true);
    try {
      const datetime = new Date(data.date);
      const [hours, minutes] = data.time.split(':');
      datetime.setHours(parseInt(hours), parseInt(minutes));

      await updateAppointment(appointment.id, {
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        datetime: datetime.toISOString(),
        status: data.status,
      });

      toast.success('Appointment updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update appointment. Please try again.');
      console.error('Error updating appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>
            Update the appointment information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='patient_id'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Patient</FormLabel>
                  <Popover open={patientOpen} onOpenChange={setPatientOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={patientOpen}
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value
                            ? patients.find(
                                patient => patient.id === field.value
                              )?.full_name || appointment.patient_name
                            : 'Search patients by name, phone, or ID...'}
                          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Command>
                        <CommandInput
                          placeholder='Search patients...'
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {searchQuery.length >= 2
                              ? 'No patients found.'
                              : 'Type to search patients...'}
                          </CommandEmpty>
                          <CommandGroup>
                            {patients.map(patient => (
                              <CommandItem
                                key={patient.id}
                                value={patient.id}
                                onSelect={() => {
                                  form.setValue('patient_id', patient.id);
                                  setPatientOpen(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === patient.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                <div>
                                  <div className='font-medium'>
                                    {patient.full_name}
                                  </div>
                                  <div className='text-xs text-muted-foreground'>
                                    {patient.id}{' '}
                                    {patient.phone_number &&
                                      `• ${patient.phone_number}`}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='doctor_id'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Doctor</FormLabel>
                  <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={doctorOpen}
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value
                            ? doctors.find(doctor => doctor.id === field.value)
                                ?.name || appointment.doctor_name
                            : 'Select doctor...'}
                          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Command>
                        <CommandInput placeholder='Search doctors...' />
                        <CommandList>
                          <CommandEmpty>No doctors found.</CommandEmpty>
                          <CommandGroup>
                            {doctors.map(doctor => (
                              <CommandItem
                                key={doctor.id}
                                value={doctor.name}
                                onSelect={() => {
                                  form.setValue('doctor_id', doctor.id);
                                  setDoctorOpen(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === doctor.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                <div>
                                  <div className='font-medium'>
                                    {doctor.name}
                                  </div>
                                  <div className='text-xs text-muted-foreground'>
                                    {doctor.specialization}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isSubmitting}
                          >
                            {field.value ? (
                              field.value.toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        {...field}
                        disabled={isSubmitting || !form.watch('date')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='confirmed'>Confirmed</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                      <SelectItem value='completed'>Completed</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isSubmitting ? 'Updating...' : 'Update Appointment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
