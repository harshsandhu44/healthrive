"use client";

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Shield, Heart } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePatient } from "@/app/(protected)/patients/actions";
import { toast } from "sonner";
import type { Patient } from "@/lib/types/entities";

const patientFormSchema = z.object({
  name: z.string().min(2, "Patient name must be at least 2 characters."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(1, "Address is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Please enter a valid email address."),
  emergencyContactName: z
    .string()
    .min(1, "Emergency contact name is required."),
  emergencyContactPhone: z
    .string()
    .min(1, "Emergency contact phone is required."),
  emergencyContactRelationship: z
    .string()
    .min(1, "Emergency contact relationship is required."),
  insuranceProvider: z.string().min(1, "Insurance provider is required."),
  insurancePolicyNumber: z
    .string()
    .min(1, "Insurance policy number is required."),
  smokingStatus: z.enum(["never", "former", "current"]),
  alcoholConsumption: z.enum(["none", "occasional", "moderate", "heavy"]),
  allergies: z.string().optional(),
  familyHistory: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface EditPatientFormProps {
  patient: Patient;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditPatientForm({
  patient,
  onSuccess,
  onCancel,
}: EditPatientFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      phone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      smokingStatus: "never",
      alcoholConsumption: "none",
      allergies: "",
      familyHistory: "",
    },
  });

  // Set form values when patient data is available
  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.name,
        dateOfBirth: patient.dateOfBirth || "",
        gender: (patient.gender as "male" | "female" | "other") || "male",
        address: patient.contactInfo.address,
        phone: patient.contactInfo.phone,
        email: patient.contactInfo.email,
        emergencyContactName: patient.emergencyContact.name,
        emergencyContactPhone: patient.emergencyContact.phone,
        emergencyContactRelationship: patient.emergencyContact.relationship,
        insuranceProvider: patient.insurance.provider,
        insurancePolicyNumber: patient.insurance.policyNumber,
        smokingStatus: (patient.socialHistory.smokingStatus as "never" | "former" | "current") || "never",
        alcoholConsumption: (patient.socialHistory.alcoholConsumption as "none" | "occasional" | "moderate" | "heavy") || "none",
        allergies: patient.allergies ? patient.allergies.join(", ") : "",
        familyHistory: patient.familyHistory ? patient.familyHistory.join(", ") : "",
      });
    }
  }, [patient, form]);

  const onSubmit = (values: PatientFormValues) => {
    startTransition(async () => {
      try {
        const patientData = {
          name: values.name,
          dateOfBirth: values.dateOfBirth,
          age:
            new Date().getFullYear() -
            new Date(values.dateOfBirth).getFullYear(),
          gender: values.gender,
          contactInfo: {
            address: values.address,
            phone: values.phone,
            email: values.email,
          },
          emergencyContact: {
            name: values.emergencyContactName,
            phone: values.emergencyContactPhone,
            relationship: values.emergencyContactRelationship,
          },
          insurance: {
            provider: values.insuranceProvider,
            policyNumber: values.insurancePolicyNumber,
          },
          socialHistory: {
            smokingStatus: values.smokingStatus,
            alcoholConsumption: values.alcoholConsumption,
          },
          allergies: values.allergies
            ? values.allergies.split(",").map((a) => a.trim())
            : [],
          familyHistory: values.familyHistory
            ? values.familyHistory.split(",").map((h) => h.trim())
            : [],
        };

        await updatePatient(patient.id, patientData);

        toast.success("Patient updated successfully!", {
          description: `${values.name}'s information has been updated.`,
        });

        onSuccess?.();
      } catch (error) {
        console.error("Failed to update patient:", error);
        toast.error("Failed to update patient", {
          description:
            "Please try again or contact support if the problem persists.",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Medical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
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
                name="dateOfBirth"
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="patient@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St, City, State, ZIP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emergencyContactRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship *</FormLabel>
                  <FormControl>
                    <Input placeholder="Spouse, Parent, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="medical" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="insuranceProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Provider *</FormLabel>
                    <FormControl>
                      <Input placeholder="Blue Cross Blue Shield" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurancePolicyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="BCBS123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smokingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Smoking Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select smoking status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="former">Former</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alcoholConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alcohol Consumption *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select alcohol consumption" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
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
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List allergies separated by commas"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List family medical history separated by commas"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </>
            ) : (
              "Update Patient"
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