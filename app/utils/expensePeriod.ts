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

export function toISODate(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
 * Last day of the month previous to `now` (September => Aug 31,
 * January => Dec 31 of the previous year).
 */
export function endOfPreviousMonth(now: Date = new Date()): string {
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return toISODate(end.getFullYear(), end.getMonth() + 1, end.getDate());
}

/**
 * Default reports range: January 1st up to the end of the previous
 * month (completed periods only).
 */
export function defaultReportRange(now: Date = new Date()): {
  start: string;
  end: string;
} {
  const end = endOfPreviousMonth(now);
  const parsed = parseIsoDate(end);

  return { start: `${parsed?.year ?? now.getFullYear()}-01-01`, end };
}

/**
 * Whether an ISO date falls inside [start, end] (inclusive).
 * Empty bounds are treated as unbounded.
 */
export function isInRange(
  value: string | null | undefined,
  start?: string | null,
  end?: string | null,
): boolean {
  if (!parseIsoDate(value)) return false;
  if (start && value! < start) return false;
  if (end && value! > end) return false;

  return true;
}

export function listMonthsInRange(
  start?: string | null,
  end?: string | null,
): { year: number; month: number }[] {
  const parsedStart = parseIsoDate(start);
  const parsedEnd = parseIsoDate(end);

  if (!parsedStart || !parsedEnd) return [];

  const startIndex = parsedStart.year * 12 + (parsedStart.month - 1);
  const endIndex = parsedEnd.year * 12 + (parsedEnd.month - 1);

  if (startIndex > endIndex) return [];

  const monthsInRange: { year: number; month: number }[] = [];
  for (let index = startIndex; index <= endIndex; index++) {
    monthsInRange.push({
      year: Math.floor(index / 12),
      month: (index % 12) + 1,
    });
  }

  return monthsInRange;
}

export function countMonthsInRange(
  start?: string | null,
  end?: string | null,
): number {
  return listMonthsInRange(start, end).length;
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
