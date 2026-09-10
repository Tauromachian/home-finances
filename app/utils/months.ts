import type { Item } from "~/types/item";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const monthItems: Item[] = [
  { title: "January", value: "1" },
  { title: "February", value: "2" },
  { title: "March", value: "3" },
  { title: "April", value: "4" },
  { title: "May", value: "5" },
  { title: "June", value: "6" },
  { title: "July", value: "7" },
  { title: "August", value: "8" },
  { title: "September", value: "9" },
  { title: "October", value: "10" },
  { title: "November", value: "11" },
  { title: "December", value: "12" },
];

export function getMonthTitle(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "";

  return monthItems.find((month) => month.value === String(value))?.title ?? "";
}

/**
 * Parses a charge-month form value (month number, month title, or the
 * raw autocomplete display value) back into a month number (1-12).
 */
export function parseMonthValue(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const text = String(value).trim();
  const match = monthItems.find(
    (month) =>
      month.value === text || month.title.toLowerCase() === text.toLowerCase(),
  );

  if (match) return Number(match.value);

  const month = Number(text);

  if (!Number.isInteger(month) || month < 1 || month > 12) return null;

  return month;
}
