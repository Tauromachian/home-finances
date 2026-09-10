import type { ProgrammedExpense } from "../types/expense";

export async function loadProgrammedExpenses(): Promise<ProgrammedExpense[]> {
  const res = await fetch("/api/programmed-expenses");
  const data = await res.json();
  return data.data as ProgrammedExpense[];
}
