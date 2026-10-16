import type { ProgrammedIncome } from "../types/income";
import { FetchNotOkError } from "../utils/errors";

export async function getProgrammedIncomes(): Promise<ProgrammedIncome[]> {
  const res = await fetch("/api/programmed-incomes");

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }

  const data = await res.json();
  return data.data as ProgrammedIncome[];
}

export async function createProgrammedIncome(
  form: ProgrammedIncome,
): Promise<void> {
  const res = await fetch("/api/programmed-incomes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }
}

export async function updateProgrammedIncome(
  id: number | string,
  form: ProgrammedIncome,
): Promise<void> {
  const res = await fetch(`/api/programmed-incomes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }
}

export async function deleteProgrammedIncome(
  id: number | string,
): Promise<void> {
  const res = await fetch(`/api/programmed-incomes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }
}
