/**
 * TwelveData market-data client.
 *
 * Dependency-free on purpose (no h3/Nuxt auto-imports): validation and
 * mapping throw plain `Error`s so this module stays importable from plain
 * Vitest. Route handlers translate them to HTTP errors.
 *
 * Symbols use the URL-safe qualified form `SYM/EXCH` (e.g. "SAP/XFRA");
 * the `/` is translated to TwelveData's `:` qualifier on the way out.
 */

export type MarketQuoteEntry = {
  symbol: string;
  name: string | null;
  exchange: string | null;
  currency: string | null;
  price: number | null;
  asOf: string | null;
};

export type MarketQuotesResult = {
  quotes: Record<string, MarketQuoteEntry>;
  missing: string[];
};

const SYMBOL_RE = /^[A-Z0-9.-]{1,12}(?:\/[A-Z0-9]{1,6})?$/;
const MAX_SYMBOLS = 120;

export class MarketUpstreamError extends Error {
  rateLimited: boolean;

  constructor(message: string, rateLimited = false) {
    super(message);
    this.name = "MarketUpstreamError";
    this.rateLimited = rateLimited;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalize + validate a comma-separated symbols param.
 * Throws a plain `Error` on invalid input (routes map it to a 400).
 */
export function normalizeSymbols(
  raw: unknown,
  opts: { allowEmpty?: boolean } = {},
): string[] {
  const str = Array.isArray(raw) ? raw.join(",") : String(raw ?? "");
  const unique = [
    ...new Set(
      str
        .split(",")
        .map((s) => s.trim().toUpperCase().replace(/\s+/g, ""))
        .filter(Boolean),
    ),
  ];

  if ((!unique.length && !opts.allowEmpty) || unique.length > MAX_SYMBOLS) {
    throw new Error("Invalid symbols parameter");
  }

  for (const symbol of unique) {
    if (!SYMBOL_RE.test(symbol)) {
      throw new Error(`Invalid symbol: ${symbol}`);
    }
  }

  return unique;
}

export function upstreamStatus(error: unknown): number | undefined {
  if (!isRecord(error)) return undefined;
  const response = error.response;
  const nested = isRecord(response) ? response.status : undefined;
  const flat = (error as { statusCode?: unknown }).statusCode;
  const status = nested ?? flat;
  return typeof status === "number" ? status : undefined;
}

function toQuoteEntry(
  canonical: string,
  raw: unknown,
): MarketQuoteEntry | null {
  if (!isRecord(raw) || raw.status === "error") return null;

  const price = Number(raw.close ?? raw.price);
  if (!Number.isFinite(price)) return null;

  return {
    symbol: canonical,
    name: typeof raw.name === "string" ? raw.name : null,
    exchange: typeof raw.exchange === "string" ? raw.exchange : null,
    currency: typeof raw.currency === "string" ? raw.currency : null,
    price,
    asOf: typeof raw.datetime === "string" ? raw.datetime : null,
  };
}

/** Merge upstream quotes into the snapshot, keeping last-good on gaps. */
export function mergeQuoteEntries(
  current: Record<string, MarketQuoteEntry>,
  incoming: Record<string, MarketQuoteEntry>,
): Record<string, MarketQuoteEntry> {
  const next: Record<string, MarketQuoteEntry> = { ...current };

  for (const [symbol, entry] of Object.entries(incoming)) {
    if (entry && Number.isFinite(entry.price as number)) {
      next[symbol] = entry;
    }
  }

  return next;
}

/**
 * One batched `/quote` call for up to 120 symbols.
 * Throws `MarketUpstreamError` when TwelveData is unreachable or refuses.
 */
export async function fetchTwelveDataQuotes(
  symbols: string[],
  apiKey: string,
): Promise<MarketQuotesResult> {
  const upstreamSymbols = symbols.map((s) => s.replace("/", ":"));

  let payload: unknown;
  try {
    payload = await $fetch<unknown>("https://api.twelvedata.com/quote", {
      params: {
        symbol: upstreamSymbols.join(","),
        interval: "1day",
        apikey: apiKey,
      },
      timeout: 150000,
    });
  } catch (error: unknown) {
    const rateLimited = upstreamStatus(error) === 429;
    throw new MarketUpstreamError(
      rateLimited
        ? "Market data rate limited, retry later"
        : "Market data upstream unavailable",
      rateLimited,
    );
  }

  const table = isRecord(payload) ? payload : {};
  if (table.status === "error") {
    const rateLimited = table.code === 429;
    throw new MarketUpstreamError(
      rateLimited
        ? "Market data rate limited, retry later"
        : "Market data upstream error",
      rateLimited,
    );
  }

  const quotes: Record<string, MarketQuoteEntry> = {};
  const missing: string[] = [];

  if (symbols.length === 1 && typeof symbols[0] === "string") {
    const key: string = symbols[0];
    const entry = toQuoteEntry(key, payload);
    if (entry) quotes[key] = entry;
    else missing.push(key);
  } else {
    for (const symbol of symbols) {
      // TwelveData keys batch responses by the bare or `:`-qualified
      // symbol; fall back through both before giving up on the row.
      const bare = symbol.split("/")[0] ?? symbol;
      const colon = symbol.replace("/", ":");
      const entry = toQuoteEntry(
        symbol,
        table[symbol] ?? table[colon] ?? table[bare],
      );
      if (entry) quotes[symbol] = entry;
      else missing.push(symbol);
    }
  }

  return { quotes, missing };
}
