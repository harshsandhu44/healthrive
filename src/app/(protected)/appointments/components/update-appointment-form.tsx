"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AppointmentUpdateSchema,
  appointmentTypeOptions,
  appointmentStatusOptions,
  durationOptions,
  type AppointmentUpdate,
  type Appointment,
} from "@/lib/schemas/appointment";
import { updateAppointment } from "../actions";
import { PatientSelector } from "./patient-selector";

interface UpdateAppointmentFormProps {
  appointment: Appointment;
  onSuccess?: () => void;
  onCancel?: () => void;
}


export function UpdateAppointmentForm({ 
  appointment, 
  onSuccess, 
  onCancel 
}: UpdateAppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const form = useForm<AppointmentUpdate>({
    resolver: zodResolver(AppointmentUpdateSchema),
    defaultValues: {
      id: appointment.id,
      datetime: appointment.datetime,
      patient_id: appointment.patient_id,
      notes: appointment.notes || "",
      appointment_type: appointment.appointment_type,
      duration_minutes: appointment.duration_minutes,
      location: appointment.location || "",
      reason: appointment.reason || "",
      no_show: appointment.no_show,
      status: appointment.status,
    },
  });

  // Initialize date/time state from existing appointment
  useEffect(() => {
    if (appointment.datetime) {
      const [date, time] = appointment.datetime.split("T");
      setSelectedDate(new Date(date));
      setSelectedTime(time?.substring(0, 5) || "");
    }
  }, [appointment.datetime]);

  // Update datetime when either date or time changes
  const updateDateTime = () => {
    if (selectedDate && selectedTime) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const datetime = `${dateString}T${selectedTime}:00`;
      form.setValue("datetime", datetime);
    } else {
      form.setValue("datetime", "");
    }
  };

  // Update datetime when date or time changes
  useEffect(() => {
    updateDateTime();
  }, [selectedDate, selectedTime]);

  // Reset form when appointment changes
  useEffect(() => {
    form.reset({
      id: appointment.id,
      datetime: appointment.datetime,
      patient_id: appointment.patient_id,
      notes: appointment.notes || "",
      appointment_type: appointment.appointment_type,
      duration_minutes: appointment.duration_minutes,
      location: appointment.location || "",
      reason: appointment.reason || "",
      no_show: appointment.no_show,
      status: appointment.status,
    });
    
    // Reset date/time state as well
    if (appointment.datetime) {
      const [date, time] = appointment.datetime.split("T");
      setSelectedDate(new Date(date));
      setSelectedTime(time?.substring(0, 5) || "");
    }
  }, [appointment, form]);

  const onSubmit = async (data: AppointmentUpdate) => {
    setIsSubmitting(true);
    try {
      const result = await updateAppointment(data);
      
      if (result.success) {
        toast.success("Appointment updated successfully");
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to update appointment");
        
        // Handle validation errors by setting them on the form
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            form.setError(field as keyof AppointmentUpdate, {
              type: "server",
              message: messages.join(", ")
            });
          });
        }
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
      toast.error("Failed to update appointment");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient *</FormLabel>
              <FormControl>
                <PatientSelector
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a patient..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="datetime"
            render={() => (
              <FormItem>
                <FormLabel>Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick appointment date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      captionLayout="dropdown"
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datetime"
            render={() => (
              <FormItem>
                <FormLabel>Time *</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    step="1800"
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                    }}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="appointment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {appointmentTypeOptions.map((type) => (
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
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {durationOptions.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Room 101, Main Office" {...field} />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {appointmentStatusOptions.map((status) => (
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

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Visit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the reason for this appointment..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes or instructions..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="no_show"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Mark as No Show</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}