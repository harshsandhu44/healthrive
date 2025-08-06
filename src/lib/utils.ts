import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique patient ID in the format pt-{unique_id}
 * Uses a 6-character alphanumeric string for the unique part
 * @returns string in format "pt-a7x9k2"
 */
export function generatePatientId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueId = "";

  for (let i = 0; i < 6; i++) {
    uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `pt-${uniqueId}`;
}

/**
 * Generates a unique doctor ID in the format doc-{unique_id}
 * Uses a 6-character alphanumeric string for the unique part
 * @returns string in format "doc-a7x9k2"
 */
export function generateDoctorId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueId = "";

  for (let i = 0; i < 6; i++) {
    uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `doc-${uniqueId}`;
}

/**
 * Generates a unique ID with optional prefix
 * Uses crypto.randomUUID() if available, fallback to custom implementation
 * @param prefix Optional prefix for the ID
 * @returns string unique ID
 */
export function generateId(prefix?: string): string {
  // Use crypto.randomUUID if available (Node.js 14.17+ and modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    const id = crypto.randomUUID();
    return prefix ? `${prefix}-${id}` : id;
  }
  
  // Fallback implementation
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueId = '';
  
  for (let i = 0; i < 12; i++) {
    uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return prefix ? `${prefix}-${uniqueId}` : uniqueId;
}
