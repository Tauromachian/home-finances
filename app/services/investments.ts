import type { Investment } from "../types/investment";

export async function getInvestments(): Promise<Investment[]> {
  const res = await fetch("/api/investments");
  const data = await res.json();
  return ((data.data ?? []) as Investment[]).map((row) => ({
    ...row,
    marketSymbol: row.marketSymbol ?? null,
  }));
}

export async function createInvestment(investment: Investment): Promise<void> {
  await fetch("/api/investments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(investment),
  });
}

export async function updateInvestment(
  id: number | string,
  investment: Investment,
): Promise<void> {
  await fetch(`/api/investments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(investment),
  });
}

export async function deleteInvestment(id: number | string): Promise<void> {
  await fetch(`/api/investments/${id}`, { method: "DELETE" });
}
