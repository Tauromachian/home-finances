/**
 * Qualified market symbol: `SYM` or `SYM/EXCH` (e.g. "AAPL", "SAP/XFRA").
 * Uppercase alphanumerics plus `.`/`-` in the symbol part; exchange part is
 * 1-6 uppercase alphanumerics. Max 32 chars (matches the DB column).
 */
const MARKET_SYMBOL_RE = /^[A-Z0-9.-]{1,12}(?:\/[A-Z0-9]{1,6})?$/;

export function normalizeMarketSymbol(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") {
    throw createError({ status: 400, statusText: "Invalid marketSymbol" });
  }

  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");

  if (normalized === "") return null;
  if (normalized.length > 32 || !MARKET_SYMBOL_RE.test(normalized)) {
    throw createError({ status: 400, statusText: "Invalid marketSymbol" });
  }

  return normalized;
}
