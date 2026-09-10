import { describe, expect, it } from "vitest";

import {
  elapsedMonths,
  formatExpenseDate,
  isInYearToDate,
  parseIsoDate,
  round2,
} from "../../app/utils/expensePeriod";

describe("parseIsoDate", () => {
  it("Parses ISO dates", () => {
    expect(parseIsoDate("2026-09-10")).toEqual({
      year: 2026,
      month: 9,
      day: 10,
    });
  });

  it("Returns null for missing or malformed values", () => {
    expect(parseIsoDate(null)).toBeNull();
    expect(parseIsoDate(undefined)).toBeNull();
    expect(parseIsoDate("")).toBeNull();
    expect(parseIsoDate("not a date")).toBeNull();
    expect(parseIsoDate("2026-13-01")).toBeNull();
  });
});

describe("elapsedMonths", () => {
  it("Counts completed months of the year", () => {
    expect(elapsedMonths(new Date(2026, 0, 20))).toBe(0);
    expect(elapsedMonths(new Date(2026, 8, 10))).toBe(8);
    expect(elapsedMonths(new Date(2026, 11, 31))).toBe(11);
  });
});

describe("isInYearToDate", () => {
  it("Accepts dates from January to the previous month", () => {
    const now = new Date(2026, 8, 10);

    expect(isInYearToDate("2026-01-15", now)).toBe(true);
    expect(isInYearToDate("2026-08-31", now)).toBe(true);
  });

  it("Rejects the current month, future months and other years", () => {
    const now = new Date(2026, 8, 10);

    expect(isInYearToDate("2026-09-01", now)).toBe(false);
    expect(isInYearToDate("2026-12-25", now)).toBe(false);
    expect(isInYearToDate("2025-03-10", now)).toBe(false);
    expect(isInYearToDate("", now)).toBe(false);
  });
});

describe("formatExpenseDate", () => {
  it("Formats ISO dates as day Mon year", () => {
    expect(formatExpenseDate("2026-06-05")).toBe("5 Jun 2026");
  });

  it("Returns empty string for missing values", () => {
    expect(formatExpenseDate(null)).toBe("");
  });
});

describe("round2", () => {
  it("Rounds to two decimals", () => {
    expect(round2(10.125)).toBe(10.13);
    expect(round2(0.1 + 0.2)).toBe(0.3);
  });
});
