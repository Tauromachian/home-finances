import {
  searchMarketEntries,
  type MarketEntry,
  type MarketSnapshot,
} from "~/utils/market";

export type MarketStatus =
  | "idle"
  | "loading"
  | "live"
  | "stale"
  | "error"
  | "unconfigured";

export const MARKET_REFRESH_MS = 5 * 60 * 1000;

type SnapshotResponse = {
  entries: MarketSnapshot;
  lastRefresh: string | null;
  missing: string[];
  status: "loading" | "live" | "stale" | "error";
};

/**
 * Market snapshot client: the snapshot itself (fetch + merge + state +
 * 5-minute upkeep) lives on the backend (`server/utils/marketSnapshot.ts`,
 * `server/plugins/market-snapshot.ts`, `GET /api/market/snapshot`).
 *
 * This composable only downloads that state, polls it on the same cadence,
 * and filters it locally so typing never hits the network; gain math
 * happens in computed getters downstream.
 */
export function useMarketSnapshot() {
  const snapshot = ref<MarketSnapshot>({});
  const status = ref<MarketStatus>("idle");
  const lastRefresh = ref<string | null>(null);
  const missing = ref<string[]>([]);

  let timer: ReturnType<typeof setInterval> | null = null;
  let inFlight: Promise<void> | null = null;
  let visibilityHandler: (() => void) | null = null;

  async function refresh(symbols: string[]): Promise<void> {
    if (inFlight) return inFlight;

    if (!Object.keys(snapshot.value).length) status.value = "loading";

    inFlight = (async () => {
      try {
        const data = await $fetch<SnapshotResponse>("/api/market/snapshot", {
          params: { symbols: symbols.join(",") },
        });

        snapshot.value = data.entries ?? {};
        missing.value = data.missing ?? [];
        lastRefresh.value = data.lastRefresh ?? null;
        status.value = data.status ?? "live";
      } catch (error: unknown) {
        const fetched = error as
          | { response?: { status?: unknown }; statusCode?: unknown }
          | null
          | undefined;
        const code = fetched?.response?.status ?? fetched?.statusCode;
        status.value =
          code === 503
            ? "unconfigured"
            : Object.keys(snapshot.value).length
              ? "stale"
              : "error";
      } finally {
        inFlight = null;
      }
    })();

    return inFlight;
  }

  function search(query: string, limit = 20): MarketEntry[] {
    return searchMarketEntries(snapshot.value, query, limit);
  }

  function entry(symbol: string): MarketEntry | null {
    return snapshot.value[symbol] ?? null;
  }

  function startAutoRefresh(getSymbols: () => string[]) {
    stopAutoRefresh();
    refresh(getSymbols());

    timer = setInterval(() => {
      if (document.visibilityState !== "hidden") refresh(getSymbols());
    }, MARKET_REFRESH_MS);

    visibilityHandler = () => {
      if (document.visibilityState === "visible") refresh(getSymbols());
    };
    document.addEventListener("visibilitychange", visibilityHandler);
  }

  function stopAutoRefresh() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (visibilityHandler) {
      document.removeEventListener("visibilitychange", visibilityHandler);
      visibilityHandler = null;
    }
  }

  onUnmounted(() => stopAutoRefresh());

  return {
    snapshot,
    status,
    lastRefresh,
    missing,
    refresh,
    search,
    entry,
    startAutoRefresh,
    stopAutoRefresh,
  };
}
