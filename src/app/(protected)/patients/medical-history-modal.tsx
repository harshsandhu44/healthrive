"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Pill,
  Stethoscope,
  FileText,
  TestTube,
  AlertTriangle,
  Users,
  Shield,
  Cigarette,
  Wine,
} from "lucide-react";
import { type Patient } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MedicalHistoryModalProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const diagnosisStatusColors = {
  active: "bg-red-500/10 text-red-700 dark:text-red-400",
  resolved: "bg-green-500/10 text-green-700 dark:text-green-400",
  chronic: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

const medicationRouteColors = {
  oral: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  intravenous: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  topical: "bg-green-500/10 text-green-700 dark:text-green-400",
  injection: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  inhalation: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
};

const noteTypeColors = {
  progress: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  discharge: "bg-green-500/10 text-green-700 dark:text-green-400",
  admission: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  consultation: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

export function MedicalHistoryModal({ patient, open, onOpenChange }: MedicalHistoryModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical History - {patient.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive medical record for {patient.name} (ID: {patient.id})
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="procedures">Procedures</TabsTrigger>
              <TabsTrigger value="labs">Lab Results</TabsTrigger>
              <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
              <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Demographics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Age:</strong> {patient.age} years</div>
                    <div><strong>Gender:</strong> {patient.gender}</div>
                    <div><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                    <div><strong>Phone:</strong> {patient.contactInfo.phone}</div>
                    <div><strong>Email:</strong> {patient.contactInfo.email}</div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {patient.emergencyContact.name}</div>
                    <div><strong>Phone:</strong> {patient.emergencyContact.phone}</div>
                    <div><strong>Relationship:</strong> {patient.emergencyContact.relationship}</div>
                  </CardContent>
                </Card>

                {/* Insurance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Insurance Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Provider:</strong> {patient.insurance.provider}</div>
                    <div><strong>Policy Number:</strong> {patient.insurance.policyNumber}</div>
                  </CardContent>
                </Card>

                {/* Social History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <Cigarette className="h-4 w-4" />
                        <Wine className="h-4 w-4" />
                      </div>
                      Social History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Smoking:</strong> {patient.socialHistory.smokingStatus}</div>
                    <div><strong>Alcohol:</strong> {patient.socialHistory.alcoholConsumption}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Allergies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Family History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Family History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {patient.familyHistory.map((history, index) => (
                      <li key={index}>{history}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diagnoses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Diagnoses History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.diagnoses.map((diagnosis, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{diagnosis.code}</Badge>
                          <Badge 
                            variant="secondary"
                            className={cn(diagnosisStatusColors[diagnosis.status])}
                          >
                            {diagnosis.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(diagnosis.dateOfDiagnosis).toLocaleDateString()}
                        </div>
                      </div>
                      <h4 className="font-medium">{diagnosis.description}</h4>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.medications.map((medication, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{medication.name}</h4>
                        <Badge 
                          variant="secondary"
                          className={cn(medicationRouteColors[medication.route])}
                        >
                          {medication.route}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Dosage:</strong> {medication.dosage}</div>
                        <div><strong>Frequency:</strong> {medication.frequency}</div>
                        <div><strong>Start Date:</strong> {new Date(medication.startDate).toLocaleDateString()}</div>
                        {medication.endDate && (
                          <div><strong>End Date:</strong> {new Date(medication.endDate).toLocaleDateString()}</div>
                        )}
                      </div>
                      <div className="mt-2 text-sm">
                        <strong>Reason:</strong> {medication.reason}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="procedures" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Procedures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.procedures.map((procedure, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{procedure.code}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(procedure.dateOfProcedure).toLocaleDateString()}
                        </div>
                      </div>
                      <h4 className="font-medium">{procedure.description}</h4>
                      <div className="mt-2 text-sm">
                        <strong>Provider:</strong> {procedure.provider}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="labs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Laboratory Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.labResults.map((lab, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{lab.testName}</h4>
                        <div className="text-sm text-muted-foreground">
                          {new Date(lab.dateOfTest).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><strong>Result:</strong> {lab.result}</div>
                        <div><strong>Units:</strong> {lab.units}</div>
                        <div><strong>Reference:</strong> {lab.referenceRange}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.vitalSigns.map((vitals, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Vital Signs</h4>
                        <div className="text-sm text-muted-foreground">
                          {new Date(vitals.dateTime).toLocaleString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Blood Pressure:</strong><br />
                          {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic} mmHg
                        </div>
                        <div>
                          <strong>Heart Rate:</strong><br />
                          {vitals.heartRate} bpm
                        </div>
                        <div>
                          <strong>Temperature:</strong><br />
                          {vitals.temperature}°F
                        </div>
                        <div>
                          <strong>Respiratory Rate:</strong><br />
                          {vitals.respiratoryRate} /min
                        </div>
                        <div>
                          <strong>Weight:</strong><br />
                          {vitals.weight} lbs
                        </div>
                        <div>
                          <strong>Height:</strong><br />
                          {vitals.height} inches
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Clinical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.clinicalNotes.map((note, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary"
                            className={cn(noteTypeColors[note.noteType])}
                          >
                            {note.noteType}
                          </Badge>
                          <span className="text-sm font-medium">{note.provider}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(note.dateTime).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}