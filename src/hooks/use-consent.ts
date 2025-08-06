"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ConsentPreferences,
  ConsentData,
  GDPRConsentState,
  DEFAULT_CONSENT_PREFERENCES,
  CONSENT_VERSION,
  CONSENT_STORAGE_KEY,
} from "@/lib/types/consent";

export function useConsent() {
  const [consentState, setConsentState] = useState<GDPRConsentState>({
    hasConsented: false,
    preferences: DEFAULT_CONSENT_PREFERENCES,
    timestamp: null,
    version: CONSENT_VERSION,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load consent from localStorage on mount
  useEffect(() => {
    const loadConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (stored) {
          const consentData: ConsentData = JSON.parse(stored);
          
          // Check if consent version is current
          const isCurrentVersion = consentData.version === CONSENT_VERSION;
          
          setConsentState({
            hasConsented: isCurrentVersion,
            preferences: isCurrentVersion 
              ? consentData.preferences 
              : DEFAULT_CONSENT_PREFERENCES,
            timestamp: consentData.timestamp,
            version: CONSENT_VERSION,
          });
        }
      } catch (error) {
        console.error("Error loading consent preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsent();
  }, []);

  // Save consent preferences
  const saveConsent = useCallback(
    (preferences: ConsentPreferences, userMetadata?: { ipAddress?: string; userAgent?: string }) => {
      const consentData: ConsentData = {
        preferences,
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
        ...userMetadata,
      };

      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
        
        setConsentState({
          hasConsented: true,
          preferences,
          timestamp: consentData.timestamp,
          version: CONSENT_VERSION,
        });

        // Trigger custom event for other parts of the app to listen to
        window.dispatchEvent(new CustomEvent("consentUpdated", { detail: consentData }));
        
        return true;
      } catch (error) {
        console.error("Error saving consent preferences:", error);
        return false;
      }
    },
    []
  );

  // Accept all consent categories
  const acceptAll = useCallback(() => {
    const allAccepted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    return saveConsent(allAccepted);
  }, [saveConsent]);

  // Accept only essential cookies
  const acceptEssential = useCallback(() => {
    return saveConsent(DEFAULT_CONSENT_PREFERENCES);
  }, [saveConsent]);

  // Update specific consent preference
  const updatePreference = useCallback(
    (category: keyof ConsentPreferences, value: boolean) => {
      const newPreferences = {
        ...consentState.preferences,
        [category]: category === "essential" ? true : value, // Essential always true
      };
      return saveConsent(newPreferences);
    },
    [consentState.preferences, saveConsent]
  );

  // Withdraw all consent (except essential)
  const withdrawConsent = useCallback(() => {
    const essentialOnly: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    return saveConsent(essentialOnly);
  }, [saveConsent]);

  // Reset consent (requires new consent)
  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      setConsentState({
        hasConsented: false,
        preferences: DEFAULT_CONSENT_PREFERENCES,
        timestamp: null,
        version: CONSENT_VERSION,
      });
      window.dispatchEvent(new CustomEvent("consentReset"));
      return true;
    } catch (error) {
      console.error("Error resetting consent:", error);
      return false;
    }
  }, []);

  // Check if specific category is consented
  const hasConsentFor = useCallback(
    (category: keyof ConsentPreferences): boolean => {
      return consentState.hasConsented && consentState.preferences[category];
    },
    [consentState]
  );

  // Get consent data for export/audit purposes
  const getConsentData = useCallback((): ConsentData | null => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error retrieving consent data:", error);
      return null;
    }
  }, []);

  return {
    // State
    consentState,
    isLoading,
    
    // Actions
    saveConsent,
    acceptAll,
    acceptEssential,
    updatePreference,
    withdrawConsent,
    resetConsent,
    
    // Utilities
    hasConsentFor,
    getConsentData,
  };
}