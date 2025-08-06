"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  DATA_EXPORT_TYPES, 
  type DataExportType, 
  type DataExportRequest 
} from "@/lib/types/data-export";
import { createDataExportRequest, getDataExportRequests } from "@/app/(protected)/settings/data-export/actions";
import { 
  Download, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

interface DataExportRequestProps {
  existingRequests: DataExportRequest[];
}

export function DataExportRequestComponent({ existingRequests }: DataExportRequestProps) {
  const [selectedTypes, setSelectedTypes] = useState<DataExportType[]>(["personal_info"]);
  const [format, setFormat] = useState<"json" | "csv" | "xml">("json");
  const [includeFiles, setIncludeFiles] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTypeChange = (type: DataExportType, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, type]);
    } else {
      setSelectedTypes(prev => prev.filter(t => t !== type));
    }
  };

  const handleSubmit = () => {
    if (selectedTypes.length === 0) {
      toast.error("Please select at least one data type to export");
      return;
    }

    startTransition(async () => {
      const result = await createDataExportRequest(selectedTypes, format, includeFiles);
      
      if (result.success) {
        toast.success("Data export request created successfully", {
          description: "You'll receive an email when your export is ready for download.",
        });
        setShowDialog(false);
        // In a real app, you'd refresh the requests list
      } else {
        toast.error("Failed to create export request", {
          description: result.error,
        });
      }
    });
  };

  const getStatusIcon = (status: DataExportRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: DataExportRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasRecentRequest = existingRequests.some(
    request => request.status === "pending" || request.status === "processing"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Data Export</h2>
        <p className="text-muted-foreground">
          Exercise your right to data portability under GDPR Article 20. 
          Download a copy of your personal data in a structured, machine-readable format.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Your Right to Data Portability:</strong> Under GDPR Article 20, you have the right to 
          receive your personal data in a structured, commonly used, and machine-readable format. 
          This data can be transmitted to another service provider where technically feasible.
        </AlertDescription>
      </Alert>

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Request Data Export
          </CardTitle>
          <CardDescription>
            Create a new request to export your personal data. Processing typically takes 5-30 minutes, 
            and downloads are available for 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button disabled={hasRecentRequest || isPending}>
                {hasRecentRequest ? "Export in Progress" : "Create New Export"}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure Data Export</DialogTitle>
                <DialogDescription>
                  Select the types of data you want to include in your export. 
                  Sensitive data will be properly anonymized where appropriate.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Data Types Selection */}
                <div className="space-y-4">
                  <h4 className="font-medium">Data Types</h4>
                  {DATA_EXPORT_TYPES.map((type) => (
                    <Card key={type.key} className="relative">
                      <CardContent className="pt-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedTypes.includes(type.key)}
                            onCheckedChange={(checked) =>
                              handleTypeChange(type.key, Boolean(checked))
                            }
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium">{type.label}</Label>
                              {type.sensitive && (
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Sensitive
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Format Selection */}
                <div className="space-y-3">
                  <h4 className="font-medium">Export Format</h4>
                  <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="json" id="json" />
                      <Label htmlFor="json" className="text-sm">
                        JSON (Recommended) - Structured, machine-readable format
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="csv" id="csv" />
                      <Label htmlFor="csv" className="text-sm">
                        CSV - Spreadsheet-compatible format
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="xml" id="xml" />
                      <Label htmlFor="xml" className="text-sm">
                        XML - Standard markup format
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <h4 className="font-medium">Options</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Include File Attachments</Label>
                      <p className="text-xs text-muted-foreground">
                        Include uploaded files and documents in the export
                      </p>
                    </div>
                    <Switch
                      checked={includeFiles}
                      onCheckedChange={setIncludeFiles}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? "Creating..." : "Create Export Request"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {hasRecentRequest && (
            <p className="text-sm text-muted-foreground mt-2">
              You have a pending export request. Please wait for it to complete before creating a new one.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Existing Requests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Export History</h3>
        {existingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No export requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {existingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium">
                          {request.format.toUpperCase()} Export
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requested: {formatDate(request.requestedAt)}
                        {request.completedAt && ` • Completed: ${formatDate(request.completedAt)}`}
                        {request.status === "completed" && ` • Expires: ${formatDate(request.expiresAt)}`}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {request.dataTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {DATA_EXPORT_TYPES.find(t => t.key === type)?.label || type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {request.status === "completed" && new Date() < new Date(request.expiresAt) && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Legal Information */}
      <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
        <p>
          <strong>Legal Notice:</strong> This export includes all personal data we process about you 
          in accordance with GDPR Article 15 (Right of Access) and Article 20 (Right to Data Portability).
        </p>
        <p>
          Data exports are available for download for 30 days and then permanently deleted for security reasons. 
          You can create a new export request at any time.
        </p>
      </div>
    </div>
  );
}