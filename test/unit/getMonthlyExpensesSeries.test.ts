import { describe, expect, it } from "vitest";

import { Frequency } from "../../app/types/frequency";
import { getMonthlyExpensesSeries } from "../../app/services/expenses/getMonthlyExpensesSeries";

import type { Expense } from "../../app/types/expense";

function buildExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    name: "Test",
    amount: 100,
    category: "Food",
    frequency: Frequency.MONTHLY,
    description: "",
    ...overrides,
  };
}

describe("getMonthlyExpensesSeries", () => {
  it("Adds monthly expenses to each month from January to the previous month", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [buildExpense({ amount: 100 })],
      new Date(2026, 8, 15),
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
    expect(totals).toEqual([100, 100, 100, 100, 100, 100, 100, 100]);
  });

  it("Splits yearly expenses into floored twelfths", () => {
    const { totals } = getMonthlyExpensesSeries(
      [buildExpense({ amount: 1000, frequency: Frequency.YEARLY })],
      new Date(2026, 2, 1),
    );

    expect(totals).toEqual([83, 83]);
  });

  it("Sums expenses of different frequencies", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [
        buildExpense({ amount: 100 }),
        buildExpense({ amount: 1200, frequency: Frequency.YEARLY }),
      ],
      new Date(2026, 2, 1),
    );

    expect(labels).toEqual(["Jan", "Feb"]);
    expect(totals).toEqual([200, 200]);
  });

  it("Returns an empty series in January (no previous month yet)", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [buildExpense({ amount: 100 })],
      new Date(2026, 0, 20),
    );

    expect(labels).toEqual([]);
    expect(totals).toEqual([]);
  });

  it("Covers eleven months in December", () => {
    const { labels, totals } = getMonthlyExpensesSeries(
      [buildExpense({ amount: 50 })],
      new Date(2026, 11, 31),
    );

    expect(labels).toHaveLength(11);
    expect(labels[10]).toBe("Nov");
    expect(totals).toEqual(new Array(11).fill(50));
  });
});
