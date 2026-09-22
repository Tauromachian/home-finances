/**
 * Market snapshot upkeep: refresh the tracked list on boot and every
 * 15 minutes so all clients share one warm snapshot (a single 3-symbol
 * upstream batch call per tick = 288 credits/day, well inside the free tier).
 */

import {
  MARKET_TRACKED_REFRESH_MS,
  refreshTrackedSymbols,
} from "../utils/marketSnapshot";
import { useLogger } from "../utils/logger";

export default defineNitroPlugin(() => {
  const logger = useLogger("market-snapshot");
  const { marketApiKey } = useRuntimeConfig();

  if (!marketApiKey) {
    logger.error(
      "Missing NUXT_MARKET_API_KEY, market snapshot refresh disabled",
    );
    return;
  }

  refreshTrackedSymbols(marketApiKey).catch((error: unknown) => {
    logger.error(
      "Initial market snapshot refresh failed",
      error instanceof Error ? error.message : error,
    );
  });

  setInterval(() => {
    refreshTrackedSymbols(marketApiKey).catch((error: unknown) => {
      logger.error(
        "Periodic market snapshot refresh failed",
        error instanceof Error ? error.message : error,
      );
    });
  }, MARKET_TRACKED_REFRESH_MS);
});
