export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export interface ConsentData {
  preferences: ConsentPreferences;
  timestamp: string;
  version: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface GDPRConsentState {
  hasConsented: boolean;
  preferences: ConsentPreferences;
  timestamp: string | null;
  version: string;
}

export const DEFAULT_CONSENT_PREFERENCES: ConsentPreferences = {
  essential: true, // Always true - required for basic functionality
  analytics: false,
  marketing: false,
  personalization: false,
};

export const CONSENT_VERSION = "1.0";
export const CONSENT_STORAGE_KEY = "healthrive_gdpr_consent";