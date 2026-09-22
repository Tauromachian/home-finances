/**
 * Suggestion list for index tracking (symbols only — no names, no prices).
 * Served from the backend: the market snapshot store refreshes this list on
 * boot and every 15 minutes, and clients download names + prices through
 * `GET /api/market/snapshot`.
 *
 * Only the three top indexes: S&P 500 (SPX) and Nasdaq Composite (IXIC) as
 * TwelveData index symbols, plus MSCI World via its canonical US-listed ETF
 * (URTH — TwelveData carries MSCI World exposure as ETFs, verified via
 * symbol_search). All bare US symbols, so no exchange qualifier is needed
 * and Basic-plan (US) coverage applies.
 */
export const TRACKED_SYMBOLS: readonly string[] = [
  // S&P 500 index
  "SPX",
  // Nasdaq Composite index
  "IXIC",
  // MSCI World (iShares MSCI World ETF, NYSE)
  "URTH",
];
