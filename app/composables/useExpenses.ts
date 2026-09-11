import { computed, toValue } from "vue";

import type { Expense } from "../types/expense";
import {
  countMonthsInRange,
  elapsedMonths,
  isInRange,
  isInYearToDate,
  round2,
} from "../utils/expensePeriod";

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

  const yearlyExpenses = computed(() =>
    round2(
      yearToDateExpenses.value.reduce(
        (sum: number, expense: Expense) => sum + Number(expense.amount),
        0,
      ),
    ),
  );

  const monthlyExpenses = computed(() => {
    const resolvedRange = toValue(range);

    if (resolvedRange?.start || resolvedRange?.end) {
      const months = countMonthsInRange(
        resolvedRange?.start,
        resolvedRange?.end,
      );

      if (!months) return 0;

      return round2(yearlyExpenses.value / months);
    }

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
