"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  User,
  Stethoscope,
  Check,
  ChevronsUpDown,
  ChevronDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createAppointment,
  getAppointments,
} from "@/app/(protected)/appointments/actions";
import { getDoctors } from "@/app/(protected)/doctors/actions";
import { getPatients, createPatient } from "@/app/(protected)/patients/actions";
import { APPOINTMENT_TYPES, APPOINTMENT_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import {
  type Doctor,
  type Patient,
  type Appointment,
} from "@/lib/types/entities";

// Date and Time Picker Component (based on your example)
interface DateTimePickerProps {
  dateValue?: Date;
  timeValue?: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
}

function DateTimePicker({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
              disabled={disabled}
            >
              {dateValue ? dateValue.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              captionLayout="dropdown"
              onSelect={(date) => {
                onDateChange(date);
                setOpen(false);
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                // Disable past dates and Sundays (day 0)
                return date < today || date.getDay() === 0;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          value={timeValue || ""}
          onChange={(e) => {
            const time = e.target.value;
            // Basic business hours validation (6 AM to 10 PM)
            const [hours] = time.split(":").map(Number);
            if (hours < 6 || hours >= 22) {
              // Still allow the change but we'll validate in form
              onTimeChange(time);
            } else {
              onTimeChange(time);
            }
          }}
          disabled={disabled}
          min="06:00"
          max="21:45"
          step="900" // 15 minute intervals
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}

const appointmentFormSchema = z
  .object({
    patientName: z
      .string()
      .min(2, "Patient name must be at least 2 characters."),
    patientId: z.string().optional(),
    // New patient fields
    patientType: z.enum(["existing", "new"]),
    newPatientDateOfBirth: z.string().optional(),
    newPatientGender: z.enum(["male", "female"]).optional(),
    date: z.date({ message: "Appointment date is required." }),
    time: z
      .string()
      .min(1, "Appointment time is required.")
      .refine(
        (time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const timeInMinutes = hours * 60 + minutes;
          const startTime = 6 * 60; // 6:00 AM
          const endTime = 22 * 60; // 10:00 PM
          return timeInMinutes >= startTime && timeInMinutes < endTime;
        },
        {
          message: "Appointment time must be between 6:00 AM and 10:00 PM",
        },
      ),
    type: z.enum(["consultation", "follow-up", "surgery", "emergency"]),
    status: z.enum(["scheduled", "in-progress", "completed", "cancelled"]),
    doctor: z.string().min(1, "Doctor selection is required."),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // If creating new patient, require additional fields
      if (data.patientType === "new") {
        return data.newPatientDateOfBirth && data.newPatientGender;
      }
      return true;
    },
    {
      message: "Date of birth and gender are required for new patients",
      path: ["newPatientDateOfBirth"],
    },
  );

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface CreateAppointmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAppointmentForm({
  onSuccess,
  onCancel,
}: CreateAppointmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientOpen, setPatientOpen] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState<
    Appointment[]
  >([]);

  // Set default date and time to current date/time
  const now = new Date();
  const roundedTime = new Date(now);
  roundedTime.setMinutes(Math.ceil(roundedTime.getMinutes() / 15) * 15);

  const defaultTime = roundedTime.toTimeString().slice(0, 5); // HH:MM format

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: now,
      time: defaultTime,
      patientName: "",
      patientType: "existing",
      newPatientDateOfBirth: "",
      newPatientGender: "male",
      notes: "",
      type: "consultation",
      status: "scheduled",
    },
  });

  // Load doctors and patients on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsList, patientsList, appointmentsList] = await Promise.all(
          [getDoctors(), getPatients(), getAppointments()],
        );
        setDoctors(doctorsList);
        setPatients(patientsList);
        setExistingAppointments(appointmentsList);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load doctors and patients list");
      } finally {
        setDoctorsLoading(false);
        setPatientsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    form.setValue("patientName", patient.name);
    form.setValue("patientId", patient.id);
    setPatientOpen(false);
  };

  const checkAppointmentConflict = (
    appointmentDateTime: Date,
    doctor: string,
  ) => {
    const appointmentTime = appointmentDateTime.getTime();
    const conflictWindow = 30 * 60 * 1000; // 30 minutes in milliseconds

    return existingAppointments.some((appointment) => {
      if (appointment.doctor !== doctor) return false;
      if (!appointment.time) return false;

      const existingTime = new Date(appointment.time).getTime();
      const timeDiff = Math.abs(appointmentTime - existingTime);

      return timeDiff < conflictWindow;
    });
  };

  const onSubmit = (values: AppointmentFormValues) => {
    startTransition(async () => {
      try {
        // Combine date and time for the appointment
        const appointmentDateTime = new Date(values.date);
        const [hours, minutes] = values.time.split(":");
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

        // Check for appointment conflicts
        if (checkAppointmentConflict(appointmentDateTime, values.doctor)) {
          toast.error("Appointment Conflict", {
            description: `Dr. ${values.doctor} already has an appointment within 30 minutes of this time. Please choose a different time slot.`,
          });
          return;
        }

        let patientId = values.patientId || null;

        // Create new patient if needed
        if (values.patientType === "new") {
          const newPatientData = {
            name: values.patientName,
            dateOfBirth: values.newPatientDateOfBirth!,
            age:
              new Date().getFullYear() -
              new Date(values.newPatientDateOfBirth!).getFullYear(),
            gender: values.newPatientGender!,
            contactInfo: {
              address: "",
              phone: "",
              email: "",
            },
            emergencyContact: {
              name: "",
              phone: "",
              relationship: "",
            },
            insurance: {
              provider: "",
              policyNumber: "",
            },
            socialHistory: {
              smokingStatus: "never",
              alcoholConsumption: "none",
            },
            allergies: [],
            familyHistory: [],
            diagnoses: [],
            medications: [],
            procedures: [],
            labResults: [],
            vitalSigns: [],
            clinicalNotes: [],
            status: "active",
            registrationDate: new Date().toISOString(),
          };

          const createdPatient = await createPatient(newPatientData);
          patientId = createdPatient.id;

          toast.success("New patient created!", {
            description: `${values.patientName} has been added to the system.`,
          });
        }

        const appointmentData = {
          patientName: values.patientName,
          patientId: patientId,
          time: appointmentDateTime.toISOString(),
          type: values.type,
          status: values.status,
          doctor: values.doctor,
          notes: values.notes || null,
        };

        await createAppointment(appointmentData);

        toast.success("Appointment created successfully!");

        // Reset with default values
        const now = new Date();
        const roundedTime = new Date(now);
        roundedTime.setMinutes(Math.ceil(roundedTime.getMinutes() / 15) * 15);
        const defaultTime = roundedTime.toTimeString().slice(0, 5);

        form.reset({
          date: now,
          time: defaultTime,
          type: "consultation",
          status: "scheduled",
        });
        onSuccess?.();
      } catch (error) {
        console.error("Failed to create appointment:", error);

        // Enhanced error handling with specific messages
        let errorMessage = "Failed to create appointment";
        let errorDescription =
          "Please try again or contact support if the problem persists.";

        if (error instanceof Error) {
          if (error.message.includes("organization_id")) {
            errorMessage = "Authentication Error";
            errorDescription =
              "Please sign in again and try to create the appointment.";
          } else if (error.message.includes("patient_id")) {
            errorMessage = "Invalid Patient";
            errorDescription =
              "The selected patient ID is invalid. Please select a different patient.";
          } else if (error.message.includes("doctor")) {
            errorMessage = "Doctor Unavailable";
            errorDescription =
              "The selected doctor may not be available. Please choose a different doctor.";
          } else if (error.message.includes("time")) {
            errorMessage = "Invalid Time Slot";
            errorDescription =
              "The selected time slot may not be available. Please choose a different time.";
          } else if (
            error.message.includes("duplicate") ||
            error.message.includes("unique")
          ) {
            errorMessage = "Duplicate Appointment";
            errorDescription =
              "An appointment with similar details already exists. Please check and modify your appointment.";
          }
        }

        toast.error(errorMessage, {
          description: errorDescription,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </div>
            <CardDescription>
              Select an existing patient or create a new one for this
              appointment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="existing"
                  onClick={() => form.setValue("patientType", "existing")}
                >
                  Existing Patient
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  onClick={() => form.setValue("patientType", "new")}
                >
                  New Patient
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Patient Name *</FormLabel>
                      <Popover open={patientOpen} onOpenChange={setPatientOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={patientOpen}
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={patientsLoading}
                            >
                              {patientsLoading
                                ? "Loading patients..."
                                : field.value || "Select or search patient..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search patients..." />
                            <CommandList>
                              <CommandEmpty>No patient found.</CommandEmpty>
                              <CommandGroup>
                                {patients.map((patient) => (
                                  <CommandItem
                                    value={patient.name}
                                    key={patient.id}
                                    onSelect={() =>
                                      handlePatientSelect(patient)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        patient.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span>{patient.name}</span>
                                      <span className="text-sm text-muted-foreground">
                                        ID: {patient.id} • Age: {patient.age}
                                      </span>
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
              </TabsContent>

              <TabsContent value="new" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPatientDateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPatientGender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <h3 className="text-sm font-medium">Appointment Details</h3>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field: timeField }) => (
                    <FormItem>
                      <FormLabel>Appointment Date & Time *</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          dateValue={field.value}
                          timeValue={timeField.value}
                          onDateChange={field.onChange}
                          onTimeChange={timeField.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Select the date and time for the appointment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APPOINTMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APPOINTMENT_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Doctor and Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <h3 className="text-sm font-medium">Additional Information</h3>
          </div>

          <FormField
            control={form.control}
            name="doctor"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Assigned Doctor *</FormLabel>
                <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={doctorOpen}
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={doctorsLoading}
                      >
                        {doctorsLoading
                          ? "Loading doctors..."
                          : field.value
                            ? doctors.find(
                                (doctor) => doctor.name === field.value,
                              )?.name
                            : "Select doctor..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search doctors..." />
                      <CommandList>
                        <CommandEmpty>No doctor found.</CommandEmpty>
                        <CommandGroup>
                          {doctors.map((doctor) => (
                            <CommandItem
                              value={doctor.name}
                              key={doctor.id}
                              onSelect={() => {
                                form.setValue("doctor", doctor.name);
                                setDoctorOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  doctor.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{doctor.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {doctor.specialization}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the doctor for this appointment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the appointment..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Any additional information about the appointment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isPending || doctorsLoading}>
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              <>Create Appointment</>
            )}
          </Button>

          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
