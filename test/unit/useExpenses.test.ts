import { describe, expect, it } from "vitest";

import { useExpenses } from "../../app/composables/useExpenses";

import type { Expense } from "../../app/types/expense";

let nextId = 1;

function buildExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: nextId++,
    userId: "user-1",
    name: "Test",
    amount: 100,
    category: "Food",
    expenseDate: "2026-01-15",
    description: "",
    ...overrides,
  };
}

describe("useExpenses", () => {
  it("Sums year-to-date expenses over completed months when no range is given", () => {
    const now = new Date(2026, 8, 10);
    const { totalExpenses, categoriesCount, yearToDateExpenses } = useExpenses(
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

    expect(yearToDateExpenses.value).toHaveLength(2);
    expect(totalExpenses.value).toBe(400);
    expect(categoriesCount.value).toBe(2);
  });

  it("Returns zero totals in January when no month is completed", () => {
    const { totalExpenses, categoriesCount, yearToDateExpenses } = useExpenses(
      [buildExpense({ amount: 100, expenseDate: "2026-01-10" })],
      new Date(2026, 0, 20),
    );

    expect(yearToDateExpenses.value).toHaveLength(0);
    expect(totalExpenses.value).toBe(0);
    expect(categoriesCount.value).toBe(0);
  });

  it("Tolerates undefined expenses", () => {
    const { totalExpenses, categoriesCount, yearToDateExpenses } = useExpenses(
      undefined as never,
    );

    expect(yearToDateExpenses.value).toHaveLength(0);
    expect(totalExpenses.value).toBe(0);
    expect(categoriesCount.value).toBe(0);
  });

  it("Filters by a custom start/end range", () => {
    const now = new Date(2026, 8, 10);
    const range = { start: "2026-03-01", end: "2026-04-30" };
    const { totalExpenses, categoriesCount, yearToDateExpenses } = useExpenses(
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

    expect(yearToDateExpenses.value).toHaveLength(2);
    expect(totalExpenses.value).toBe(600);
    expect(categoriesCount.value).toBe(2);
  });

  it("Returns zero totals when the range matches nothing", () => {
    const { totalExpenses, categoriesCount, yearToDateExpenses } = useExpenses(
      [buildExpense({ amount: 100, expenseDate: "2026-01-10" })],
      new Date(2026, 8, 10),
      { start: "2026-05-01", end: "2026-02-01" },
    );

    expect(yearToDateExpenses.value).toHaveLength(0);
    expect(totalExpenses.value).toBe(0);
    expect(categoriesCount.value).toBe(0);
  });
});
