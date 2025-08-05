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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
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
import { createAppointment } from "@/app/(protected)/appointments/actions";
import { getDoctors } from "@/app/(protected)/doctors/actions";
import { APPOINTMENT_TYPES, APPOINTMENT_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { type Doctor } from "@/lib/types/entities";

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
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
          step="1"
          value={timeValue || ""}
          onChange={(e) => onTimeChange(e.target.value)}
          disabled={disabled}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}

const appointmentFormSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters."),
  patientId: z.string().optional(),
  date: z.date({ message: "Appointment date is required." }),
  time: z.string().min(1, "Appointment time is required."),
  type: z.enum(["consultation", "follow-up", "surgery", "emergency"]),
  status: z.enum(["scheduled", "in-progress", "completed", "cancelled"]),
  doctor: z.string().min(1, "Doctor selection is required."),
  notes: z.string().optional(),
});

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
      type: "consultation",
      status: "scheduled",
    },
  });

  // Load doctors on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsList = await getDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Failed to load doctors:", error);
        toast.error("Failed to load doctors list");
      } finally {
        setDoctorsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const onSubmit = (values: AppointmentFormValues) => {
    startTransition(async () => {
      try {
        // Combine date and time for the appointment
        const appointmentDateTime = new Date(values.date);
        const [hours, minutes] = values.time.split(":");
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

        const appointmentData = {
          id: `apt-${Date.now()}`, // Generate unique ID
          patientName: values.patientName,
          patientId: values.patientId || null,
          time: appointmentDateTime.toISOString(),
          type: values.type,
          status: values.status,
          doctor: values.doctor,
          notes: values.notes || null,
        };

        await createAppointment(appointmentData);

        toast.success("Appointment created successfully!", {
          description: `Appointment scheduled for ${values.patientName} on ${format(appointmentDateTime, "PPP 'at' p")}`,
        });

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
        toast.error("Failed to create appointment", {
          description: "Please try again or contact support if the problem persists.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Create New Appointment
        </h2>
        <p className="text-muted-foreground">
          Schedule a new appointment for a patient.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="text-lg font-medium">Patient Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name *</FormLabel>
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
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input placeholder="PT-001 (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave empty for new patients
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <h3 className="text-lg font-medium">Appointment Details</h3>
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
              <h3 className="text-lg font-medium">Additional Information</h3>
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
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={doctorsLoading}
                        >
                          {doctorsLoading
                            ? "Loading doctors..."
                            : field.value
                              ? doctors.find((doctor) => doctor.name === field.value)?.name
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
                                      : "opacity-0"
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
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Create Appointment
                </>
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
    </div>
  );
}