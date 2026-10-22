import type { FormInvestment, Investment } from "../types/investment";
import { FetchNotOkError } from "../utils/errors";

export async function getInvestments(): Promise<Investment[]> {
  const res = await fetch("/api/investments");

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }

  const data = await res.json().catch(() => null);
  return ((data?.data ?? []) as Investment[]).map((row) => ({
    ...row,
    marketSymbol: row.marketSymbol ?? null,
  }));
}

export async function createInvestment(form: FormInvestment): Promise<void> {
  const res = await fetch("/api/investments", {
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

export async function updateInvestment(
  id: number | string,
  form: FormInvestment,
): Promise<void> {
  const res = await fetch(`/api/investments/${id}`, {
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

export async function deleteInvestment(id: number | string): Promise<void> {
  const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new FetchNotOkError(null, res.status);
  }
}
