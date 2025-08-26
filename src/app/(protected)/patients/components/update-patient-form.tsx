"use client";

import { useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  BLOOD_TYPES,
  PatientUpdateSchema,
  type PatientUpdate,
  type Patient,
} from "@/lib/schemas/patient";
import { updatePatient } from "../actions";

interface UpdatePatientFormProps {
  patient: Patient;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdatePatientForm({
  patient,
  onSuccess,
  onCancel,
}: UpdatePatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientUpdate>({
    resolver: zodResolver(PatientUpdateSchema),
    defaultValues: {
      id: patient.id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
      phone_number: patient.phone_number,
      blood_type: patient.blood_type,
      medical_history: {
        allergies: patient.medical_history?.allergies || [],
        current_medications: patient.medical_history?.current_medications || [],
        medical_conditions: patient.medical_history?.medical_conditions || [],
        past_surgeries: patient.medical_history?.past_surgeries || [],
        family_history: {
          heart_disease: patient.medical_history?.family_history?.heart_disease || false,
          diabetes: patient.medical_history?.family_history?.diabetes || false,
          cancer: patient.medical_history?.family_history?.cancer || false,
          mental_health: patient.medical_history?.family_history?.mental_health || false,
          other: patient.medical_history?.family_history?.other || "",
        },
        emergency_contact: {
          name: patient.medical_history?.emergency_contact?.name || "",
          relationship: patient.medical_history?.emergency_contact?.relationship || "",
          phone: patient.medical_history?.emergency_contact?.phone || "",
        },
        insurance_info: {
          provider: patient.medical_history?.insurance_info?.provider || "",
          policy_number: patient.medical_history?.insurance_info?.policy_number || "",
          group_number: patient.medical_history?.insurance_info?.group_number || "",
        },
        notes: patient.medical_history?.notes || "",
      },
      address: patient.address || "",
      city: patient.city || "",
      state: patient.state || "",
      post_code: patient.post_code || "",
      country: patient.country || "",
    },
  });

  const onSubmit = async (data: PatientUpdate) => {
    setIsSubmitting(true);
    try {
      const result = await updatePatient(data);

      if (result.success) {
        toast.success("Patient updated successfully");
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to update patient");

        // Handle validation errors by setting them on the form
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            form.setError(field as keyof PatientUpdate, {
              type: "server",
              message: messages.join(", ")
            });
          });
        }
      }
    } catch (error) {
      console.error("Failed to update patient:", error);
      toast.error("Failed to update patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      captionLayout="dropdown"
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
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
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="blood_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOOD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="address-info"
        >
          <AccordionItem value="address-info">
            <AccordionTrigger>Address Information (optional)</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="post_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="medical-history">
            <AccordionTrigger>Medical History (optional)</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="medical_history.allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter allergies (one per line)"
                        {...field}
                        value={field.value?.join("\n") || ""}
                        onChange={(e) => {
                          const lines = e.target.value
                            .split("\n")
                            .filter((line) => line.trim());
                          field.onChange(lines);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medical_history.medical_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter medical conditions (one per line)"
                        {...field}
                        value={field.value?.join("\n") || ""}
                        onChange={(e) => {
                          const lines = e.target.value
                            .split("\n")
                            .filter((line) => line.trim());
                          field.onChange(lines);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Family History</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="medical_history.family_history.heart_disease"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Heart Disease</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_history.family_history.diabetes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Diabetes</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_history.family_history.cancer"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Cancer</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_history.family_history.mental_health"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Mental Health</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="medical_history.family_history.other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Family History</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Other family medical history"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormLabel>Emergency Contact</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="medical_history.emergency_contact.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_history.emergency_contact.relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="Relationship" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_history.emergency_contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormLabel>Insurance Information</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="medical_history.insurance_info.provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <FormControl>
                          <Input placeholder="Insurance provider" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_history.insurance_info.policy_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Policy number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medical_history.insurance_info.group_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Group number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="medical_history.notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional medical notes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
}