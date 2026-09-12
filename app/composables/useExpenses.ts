import { computed, toValue } from "vue";

import type { Expense } from "../types/expense";
import { isInRange, isInYearToDate, round2 } from "../utils/expensePeriod";

export interface ExpensesRange {
  start?: string | null;
  end?: string | null;
}

export const useExpenses = (
  expenses: MaybeRefOrGetter<Expense[]>,
  now: Date = new Date(),
  range: MaybeRefOrGetter<ExpensesRange | undefined> = undefined,
) => {
  const yearToDateExpenses = computed(() => {
    const resolvedRange = toValue(range);
    const hasRange = Boolean(resolvedRange?.start || resolvedRange?.end);

    return (toValue(expenses) ?? []).filter((expense) =>
      hasRange
        ? isInRange(
            expense.expenseDate,
            resolvedRange?.start,
            resolvedRange?.end,
          )
        : isInYearToDate(expense.expenseDate, now),
    );
  });

  const totalExpenses = computed(() =>
    round2(
      yearToDateExpenses.value.reduce(
        (sum: number, expense: Expense) => sum + Number(expense.amount),
        0,
      ),
    ),
  );

  const categoriesCount = computed(
    () =>
      new Set(yearToDateExpenses.value.map((expense) => expense.category)).size,
  );

  return {
    totalExpenses,
    categoriesCount,
    yearToDateExpenses,
  };
};
