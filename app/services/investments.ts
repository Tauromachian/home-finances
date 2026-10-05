import type { Investment } from "../types/investment";

async function handleResponse(res: Response, fallback: string) {
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? fallback);
  }
}

export async function getInvestments(): Promise<Investment[]> {
  const res = await fetch("/api/investments");
  await handleResponse(res, "Could not load investments");
  const data = await res.json().catch(() => null);
  return ((data?.data ?? []) as Investment[]).map((row) => ({
    ...row,
    marketSymbol: row.marketSymbol ?? null,
  }));
}

export async function createInvestment(investment: Investment): Promise<void> {
  const res = await fetch("/api/investments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(investment),
  });
  await handleResponse(res, "Could not create investment");
}

export async function updateInvestment(
  id: number | string,
  investment: Investment,
): Promise<void> {
  const res = await fetch(`/api/investments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(investment),
  });
  await handleResponse(res, "Could not update investment");
}

export async function deleteInvestment(id: number | string): Promise<void> {
  const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });
  await handleResponse(res, "Could not delete investment");
}
