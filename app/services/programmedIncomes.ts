import type { ProgrammedIncome } from "../types/income";
import { FetchNotOkError } from "~~/server/utils/errors";

export async function getProgrammedIncomes(): Promise<ProgrammedIncome[]> {
  const res = await fetch("/api/programmed-incomes");

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }

  const data = await res.json();
  return data.data as ProgrammedIncome[];
}
