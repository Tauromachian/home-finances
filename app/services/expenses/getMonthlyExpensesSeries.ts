import type { Expense } from "../../types/expense";
import { Frequency } from "../../types/frequency";

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Buckets expenses into one total per month, from January up to (and
 * excluding) the current month. Each expense contributes its monthly
 * amount to every month in range — yearly expenses are split into
 * twelfths, like in the monthly breakdown chart.
 */
export function getMonthlyExpensesSeries(
  expenses: Expense[],
  now: Date = new Date(),
): { labels: string[]; totals: number[] } {
  const labels: string[] = [];
  const totals: number[] = [];

  const monthlyTotal = expenses.reduce((sum, expense) => {
    if (expense.frequency === Frequency.YEARLY) {
      return sum + Math.floor(expense.amount / 12);
    }

    return sum + expense.amount;
  }, 0);

  const lastMonthIndex = now.getMonth() - 1;

  for (let month = 0; month <= lastMonthIndex; month++) {
    labels.push(MONTH_LABELS[month]);
    totals.push(monthlyTotal);
  }

  return { labels, totals };
}
