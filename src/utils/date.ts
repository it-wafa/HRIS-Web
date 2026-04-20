/**
 * Centralized date/time formatting helpers for the HRIS application.
 *
 * All functions use the "id-ID" locale (Indonesian) and accept
 * `string | Date | null | undefined`. They always return a safe
 * fallback string so callers never need to guard for null/undefined.
 */

// ─── internal helper ────────────────────────────────────────────────

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

// ─── date-only formatters ───────────────────────────────────────────

/**
 * Full date with weekday.
 * Example: "Senin, 21 April 2026"
 */
export function formatDateLong(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Medium date without weekday.
 * Example: "21 April 2026"
 */
export function formatDateMedium(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Short date with abbreviated month.
 * Example: "21 Apr 2026"
 */
export function formatDateShort(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Compact date — day + short month, no year.
 * Example: "21 Apr"
 */
export function formatDateCompact(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Short date with abbreviated weekday, no year.
 * Example: "Sen, 21 Apr"
 */
export function formatDateWeekdayShort(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Short date with abbreviated weekday + year.
 * Example: "Sen, 21 Apr 2026"
 */
export function formatDateWeekdayShortYear(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── time-only formatters ───────────────────────────────────────────

/**
 * Hour + minute (24-hour).
 * Example: "08:30"
 */
export function formatTime(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "--:--";
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Full clock time with seconds (24-hour).
 * Example: "08:30:45"
 */
export function formatTimeFull(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "--:--:--";
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// ─── combined date+time formatters ──────────────────────────────────

/**
 * Short date + time.
 * Example: "21 Apr 2026, 08:30"
 */
export function formatDateTime(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Short date + time WITHOUT year.
 * Example: "21 Apr, 08:30"
 */
export function formatDateTimeCompact(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Long date + time.
 * Example: "21 April 2026, 08:30"
 */
export function formatDateTimeLong(
  value: string | Date | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── utility helpers ────────────────────────────────────────────────

/**
 * Returns today's date as an ISO date string (YYYY-MM-DD).
 */
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Returns a time-based Indonesian greeting.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

/**
 * Returns Indonesian month name for a given 0-based index.
 * Example: getMonthName(0) → "Januari"
 */
export function getMonthName(monthIndex: number): string {
  return new Date(2026, monthIndex).toLocaleString("id-ID", { month: "long" });
}
