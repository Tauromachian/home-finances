import type { ProgrammedIncome } from "../types/income";

export async function getProgrammedIncomes(): Promise<ProgrammedIncome[]> {
  const res = await fetch("/api/programmed-incomes");
  const data = await res.json();
  return data.data as ProgrammedIncome[];
}
