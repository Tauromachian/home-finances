import { months } from "./months";

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function parseIsoDate(value: string | null | undefined): {
  year: number;
  month: number;
  day: number;
} | null {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return { year, month, day };
}

/**
 * Number of completed months in the current year (January => 0,
 * September => 8 covering Jan..Aug).
 */
export function elapsedMonths(now: Date = new Date()): number {
  return now.getMonth();
}

/**
 * Whether an ISO date falls in the current year before the current
 * month (completed periods only).
 */
export function isInYearToDate(
  value: string | null | undefined,
  now: Date = new Date(),
): boolean {
  const parsed = parseIsoDate(value);

  if (!parsed) return false;

  return (
    parsed.year === now.getFullYear() &&
    parsed.month >= 1 &&
    parsed.month <= elapsedMonths(now)
  );
}

export function formatExpenseDate(value: string): string {
  const parsed = parseIsoDate(value);

  if (!parsed) return "";

  return `${parsed.day} ${months[parsed.month - 1]} ${parsed.year}`;
}
