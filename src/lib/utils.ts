import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple capitalize function
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Simple slugify function
export function slugify(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word chars, and consecutive dashes with a single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

// Basic date/time formatting
export function formatDateTime(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);
    // Example format: "Jan 1, 2024, 10:30 AM" - customize as needed
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
} 