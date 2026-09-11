import { describe, expect, it } from "vitest";

import { getMonthlyExpensesSeries } from "../../app/services/expenses";

import type { Expense } from "../../app/types/expense";

function buildExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    name: "Test",
    amount: 100,
    category: "Food",
    expenseDate: "2026-01-15",
    description: "",
    ...overrides,
  };
}

describe("getMonthlyExpensesSeries", () => {
  it("Buckets actual expenses by month up to the previous month", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [
        buildExpense({ amount: 100, expenseDate: "2026-01-10" }),
        buildExpense({ amount: 50, expenseDate: "2026-01-20" }),
        buildExpense({ amount: 200, expenseDate: "2026-03-05" }),
        buildExpense({ amount: 999, expenseDate: "2026-09-01" }),
        buildExpense({ amount: 999, expenseDate: "2025-02-10" }),
      ],
      new Date(2026, 8, 10),
    );

    expect(labels).toEqual([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
    ]);
    expect(totals).toEqual([150, 0, 200, 0, 0, 0, 0, 0]);
  });

  it("Returns an empty series in January", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [buildExpense({ expenseDate: "2026-01-05" })],
      new Date(2026, 0, 20),
    );

    expect(labels).toEqual([]);
    expect(totals).toEqual([]);
  });

  it("Skips expenses without a valid date", () => {
    const { totals } = getMonthlyExpensesSeries(
      [buildExpense({ amount: 100, expenseDate: "" })],
      new Date(2026, 2, 1),
    );

    expect(totals).toEqual([0, 0]);
  });

  it("Buckets a custom range including only its months", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [
        buildExpense({ amount: 100, expenseDate: "2026-01-10" }),
        buildExpense({ amount: 200, expenseDate: "2026-03-05" }),
        buildExpense({ amount: 50, expenseDate: "2026-04-05" }),
        buildExpense({ amount: 999, expenseDate: "2026-09-01" }),
      ],
      new Date(2026, 8, 10),
      { start: "2026-03-01", end: "2026-08-31" },
    );

    expect(labels).toEqual(["Mar", "Apr", "May", "Jun", "Jul", "Aug"]);
    expect(totals).toEqual([200, 50, 0, 0, 0, 0]);
  });

  it("Labels months with the year when the range spans years", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [
        buildExpense({ amount: 100, expenseDate: "2025-12-10" }),
        buildExpense({ amount: 200, expenseDate: "2026-01-10" }),
      ],
      new Date(2026, 8, 10),
      { start: "2025-12-01", end: "2026-02-28" },
    );

    expect(labels).toEqual(["Dec 25", "Jan 26", "Feb 26"]);
    expect(totals).toEqual([100, 200, 0]);
  });
});
