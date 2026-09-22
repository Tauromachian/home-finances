/**
 * Market snapshot endpoint (backend-owned state, no database access).
 *
 * GET /api/market/snapshot?symbols=AAPL,SAP/XFRA
 * -> { entries, lastRefresh, missing, status }
 *
 * `symbols` (optional) are the client's linked holdings: absent ones are
 * fetched on demand and merged into the shared store. The tracked list is
 * kept fresh by the `market-snapshot` Nitro plugin, so this endpoint is
 * usually instant and never hits TwelveData per user.
 */

import { ensureMarketSymbols } from "@@/server/utils/marketSnapshot";
import {
  MarketUpstreamError,
  normalizeSymbols,
} from "@@/server/utils/twelveData";
import { useLogger } from "@@/server/utils/logger";

const logger = useLogger("market-snapshot");

export default defineEventHandler(async (event) => {
  const { marketApiKey } = useRuntimeConfig(event);

  if (!marketApiKey) {
    throw createError({
      status: 503,
      statusText: "Market data not configured (NUXT_MARKET_API_KEY)",
    });
  }

  let symbols: string[];
  try {
    symbols = normalizeSymbols(getQuery(event).symbols, { allowEmpty: true });
  } catch {
    throw createError({ status: 400, statusText: "Invalid symbols parameter" });
  }

  try {
    return await ensureMarketSymbols(symbols, marketApiKey);
  } catch (error: unknown) {
    if (error instanceof MarketUpstreamError) {
      const message = error.rateLimited
        ? "Market data rate limited, retry later"
        : "Market data upstream unavailable";
      if (error.rateLimited) logger.warn(message);
      else logger.error(message);
      throw createError({ status: 502, statusText: message });
    }
    throw error;
  }
});
