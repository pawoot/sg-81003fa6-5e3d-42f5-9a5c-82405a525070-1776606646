import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate URL-friendly slug from Thai/English text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace Thai spaces and special chars
    .replace(/[^\w\s-]/g, "")
    // Replace spaces with hyphens
    .replace(/\s+/g, "-")
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Format number with Thai locale
 */
export function formatThaiNumber(num: number): string {
  return num.toLocaleString("th-TH");
}