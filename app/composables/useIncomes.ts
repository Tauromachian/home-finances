import { computed, toValue } from "vue";

import type { Income } from "../types/income";
import { isInRange, isInYearToDate, round2 } from "../utils/period";

export interface IncomesRange {
  start?: string | null;
  end?: string | null;
}

export const useIncomes = (
  incomes: MaybeRefOrGetter<Income[]>,
  now: Date = new Date(),
  range: MaybeRefOrGetter<IncomesRange | undefined> = undefined,
) => {
  const yearToDateIncomes = computed(() => {
    const resolvedRange = toValue(range);
    const hasRange = Boolean(resolvedRange?.start || resolvedRange?.end);

    return (toValue(incomes) ?? []).filter((income) =>
      hasRange
        ? isInRange(income.incomeDate, resolvedRange?.start, resolvedRange?.end)
        : isInYearToDate(income.incomeDate, now),
    );
  });

  const totalIncomes = computed(() =>
    round2(
      yearToDateIncomes.value.reduce(
        (sum: number, income: Income) => sum + Number(income.amount),
        0,
      ),
    ),
  );

  return {
    totalIncomes,
    yearToDateIncomes,
  };
};
