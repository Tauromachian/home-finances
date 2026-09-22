import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  fetchTwelveDataQuotes,
  MarketUpstreamError,
  mergeQuoteEntries,
  normalizeSymbols,
} from "../../server/utils/twelveData";

function stubFetch(payload: unknown) {
  vi.stubGlobal("$fetch", vi.fn().mockResolvedValue(payload));
}

function stubFetchReject(error: unknown) {
  vi.stubGlobal("$fetch", vi.fn().mockRejectedValue(error));
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("normalizeSymbols", () => {
  it("dedupes and normalizes a comma-separated param", () => {
    expect(normalizeSymbols(" aapl,SAP/XFRA,AAPL")).toEqual([
      "AAPL",
      "SAP/XFRA",
    ]);
  });

  it("accepts arrays and empty input when allowed", () => {
    expect(normalizeSymbols(["AAPL", "msft"])).toEqual(["AAPL", "MSFT"]);
    expect(normalizeSymbols("", { allowEmpty: true })).toEqual([]);
    expect(normalizeSymbols(undefined, { allowEmpty: true })).toEqual([]);
  });

  it("rejects empty, oversized, and malformed input", () => {
    expect(() => normalizeSymbols("")).toThrow("Invalid symbols parameter");
    expect(() => normalizeSymbols("AAPL;DROP")).toThrow("Invalid symbol");
    expect(() => normalizeSymbols("A".repeat(13))).toThrow("Invalid symbol");
    expect(() =>
      normalizeSymbols(Array.from({ length: 121 }, (_, i) => `SYM${i}`)),
    ).toThrow("Invalid symbols parameter");
  });
});

describe("mergeQuoteEntries", () => {
  it("adds fresh quotes and keeps last-good on invalid rows", () => {
    const current = {
      AAPL: {
        symbol: "AAPL",
        name: "Apple Inc",
        exchange: "NASDAQ",
        currency: "USD",
        price: 200,
        asOf: "2026-09-21",
      },
    };

    const next = mergeQuoteEntries(current, {
      "SAP/XFRA": {
        symbol: "SAP/XFRA",
        name: "SAP SE",
        exchange: "XETRA",
        currency: "EUR",
        price: 250,
        asOf: "2026-09-21",
      },
      BROKEN: {
        symbol: "BROKEN",
        name: null,
        exchange: null,
        currency: null,
        price: Number.NaN,
        asOf: null,
      },
    });

    expect(Object.keys(next).sort()).toEqual(["AAPL", "SAP/XFRA"]);
    expect(next["SAP/XFRA"].price).toBe(250);
  });
});

describe("fetchTwelveDataQuotes", () => {
  it("maps a single-symbol quote", async () => {
    stubFetch({
      symbol: "AAPL",
      name: "Apple Inc",
      exchange: "NASDAQ",
      currency: "USD",
      datetime: "2026-09-21",
      close: "200.50",
    });

    const result = await fetchTwelveDataQuotes(["AAPL"], "key");

    expect(result).toEqual({
      quotes: {
        AAPL: {
          symbol: "AAPL",
          name: "Apple Inc",
          exchange: "NASDAQ",
          currency: "USD",
          price: 200.5,
          asOf: "2026-09-21",
        },
      },
      missing: [],
    });
  });

  it("translates `/` qualifiers and falls back across key forms", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      "SAP:XFRA": {
        symbol: "SAP",
        name: "SAP SE",
        exchange: "XETRA",
        currency: "EUR",
        datetime: "2026-09-21",
        close: "250",
      },
      MSFT: {
        symbol: "MSFT",
        name: "Microsoft Corp",
        exchange: "NASDAQ",
        currency: "USD",
        datetime: "2026-09-21",
        close: "500",
      },
    });
    vi.stubGlobal("$fetch", fetchMock);

    const result = await fetchTwelveDataQuotes(["SAP/XFRA", "MSFT"], "key");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.twelvedata.com/quote",
      expect.objectContaining({
        params: expect.objectContaining({ symbol: "SAP:XFRA,MSFT" }),
      }),
    );
    expect(Object.keys(result.quotes).sort()).toEqual(["MSFT", "SAP/XFRA"]);
    expect(result.missing).toEqual([]);
  });

  it("reports error rows as missing", async () => {
    stubFetch({
      AAPL: {
        symbol: "AAPL",
        name: "Apple Inc",
        exchange: "NASDAQ",
        currency: "USD",
        datetime: "2026-09-21",
        close: "200",
      },
      NOPE: { status: "error", message: "not found" },
    });

    const result = await fetchTwelveDataQuotes(["AAPL", "NOPE"], "key");

    expect(Object.keys(result.quotes)).toEqual(["AAPL"]);
    expect(result.missing).toEqual(["NOPE"]);
  });

  it("flags rate-limited error payloads", async () => {
    stubFetch({ status: "error", code: 429, message: "slow down" });

    const error = await fetchTwelveDataQuotes(["AAPL"], "key").catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(MarketUpstreamError);
    expect((error as MarketUpstreamError).rateLimited).toBe(true);
  });

  it("flags rate-limited network failures", async () => {
    stubFetchReject({ response: { status: 429 } });

    const error = await fetchTwelveDataQuotes(["AAPL"], "key").catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(MarketUpstreamError);
    expect((error as MarketUpstreamError).rateLimited).toBe(true);
  });

  it("wraps generic failures as non-rate-limited", async () => {
    stubFetchReject(new Error("boom"));

    const error = await fetchTwelveDataQuotes(["AAPL"], "key").catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(MarketUpstreamError);
    expect((error as MarketUpstreamError).rateLimited).toBe(false);
    expect((error as Error).message).toBe("Market data upstream unavailable");
  });
});
