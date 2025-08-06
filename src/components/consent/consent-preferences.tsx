"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useConsentContext } from "@/components/providers/consent-provider";
import { ConsentPreferences } from "@/lib/types/consent";
import { Shield, BarChart3, Target, Sparkles, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const CONSENT_CATEGORIES = [
  {
    key: "essential" as const,
    title: "Essential Cookies",
    description: "Required for basic website functionality, security, and user authentication. These cannot be disabled as they are necessary for the site to work properly.",
    icon: Shield,
    required: true,
    color: "text-green-600",
    details: [
      "User authentication and session management",
      "Security features and CSRF protection", 
      "Form submissions and data validation",
      "Basic site functionality and navigation",
    ],
  },
  {
    key: "analytics" as const,
    title: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website by collecting anonymous information about usage patterns and performance.",
    icon: BarChart3,
    required: false,
    color: "text-blue-600",
    details: [
      "Page views and user journey tracking",
      "Performance monitoring and optimization",
      "Error tracking and bug identification",
      "Usage statistics for service improvement",
    ],
  },
  {
    key: "marketing" as const,
    title: "Marketing Cookies",
    description: "Used to deliver relevant advertisements and measure the effectiveness of marketing campaigns across different platforms.",
    icon: Target,
    required: false,
    color: "text-purple-600",
    details: [
      "Targeted advertising and ad personalization",
      "Marketing campaign effectiveness tracking",
      "Social media integration and sharing",
      "Cross-platform attribution and analytics",
    ],
  },
  {
    key: "personalization" as const,
    title: "Personalization Cookies",
    description: "Remember your preferences and settings to provide a customized and improved user experience tailored to your needs.",
    icon: Sparkles,
    required: false,
    color: "text-orange-600",
    details: [
      "Language and locale preferences",
      "Theme and display settings",
      "Personalized content recommendations",
      "Saved preferences and custom configurations",
    ],
  },
];

export function ConsentPreferences() {
  const { consentState, updatePreference, withdrawConsent, resetConsent, getConsentData } = useConsentContext();
  const [localPreferences, setLocalPreferences] = useState<ConsentPreferences>(consentState.preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (category: keyof ConsentPreferences, checked: boolean) => {
    const newPreferences = {
      ...localPreferences,
      [category]: category === "essential" ? true : checked,
    };
    
    setLocalPreferences(newPreferences);
    setHasChanges(JSON.stringify(newPreferences) !== JSON.stringify(consentState.preferences));
  };

  const handleSave = () => {
    let hasErrors = false;
    
    Object.entries(localPreferences).forEach(([key, value]) => {
      if (key !== "essential") {
        const success = updatePreference(key as keyof ConsentPreferences, value);
        if (!success) hasErrors = true;
      }
    });

    if (!hasErrors) {
      setHasChanges(false);
      toast.success("Consent preferences updated successfully");
    } else {
      toast.error("Failed to update some preferences");
    }
  };

  const handleReset = () => {
    setLocalPreferences(consentState.preferences);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const handleWithdrawAll = () => {
    const success = withdrawConsent();
    if (success) {
      setLocalPreferences({
        essential: true,
        analytics: false,
        marketing: false,
        personalization: false,
      });
      setHasChanges(false);
      toast.success("Non-essential consent withdrawn");
    } else {
      toast.error("Failed to withdraw consent");
    }
  };

  const consentData = getConsentData();
  const consentDate = consentData?.timestamp ? new Date(consentData.timestamp).toLocaleString() : "Not set";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Cookie Preferences</h2>
        <p className="text-muted-foreground">
          Manage your cookie and data processing preferences. You can withdraw your consent at any time.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Consent Status:</span>
            <Badge variant={consentState.hasConsented ? "default" : "secondary"}>
              {consentState.hasConsented ? "Consented" : "Not Consented"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Updated:</span>
            <span className="text-sm">{consentDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Version:</span>
            <span className="text-sm">{consentState.version}</span>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="space-y-4">
        {CONSENT_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          const isEnabled = localPreferences[category.key];
          
          return (
            <Card key={category.key} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${category.color}`} />
                    <div>
                      <CardTitle className="text-base">{category.title}</CardTitle>
                      {category.required && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Always Active
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Switch
                    checked={isEnabled}
                    disabled={category.required}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(category.key, checked)
                    }
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="mb-4">
                  {category.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">This includes:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {category.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-xs">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Warning Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Disabling certain cookies may affect your experience and limit some features. 
          Essential cookies are always required for basic functionality.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 sm:flex-none"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
        
        <Button
          variant="destructive"
          onClick={handleWithdrawAll}
          className="sm:ml-auto"
        >
          Withdraw All Non-Essential
        </Button>
      </div>

      {/* Additional Information */}
      <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
        <p>
          Your consent choices are stored locally and synchronized across our services. 
          You can change these preferences at any time.
        </p>
        <p>
          For more information about our data practices, please see our{" "}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}