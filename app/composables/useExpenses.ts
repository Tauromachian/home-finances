import { computed, toValue } from "vue";

import type { Expense } from "../types/expense";
import { elapsedMonths, isInYearToDate, round2 } from "../utils/expensePeriod";

export const useExpenses = (
  expenses: MaybeRefOrGetter<Expense[]>,
  now: Date = new Date(),
) => {
  const yearToDateExpenses = computed(() =>
    (toValue(expenses) ?? []).filter((expense) =>
      isInYearToDate(expense.expenseDate, now),
    ),
  );

  const yearlyExpenses = computed(() =>
    round2(
      yearToDateExpenses.value.reduce(
        (sum: number, expense: Expense) => sum + Number(expense.amount),
        0,
      ),
    ),
  );

  const monthlyExpenses = computed(() => {
    const elapsed = elapsedMonths(now);

    if (!elapsed) return 0;

    return round2(yearlyExpenses.value / elapsed);
  });

  const categoriesCount = computed(
    () =>
      new Set(yearToDateExpenses.value.map((expense) => expense.category)).size,
  );

  return {
    yearlyExpenses,
    monthlyExpenses,
    categoriesCount,
    yearToDateExpenses,
  };
};
