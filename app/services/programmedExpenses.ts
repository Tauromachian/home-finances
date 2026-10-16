import type { ProgrammedExpense } from "../types/expense";

export async function getProgrammedExpenses(): Promise<ProgrammedExpense[]> {
  const res = await fetch("/api/programmed-expenses");
  const data = await res.json();
  return data.data as ProgrammedExpense[];
}

export async function createProgrammedExpense(
  form: ProgrammedExpense,
): Promise<void> {
  await fetch("/api/programmed-expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
}

export async function updateProgrammedExpense(
  id: number | string,
  form: ProgrammedExpense,
): Promise<void> {
  await fetch(`/api/programmed-expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
}

export async function deleteProgrammedExpense(
  id: number | string,
): Promise<void> {
  await fetch(`/api/programmed-expenses/${id}`, { method: "DELETE" });
}
