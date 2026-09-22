/**
 * Pure (framework-free) market helpers: local search over the downloaded
 * snapshot, gain math vs cost, and submit-time value resolution.
 * No network here — fetching and snapshot state live on the backend
 * (`server/utils/marketSnapshot.ts` + `GET /api/market/snapshot`).
 */

export type MarketEntry = {
  symbol: string;
  name: string | null;
  exchange: string | null;
  currency: string | null;
  price: number | null;
  asOf: string | null;
};

export type MarketSnapshot = Record<string, MarketEntry>;

function normalizeQuery(query: string): string {
  return query
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Local-only search: symbol-prefix matches first, then name-substring.
 * Used at select time so typing never hits the network.
 */
export function searchMarketEntries(
  snapshot: MarketSnapshot,
  query: string,
  limit = 20,
): MarketEntry[] {
  const q = normalizeQuery(query);
  if (!q) return [];

  const entries = Object.values(snapshot).filter(
    (e) => e.price !== null && e.price !== undefined,
  );

  const prefix: MarketEntry[] = [];
  const symbolHit: MarketEntry[] = [];
  const nameHit: MarketEntry[] = [];

  for (const entry of entries) {
    const symbol = entry.symbol.toUpperCase();
    const name = (entry.name ?? "").toUpperCase();

    if (symbol.startsWith(q)) prefix.push(entry);
    else if (symbol.includes(q)) symbolHit.push(entry);
    else if (name.includes(q)) nameHit.push(entry);
  }

  const rank = (list: MarketEntry[]) =>
    list.sort((a, b) => a.symbol.localeCompare(b.symbol));

  return [...rank(prefix), ...rank(symbolHit), ...rank(nameHit)].slice(
    0,
    limit,
  );
}

/** Movement vs cost (1 unit assumption — holdings carry no share count). */
export function gainVsCost(
  livePrice: number | null | undefined,
  amount: number,
): { gain: number | null; returnPct: number | null } {
  if (
    livePrice === null ||
    livePrice === undefined ||
    !Number.isFinite(livePrice)
  ) {
    return { gain: null, returnPct: null };
  }

  const gain = livePrice - amount;
  return { gain, returnPct: amount > 0 ? (gain / amount) * 100 : null };
}

/**
 * Current value for a form submit: the live quote when the holding tracks a
 * symbol with a known price, otherwise the manually entered value.
 * Returns null when neither is available (caller must abort the submit).
 */
export function resolveCurrentValue(
  marketSymbol: string | null | undefined,
  manualValue: unknown,
  lookupPrice: (symbol: string) => number | null,
): number | null {
  const symbol = marketSymbol?.trim().toUpperCase().replace(/\s+/g, "");

  if (symbol) {
    const live = lookupPrice(symbol);
    if (live !== null && Number.isFinite(live)) return live;
  }

  if (manualValue === null || manualValue === undefined || manualValue === "") {
    return null;
  }

  const manual = Number(manualValue);
  return Number.isFinite(manual) ? manual : null;
}
