import { describe, expect, it } from "vitest";

import { useExpenses } from "../../app/composables/useExpenses";

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

describe("useExpenses", () => {
  it("Sums year-to-date actuals and averages over elapsed months", () => {
    const now = new Date(2026, 8, 10);
    const { yearlyExpenses, monthlyExpenses, categoriesCount } = useExpenses(
      [
        buildExpense({ amount: 100, expenseDate: "2026-01-10" }),
        buildExpense({
          amount: 300,
          expenseDate: "2026-04-10",
          category: "House",
        }),
        buildExpense({ amount: 999, expenseDate: "2026-09-01" }),
        buildExpense({ amount: 999, expenseDate: "2025-05-01" }),
      ],
      now,
    );

    expect(yearlyExpenses.value).toBe(400);
    expect(monthlyExpenses.value).toBe(50);
    expect(categoriesCount.value).toBe(2);
  });

  it("Returns zero monthly average in January", () => {
    const { monthlyExpenses, yearlyExpenses } = useExpenses(
      [buildExpense({ amount: 100, expenseDate: "2026-01-10" })],
      new Date(2026, 0, 20),
    );

    expect(yearlyExpenses.value).toBe(0);
    expect(monthlyExpenses.value).toBe(0);
  });

  it("Tolerates undefined expenses", () => {
    const { yearlyExpenses } = useExpenses(undefined as never);

    expect(yearlyExpenses.value).toBe(0);
  });

  it("Filters by a custom start/end range and averages over its months", () => {
    const now = new Date(2026, 8, 10);
    const range = { start: "2026-03-01", end: "2026-04-30" };
    const { yearlyExpenses, monthlyExpenses, categoriesCount } = useExpenses(
      [
        buildExpense({ amount: 100, expenseDate: "2026-01-10" }),
        buildExpense({ amount: 200, expenseDate: "2026-03-10" }),
        buildExpense({
          amount: 400,
          expenseDate: "2026-04-10",
          category: "House",
        }),
        buildExpense({ amount: 999, expenseDate: "2026-09-01" }),
      ],
      now,
      range,
    );

    expect(yearlyExpenses.value).toBe(600);
    expect(monthlyExpenses.value).toBe(300);
    expect(categoriesCount.value).toBe(2);
  });

  it("Returns zero monthly average when the range has no months", () => {
    const { monthlyExpenses, yearlyExpenses } = useExpenses(
      [buildExpense({ amount: 100, expenseDate: "2026-01-10" })],
      new Date(2026, 8, 10),
      { start: "2026-05-01", end: "2026-02-01" },
    );

    expect(yearlyExpenses.value).toBe(0);
    expect(monthlyExpenses.value).toBe(0);
  });
});
