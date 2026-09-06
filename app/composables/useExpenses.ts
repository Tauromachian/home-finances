import type { Expense } from "~/types/expense";
import { Frequency } from "~/types/frequency";

export const useExpenses = (expenses: MaybeRefOrGetter<Expense[]>) => {
  const yearlyExpenses = computed(() => {
    return toValue(expenses).reduce((acum: number, next: Expense) => {
      if (next.frequency === Frequency.YEARLY) {
        acum += Number(next.amount);
      } else if (next.frequency === Frequency.MONTHLY) {
        acum += next.amount * 12;
      } else {
        acum += next.amount;
      }

      return acum;
    }, 0);
  });

  const monthlyExpenses = computed(() => {
    return toValue(expenses).reduce((acum: number, next: Expense) => {
      if (
        next.frequency === Frequency.MONTHLY ||
        next.frequency === Frequency.ONE_TIME
      ) {
        acum += next.amount;
      } else if (next.frequency === Frequency.YEARLY) {
        const monthly = (next.amount / 12).toFixed(2);
        acum += Number(monthly);
      }

      return acum;
    }, 0);
  });

  const categoriesCount = computed(() => {
    const categoriesObj = toValue(expenses).reduce(
      (acum: Record<string, boolean>, next: Expense) => {
        acum[next.category] = true;
        return acum;
      },
      {},
    );

    return Object.keys(categoriesObj).length;
  });

  return {
    yearlyExpenses,
    monthlyExpenses,
    categoriesCount,
  };
};
