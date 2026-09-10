import type { Expense } from "../types/expense";
import { elapsedMonths, parseIsoDate, round2 } from "../utils/expensePeriod";

export async function loadExpenses(): Promise<Expense[]> {
  const res = await fetch("/api/expenses");
  const data = await res.json();
  return data.data as Expense[];
}

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
 * Buckets actual expenses into one total per month, from January up to
 * (and excluding) the current month, based on each expense's date.
 */
export function getMonthlyExpensesSeries(
  expenses: Expense[],
  now: Date = new Date(),
): { labels: string[]; totals: number[] } {
  const labels: string[] = [];
  const totals: number[] = [];

  const elapsed = elapsedMonths(now);
  const totalsByMonth = new Array<number>(elapsed).fill(0);

  for (const expense of expenses ?? []) {
    const parsed = parseIsoDate(expense.date);

    if (!parsed) continue;
    if (parsed.year !== now.getFullYear()) continue;
    if (parsed.month < 1 || parsed.month > elapsed) continue;

    totalsByMonth[parsed.month - 1] = round2(
      totalsByMonth[parsed.month - 1] + Number(expense.amount),
    );
  }

  for (let month = 0; month < elapsed; month++) {
    labels.push(MONTH_LABELS[month]);
    totals.push(totalsByMonth[month]);
  }

  return { labels, totals };
}
