import type { Expense } from "../types/expense";
import {
  elapsedMonths,
  isInRange,
  listMonthsInRange,
  parseIsoDate,
  round2,
} from "../utils/expensePeriod";

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
 * When a start/end range is given, buckets one total per month inside
 * the range instead.
 */
export function getMonthlyExpensesSeries(
  expenses: Expense[],
  now: Date = new Date(),
  range?: { start?: string | null; end?: string | null },
): { labels: string[]; totals: number[] } {
  const labels: string[] = [];
  const totals: number[] = [];

  if (range?.start || range?.end) {
    const monthsInRange = listMonthsInRange(range?.start, range?.end);
    const totalsByMonth = new Map<string, number>();

    for (const expense of expenses ?? []) {
      if (!isInRange(expense.expenseDate, range?.start, range?.end)) continue;

      const parsed = parseIsoDate(expense.expenseDate);
      if (!parsed) continue;

      const key = `${parsed.year}-${parsed.month}`;
      totalsByMonth.set(
        key,
        round2((totalsByMonth.get(key) ?? 0) + Number(expense.amount)),
      );
    }

    const singleYear =
      monthsInRange.length > 0 &&
      monthsInRange.every((month) => month.year === monthsInRange[0].year);

    for (const { year, month } of monthsInRange) {
      labels.push(
        singleYear
          ? MONTH_LABELS[month - 1]
          : `${MONTH_LABELS[month - 1]} ${String(year).slice(2)}`,
      );
      totals.push(totalsByMonth.get(`${year}-${month}`) ?? 0);
    }

    return { labels, totals };
  }

  const elapsed = elapsedMonths(now);
  const totalsByMonth = new Array<number>(elapsed).fill(0);

  for (const expense of expenses ?? []) {
    const parsed = parseIsoDate(expense.expenseDate);

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
