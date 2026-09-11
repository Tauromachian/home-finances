import { describe, expect, it } from "vitest";

import {
  countMonthsInRange,
  defaultReportRange,
  elapsedMonths,
  endOfPreviousMonth,
  formatExpenseDate,
  isInRange,
  isInYearToDate,
  listMonthsInRange,
  parseIsoDate,
  round2,
  toISODate,
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

describe("endOfPreviousMonth", () => {
  it("Returns the last day of the previous month", () => {
    expect(endOfPreviousMonth(new Date(2026, 8, 10))).toBe("2026-08-31");
    expect(endOfPreviousMonth(new Date(2026, 2, 1))).toBe("2026-02-28");
  });

  it("Wraps to December of the previous year in January", () => {
    expect(endOfPreviousMonth(new Date(2026, 0, 20))).toBe("2025-12-31");
  });
});

describe("defaultReportRange", () => {
  it("Spans January 1st to the end of the previous month", () => {
    expect(defaultReportRange(new Date(2026, 8, 10))).toEqual({
      start: "2026-01-01",
      end: "2026-08-31",
    });
  });

  it("Falls back to the previous year in January", () => {
    expect(defaultReportRange(new Date(2026, 0, 20))).toEqual({
      start: "2025-01-01",
      end: "2025-12-31",
    });
  });
});

describe("isInRange", () => {
  it("Accepts dates inside the range including the bounds", () => {
    expect(isInRange("2026-01-01", "2026-01-01", "2026-08-31")).toBe(true);
    expect(isInRange("2026-08-31", "2026-01-01", "2026-08-31")).toBe(true);
    expect(isInRange("2026-04-15", "2026-01-01", "2026-08-31")).toBe(true);
  });

  it("Rejects dates outside the range and malformed values", () => {
    expect(isInRange("2026-09-01", "2026-01-01", "2026-08-31")).toBe(false);
    expect(isInRange("2025-12-31", "2026-01-01", "2026-08-31")).toBe(false);
    expect(isInRange("", "2026-01-01", "2026-08-31")).toBe(false);
    expect(isInRange("not a date", "2026-01-01", "2026-08-31")).toBe(false);
  });

  it("Treats empty bounds as unbounded", () => {
    expect(isInRange("2020-05-05", "", "2026-08-31")).toBe(true);
    expect(isInRange("2030-05-05", "2026-01-01", "")).toBe(true);
  });
});

describe("listMonthsInRange", () => {
  it("Lists every month between start and end", () => {
    expect(listMonthsInRange("2026-01-15", "2026-03-20")).toEqual([
      { year: 2026, month: 1 },
      { year: 2026, month: 2 },
      { year: 2026, month: 3 },
    ]);
  });

  it("Spans year boundaries", () => {
    expect(listMonthsInRange("2025-12-01", "2026-02-01")).toEqual([
      { year: 2025, month: 12 },
      { year: 2026, month: 1 },
      { year: 2026, month: 2 },
    ]);
  });

  it("Returns an empty list for inverted or invalid ranges", () => {
    expect(listMonthsInRange("2026-05-01", "2026-02-01")).toEqual([]);
    expect(listMonthsInRange("", "2026-02-01")).toEqual([]);
    expect(listMonthsInRange("2026-01-01", "")).toEqual([]);
  });
});

describe("countMonthsInRange", () => {
  it("Counts months inclusively", () => {
    expect(countMonthsInRange("2026-01-01", "2026-08-31")).toBe(8);
    expect(countMonthsInRange("2026-03-10", "2026-03-20")).toBe(1);
  });
});

describe("toISODate", () => {
  it("Pads month and day", () => {
    expect(toISODate(2026, 3, 5)).toBe("2026-03-05");
  });
});
