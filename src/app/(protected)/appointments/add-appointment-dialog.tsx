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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { searchPatients, addPatient, type Patient } from '../patients/actions';

import { addAppointment, getDoctorsForAppointment } from './actions';

const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, 'Time is required'),
  status: z
    .enum(['pending', 'confirmed', 'cancelled', 'completed'])
    .default('pending'),
});

const newPatientSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
  medical_records: z.string().optional().or(z.literal('')),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;
type NewPatientFormData = z.infer<typeof newPatientSchema>;

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface AddAppointmentDialogProps {
  children: React.ReactNode;
}

export function AddAppointmentDialog({ children }: AddAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');

  // Data states
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // UI states
  const [patientOpen, setPatientOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);

  const appointmentForm = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: '',
      doctor_id: '',
      time: '',
      status: 'pending',
    },
  });

  const newPatientForm = useForm<NewPatientFormData>({
    resolver: zodResolver(newPatientSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      medical_records: '',
    },
  });

  useEffect(() => {
    if (open) {
      getDoctorsForAppointment()
        .then(setDoctors)
        .catch(error => {
          console.error('Error fetching doctors:', error);
          toast.error('Failed to load doctors');
        });
    }
  }, [open]);

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

  const handleCreatePatientAndAppointment = async () => {
    setIsSubmitting(true);
    try {
      const newPatientData = newPatientForm.getValues();
      const appointmentData = appointmentForm.getValues();

      if (
        !appointmentData.date ||
        !appointmentData.time ||
        !appointmentData.doctor_id
      ) {
        toast.error('Please fill in all appointment details');
        setIsSubmitting(false);
        return;
      }

      const patientPayload = {
        full_name: newPatientData.full_name,
        email: newPatientData.email || undefined,
        phone_number: newPatientData.phone_number || undefined,
        medical_records: newPatientData.medical_records
          ? (() => {
              try {
                return JSON.parse(newPatientData.medical_records);
              } catch {
                return { notes: newPatientData.medical_records };
              }
            })()
          : undefined,
      };

      const patientResult = await addPatient(patientPayload);

      if (!patientResult.success) {
        throw new Error('Failed to create patient');
      }

      const patients = await searchPatients(newPatientData.full_name);
      const newPatient = patients.find(
        p => p.full_name === newPatientData.full_name
      );

      if (!newPatient) {
        throw new Error('Could not find newly created patient');
      }

      const datetime = new Date(appointmentData.date);
      const [hours, minutes] = appointmentData.time.split(':');
      datetime.setHours(parseInt(hours), parseInt(minutes));

      await addAppointment({
        patient_id: newPatient.id,
        doctor_id: appointmentData.doctor_id,
        datetime: datetime.toISOString(),
        status: appointmentData.status,
      });

      toast.success('Patient and appointment created successfully');
      appointmentForm.reset();
      newPatientForm.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        'Failed to create patient and appointment. Please try again.'
      );
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAppointment = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      const datetime = new Date(data.date);
      const [hours, minutes] = data.time.split(':');
      datetime.setHours(parseInt(hours), parseInt(minutes));

      await addAppointment({
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        datetime: datetime.toISOString(),
        status: data.status,
      });

      toast.success('Appointment created successfully');
      appointmentForm.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create appointment. Please try again.');
      console.error('Error creating appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    if (activeTab === 'new') {
      await handleCreatePatientAndAppointment();
    } else {
      await handleCreateAppointment(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment for an existing or new patient.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='existing'>Existing Patient</TabsTrigger>
            <TabsTrigger value='new'>New Patient</TabsTrigger>
          </TabsList>

          <TabsContent value='existing'>
            <Form {...appointmentForm}>
              <form
                onSubmit={appointmentForm.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={appointmentForm.control}
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
                                  )?.full_name
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
                                      appointmentForm.setValue(
                                        'patient_id',
                                        patient.id
                                      );
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
                  control={appointmentForm.control}
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
                                ? doctors.find(
                                    doctor => doctor.id === field.value
                                  )?.name
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
                                      appointmentForm.setValue(
                                        'doctor_id',
                                        doctor.id
                                      );
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
                    control={appointmentForm.control}
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
                    control={appointmentForm.control}
                    name='time'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input
                            type='time'
                            {...field}
                            disabled={
                              isSubmitting || !appointmentForm.watch('date')
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={appointmentForm.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Appointment'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value='new'>
            <div className='space-y-6'>
              <div className='bg-muted/50 p-4 rounded-lg'>
                <h4 className='font-medium mb-4'>New Patient Information</h4>
                <Form {...newPatientForm}>
                  <div className='space-y-4'>
                    <FormField
                      control={newPatientForm.control}
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

                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={newPatientForm.control}
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
                        control={newPatientForm.control}
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
                    </div>

                    <FormField
                      control={newPatientForm.control}
                      name='medical_records'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Records (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Medical history, allergies, etc.'
                              rows={2}
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </div>

              <div>
                <h4 className='font-medium mb-4'>Appointment Details</h4>
                <Form {...appointmentForm}>
                  <div className='space-y-4'>
                    <FormField
                      control={appointmentForm.control}
                      name='doctor_id'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Doctor</FormLabel>
                          <Popover
                            open={doctorOpen}
                            onOpenChange={setDoctorOpen}
                          >
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
                                    ? doctors.find(
                                        doctor => doctor.id === field.value
                                      )?.name
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
                                          appointmentForm.setValue(
                                            'doctor_id',
                                            doctor.id
                                          );
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
                        control={appointmentForm.control}
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
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date =>
                                    date <
                                    new Date(new Date().setHours(0, 0, 0, 0))
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
                        control={appointmentForm.control}
                        name='time'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input
                                type='time'
                                {...field}
                                disabled={
                                  isSubmitting || !appointmentForm.watch('date')
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={appointmentForm.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select status' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='pending'>Pending</SelectItem>
                              <SelectItem value='confirmed'>
                                Confirmed
                              </SelectItem>
                              <SelectItem value='cancelled'>
                                Cancelled
                              </SelectItem>
                              <SelectItem value='completed'>
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>

                <div className='flex justify-end space-x-2 pt-6'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => onSubmit(appointmentForm.getValues())}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Creating...'
                      : 'Create Patient & Appointment'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
