import { describe, expect, it } from "vitest";

import { getMonthlyExpensesSeries } from "../../app/services/expenses";

import type { Expense } from "../../app/types/expense";

function buildExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    name: "Test",
    amount: 100,
    category: "Food",
    date: "2026-01-15",
    description: "",
    ...overrides,
  };
}

describe("getMonthlyExpensesSeries", () => {
  it("Buckets actual expenses by month up to the previous month", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [
        buildExpense({ amount: 100, date: "2026-01-10" }),
        buildExpense({ amount: 50, date: "2026-01-20" }),
        buildExpense({ amount: 200, date: "2026-03-05" }),
        buildExpense({ amount: 999, date: "2026-09-01" }),
        buildExpense({ amount: 999, date: "2025-02-10" }),
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
      [buildExpense({ date: "2026-01-05" })],
      new Date(2026, 0, 20),
    );

    expect(labels).toEqual([]);
    expect(totals).toEqual([]);
  });

  it("Skips expenses without a valid date", () => {
    const { totals } = getMonthlyExpensesSeries(
      [buildExpense({ amount: 100, date: "" })],
      new Date(2026, 2, 1),
    );

    expect(totals).toEqual([0, 0]);
  });
});
