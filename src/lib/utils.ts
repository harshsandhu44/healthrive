import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique patient ID in the format pt-{unique_id}
 * Uses a 6-character alphanumeric string for the unique part
 * @returns string in format "pt-a7x9k2"
 */
export function generatePatientId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueId = '';
  
  for (let i = 0; i < 6; i++) {
    uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `pt-${uniqueId}`;
}
