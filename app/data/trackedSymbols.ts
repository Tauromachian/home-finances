/**
 * Suggestion list for stock tracking (symbols only — no names, no prices).
 * Names + prices are downloaded in one batched `/api/market/quotes` petition
 * on page entry and refreshed every 5 minutes.
 *
 * Qualified form `SYM/EXCH` disambiguates EU listings. The proxy translates
 * `/` to TwelveData's `:` qualifier upstream; the DB stores the `/` form.
 */
export const TRACKED_SYMBOLS: readonly string[] = [
  // US — large caps & broad ETFs
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "GOOGL",
  "META",
  "TSLA",
  "AVGO",
  "BRK.B",
  "JPM",
  "V",
  "XOM",
  "UNH",
  "JNJ",
  "SPY",
  "QQQ",
  // EU — XETRA (XFRA)
  "SAP/XFRA",
  "SIE/XFRA",
  "ALV/XFRA",
  "DTE/XFRA",
  "MBG/XFRA",
  // EU — Euronext Amsterdam (XAMS)
  "ASML/XAMS",
  "PRX/XAMS",
  "INGA/XAMS",
  // EU — Euronext Paris (XPAR)
  "MC/XPAR",
  "OR/XPAR",
  "AIR/XPAR",
  "SAN/XPAR",
  "TTE/XPAR",
  // EU — BME Spanish Exchange (XMAD)
  "SAN/XMAD",
  "IBE/XMAD",
  "BBVA/XMAD",
];
