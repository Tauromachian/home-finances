import type { Expense } from "~/types/expense";

export async function loadExpenses(): Promise<Expense[]> {
  const res = await fetch("/api/expenses");
  const data = await res.json();
  return data.data as Expense[];
}
