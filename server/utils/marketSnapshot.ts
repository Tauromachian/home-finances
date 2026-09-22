/**
 * In-memory market snapshot store (backend-owned).
 *
 * Holds the downloaded names + prices for the tracked list plus any
 * user-linked symbols clients have asked about. A Nitro plugin refreshes the
 * tracked list on boot and every `MARKET_TRACKED_REFRESH_MS` (15 minutes:
 * 3 symbols × 96 ticks = 288 credits/day, well inside the free tier);
 * the snapshot endpoint serves this state instantly and only hits TwelveData
 * for symbols that are absent (e.g. a freshly linked stock). One upstream
 * batch call serves all users, keeping the free tier (8 req/min) safe.
 *
 * No database access: linked symbols arrive per request from the client.
 */

import { useLogger } from "./logger";
import { TRACKED_SYMBOLS } from "./trackedSymbols";
import {
  fetchTwelveDataQuotes,
  mergeQuoteEntries,
  type MarketQuoteEntry,
} from "./twelveData";

export const MARKET_TRACKED_REFRESH_MS = 15 * 60 * 1000;
const STALE_AFTER_MS = 2 * MARKET_TRACKED_REFRESH_MS;

export type MarketSnapshotStatus = "loading" | "live" | "stale" | "error";

export type MarketSnapshotState = {
  entries: Record<string, MarketQuoteEntry>;
  lastRefresh: string | null;
  missing: string[];
  status: MarketSnapshotStatus;
};

const logger = useLogger("market-snapshot");

let entries: Record<string, MarketQuoteEntry> = {};
let lastRefresh: string | null = null;
let missing: string[] = [];
let failed = false;
let inFlight: Promise<void> | null = null;

function statusOf(): MarketSnapshotStatus {
  if (!Object.keys(entries).length) return failed ? "error" : "loading";
  if (!lastRefresh) return "stale";
  return Date.now() - new Date(lastRefresh).getTime() > STALE_AFTER_MS
    ? "stale"
    : "live";
}

export function getMarketSnapshot(): MarketSnapshotState {
  return { entries, lastRefresh, missing, status: statusOf() };
}

async function refreshSymbols(
  symbols: string[],
  apiKey: string,
): Promise<void> {
  if (!symbols.length) return;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const result = await fetchTwelveDataQuotes(symbols, apiKey);
      entries = mergeQuoteEntries(entries, result.quotes);
      missing = result.missing;
      lastRefresh = new Date().toISOString();
      failed = false;

      if (missing.length) {
        logger.warn(`No quote for symbol(s): ${missing.join(",")}`);
      }
    } catch (error: unknown) {
      failed = true;
      logger.error(
        "Market snapshot refresh failed",
        error instanceof Error ? error.message : error,
      );
      throw error;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Ensure the store covers `requested` symbols, then return the snapshot.
 * Cold store → full tracked + requested fetch (the entry petition).
 * Warm store → only absent symbols are fetched; freshness of the rest is
 * the plugin timer's job. When upstream fails but data exists, the stale
 * snapshot is served instead of throwing.
 */
export async function ensureMarketSymbols(
  requested: string[],
  apiKey: string,
): Promise<MarketSnapshotState> {
  const valid = [...new Set(requested)].filter((s) => s);

  try {
    if (!Object.keys(entries).length) {
      await refreshSymbols([...TRACKED_SYMBOLS, ...valid], apiKey);
    } else {
      const absent = valid.filter((s) => !(s in entries));
      if (absent.length) await refreshSymbols(absent, apiKey);
    }
  } catch (error: unknown) {
    if (!Object.keys(entries).length) throw error;
    logger.warn("Serving stale market snapshot after refresh failure");
  }

  return getMarketSnapshot();
}

/** Plugin timer tick: refresh the suggestion list. */
export async function refreshTrackedSymbols(apiKey: string): Promise<void> {
  await refreshSymbols([...TRACKED_SYMBOLS], apiKey);
}
