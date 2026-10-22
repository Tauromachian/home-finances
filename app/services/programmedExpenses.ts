import type {
  FormProgrammedExpense,
  ProgrammedExpense,
} from "../types/expense";
import { FetchNotOkError } from "../utils/errors";

export async function getProgrammedExpenses(): Promise<ProgrammedExpense[]> {
  const res = await fetch("/api/programmed-expenses");

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }

  const data = await res.json();
  return data.data as ProgrammedExpense[];
}

export async function createProgrammedExpense(
  form: FormProgrammedExpense,
): Promise<void> {
  const res = await fetch("/api/programmed-expenses", {
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

export async function updateProgrammedExpense(
  id: number | string,
  form: FormProgrammedExpense,
): Promise<void> {
  const res = await fetch(`/api/programmed-expenses/${id}`, {
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

export async function deleteProgrammedExpense(
  id: number | string,
): Promise<void> {
  const res = await fetch(`/api/programmed-expenses/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }
}
