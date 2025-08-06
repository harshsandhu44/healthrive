"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useConsentContext } from "@/components/providers/consent-provider";
import { ConsentPreferences } from "@/lib/types/consent";
import { Cookie, Settings, Shield, BarChart3, Target, Sparkles } from "lucide-react";
import Link from "next/link";

const CONSENT_CATEGORIES = [
  {
    key: "essential" as const,
    title: "Essential Cookies",
    description: "Required for basic website functionality and security. Cannot be disabled.",
    icon: Shield,
    required: true,
    examples: ["Authentication", "Security", "Form submissions", "Session management"],
  },
  {
    key: "analytics" as const,
    title: "Analytics Cookies",
    description: "Help us understand how you use our website to improve user experience.",
    icon: BarChart3,
    required: false,
    examples: ["Usage statistics", "Performance monitoring", "Error tracking"],
  },
  {
    key: "marketing" as const,
    title: "Marketing Cookies",
    description: "Used to deliver relevant advertisements and measure their effectiveness.",
    icon: Target,
    required: false,
    examples: ["Ad targeting", "Campaign tracking", "Social media integration"],
  },
  {
    key: "personalization" as const,
    title: "Personalization Cookies",
    description: "Remember your preferences to provide a personalized experience.",
    icon: Sparkles,
    required: false,
    examples: ["Language preferences", "Theme settings", "Customized content"],
  },
];

export function CookieConsentBanner() {
  const { consentState, acceptAll, acceptEssential, saveConsent, isLoading } = useConsentContext();
  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<ConsentPreferences>(
    consentState.preferences
  );

  // Don't show banner if user has already consented or if loading
  if (consentState.hasConsented || isLoading) {
    return null;
  }

  const handleCustomSave = () => {
    saveConsent(tempPreferences);
    setShowDetails(false);
  };

  const handlePreferenceChange = (category: keyof ConsentPreferences, checked: boolean) => {
    setTempPreferences(prev => ({
      ...prev,
      [category]: category === "essential" ? true : checked,
    }));
  };

  return (
    <>
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Cookie className="h-6 w-6 text-primary" />
                  <Badge variant="secondary">Cookie Consent</Badge>
                </div>
                
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use cookies to enhance your experience, provide personalized content, 
                    and analyze our traffic. By continuing to use our site, you consent to our 
                    use of cookies as described in our{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>🔒 Your data is protected</span>
                    <span>•</span>
                    <span>🇪🇺 GDPR Compliant</span>
                    <span>•</span>
                    <span>⚙️ Customizable preferences</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Dialog open={showDetails} onOpenChange={setShowDetails}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Settings className="h-4 w-4 mr-2" />
                        Customize
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptEssential}
                    className="w-full sm:w-auto"
                  >
                    Essential Only
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="w-full sm:w-auto"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Preferences Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="text-sm text-muted-foreground">
              <p>
                We respect your privacy and give you control over how we use cookies. 
                You can enable or disable different categories of cookies below. 
                Note that disabling some cookies may affect your experience.
              </p>
            </div>

            <div className="space-y-4">
              {CONSENT_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const isChecked = tempPreferences[category.key];
                
                return (
                  <Card key={category.key} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-base">{category.title}</CardTitle>
                          {category.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        
                        <Checkbox
                          checked={isChecked}
                          disabled={category.required}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange(category.key, Boolean(checked))
                          }
                        />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.examples.map((example) => (
                            <Badge key={example} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="order-2 sm:order-1"
              >
                Cancel
              </Button>
              
              <div className="flex gap-2 order-1 sm:order-2 sm:ml-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempPreferences({
                      essential: true,
                      analytics: false,
                      marketing: false,
                      personalization: false,
                    });
                    handleCustomSave();
                  }}
                >
                  Essential Only
                </Button>
                
                <Button onClick={handleCustomSave}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}