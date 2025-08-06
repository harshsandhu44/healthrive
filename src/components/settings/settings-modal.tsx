"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import our existing components
import { ConsentPreferences } from "@/components/consent/consent-preferences";
import { DataExportRequestComponent } from "@/components/data-export/data-export-request";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Import actions and types
import { getDataExportRequests } from "@/app/(protected)/settings/data-export/actions";
import type { DataExportRequest } from "@/lib/types/data-export";

import {
  Settings,
  Shield,
  Download,
  Palette,
  Cookie,
  FileText,
  Lock,
  Info,
  ExternalLink,
} from "lucide-react";

interface SettingsModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SettingsModalContentProps {
  initialExportRequests: DataExportRequest[];
}

function SettingsModalContent({ initialExportRequests }: SettingsModalContentProps) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="privacy" className="flex-1 overflow-hidden">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data Export
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Privacy Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Privacy Protection
                  </CardTitle>
                  <CardDescription>
                    Your privacy is protected under GDPR. Manage your data processing preferences below.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Lock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Data Encrypted</div>
                      <div className="text-xs text-muted-foreground">End-to-end security</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">GDPR Compliant</div>
                      <div className="text-xs text-muted-foreground">EU data protection</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Cookie className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Cookie Control</div>
                      <div className="text-xs text-muted-foreground">Granular preferences</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Legal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Privacy Policy</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/privacy" target="_blank" className="gap-2">
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Terms of Service</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/terms" target="_blank" className="gap-2">
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cookie Consent Preferences */}
              <ConsentPreferences />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Data Export Tab */}
        <TabsContent value="data" className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh]">
            <div className="pr-4">
              {/* GDPR Notice */}
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Your Right to Data Portability (GDPR Article 20):</strong> You can request 
                  and download all your personal data in a structured, machine-readable format. 
                  This data can be transferred to other service providers.
                </AlertDescription>
              </Alert>

              <DataExportRequestComponent existingRequests={initialExportRequests} />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Theme Selection */}
              <ThemeToggle showDescription={true} variant="card" />

              {/* Accessibility Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Accessibility</CardTitle>
                  <CardDescription>
                    Additional options to improve accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">High Contrast Mode</div>
                      <div className="text-xs text-muted-foreground">
                        Improves visibility for users with visual impairments
                      </div>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Reduced Motion</div>
                      <div className="text-xs text-muted-foreground">
                        Minimizes animations and transitions
                      </div>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Large Text</div>
                      <div className="text-xs text-muted-foreground">
                        Increases font size for better readability
                      </div>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Display Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Display Preferences</CardTitle>
                  <CardDescription>
                    Customize the interface to your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Compact Mode</div>
                      <div className="text-xs text-muted-foreground">
                        Show more content with reduced spacing
                      </div>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Sidebar Position</div>
                      <div className="text-xs text-muted-foreground">
                        Choose left or right sidebar layout
                      </div>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

export function SettingsModal({ trigger, open, onOpenChange }: SettingsModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : dialogOpen;
  const setIsOpen = isControlled ? onOpenChange : setDialogOpen;

  const handleOpenChange = async (newOpen: boolean) => {
    setIsOpen(newOpen);
    
    // Load export requests when opening the modal
    if (newOpen && exportRequests.length === 0) {
      try {
        const requests = await getDataExportRequests();
        setExportRequests(requests);
      } catch (error) {
        console.error("Failed to load export requests:", error);
      }
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Settings className="h-4 w-4 mr-2" />
      Settings
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      {isOpen && (
        <SettingsModalContent 
          initialExportRequests={exportRequests} 
        />
      )}
    </Dialog>
  );
}