import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "0";
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format date & time in Indonesian Time (Asia/Jakarta timezone)
 * Handles null/1970 invalid timestamps gracefully without appending "WIB"
 */
export function formatWIBDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime()) || date.getTime() <= 86400000) {
    return "-";
  }

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  const timeStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replace(".", ":");

  return `${dateStr}, ${timeStr}`;
}

export function formatWIBDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime()) || date.getTime() <= 86400000) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatWIBTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime()) || date.getTime() <= 86400000) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replace(".", ":");
}

/**
 * Format relative duration:
 * - < 60 minutes -> only minutes (e.g. "5 mnt lalu")
 * - 60 min to 24 hours -> only hours (e.g. "2 jam lalu")
 * - > 24 hours -> only days (e.g. "3 hari lalu")
 */
export function formatRelativeDuration(dateInput?: string | Date | null): string {
  if (!dateInput) return "Baru saja";
  const date = new Date(dateInput);
  if (isNaN(date.getTime()) || date.getTime() <= 86400000) return "Baru saja";

  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "Baru saja";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} mnt lalu`;
  }
  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }
  return `${diffDays} hari lalu`;
}

