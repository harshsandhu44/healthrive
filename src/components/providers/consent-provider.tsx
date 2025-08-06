"use client";

import React, { createContext, useContext } from "react";
import { useConsent } from "@/hooks/use-consent";
import { ConsentPreferences, ConsentData, GDPRConsentState } from "@/lib/types/consent";

interface ConsentContextType {
  // State
  consentState: GDPRConsentState;
  isLoading: boolean;
  
  // Actions
  saveConsent: (
    preferences: ConsentPreferences, 
    userMetadata?: { ipAddress?: string; userAgent?: string }
  ) => boolean;
  acceptAll: () => boolean;
  acceptEssential: () => boolean;
  updatePreference: (category: keyof ConsentPreferences, value: boolean) => boolean;
  withdrawConsent: () => boolean;
  resetConsent: () => boolean;
  
  // Utilities
  hasConsentFor: (category: keyof ConsentPreferences) => boolean;
  getConsentData: () => ConsentData | null;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consentHook = useConsent();

  return (
    <ConsentContext.Provider value={consentHook}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsentContext() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsentContext must be used within a ConsentProvider");
  }
  return context;
}