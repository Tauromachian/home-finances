import { describe, expect, it } from "vitest";

import {
  gainVsCost,
  resolveCurrentValue,
  searchMarketEntries,
  type MarketSnapshot,
} from "../../app/utils/market";

const SNAPSHOT: MarketSnapshot = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc",
    exchange: "NASDAQ",
    currency: "USD",
    price: 200,
    asOf: "2026-09-21",
  },
  "SAP/XFRA": {
    symbol: "SAP/XFRA",
    name: "SAP SE",
    exchange: "XETRA",
    currency: "EUR",
    price: 250,
    asOf: "2026-09-21",
  },
  "MC/XPAR": {
    symbol: "MC/XPAR",
    name: "LVMH Moet Hennessy Louis Vuitton SE",
    exchange: "Euronext Paris",
    currency: "EUR",
    price: 700,
    asOf: "2026-09-21",
  },
};

describe("searchMarketEntries", () => {
  it("returns nothing for empty queries", () => {
    expect(searchMarketEntries(SNAPSHOT, "")).toEqual([]);
    expect(searchMarketEntries(SNAPSHOT, "   ")).toEqual([]);
  });

  it("ranks symbol-prefix above symbol-substring above name", () => {
    // "SAP/XFRA" contains "A" but does not start with it; "AAPL" does.
    const results = searchMarketEntries(SNAPSHOT, "a");
    expect(results[0].symbol).toBe("AAPL");
  });

  it("finds by company name case-insensitively", () => {
    const results = searchMarketEntries(SNAPSHOT, "lvmh");
    expect(results.map((r) => r.symbol)).toEqual(["MC/XPAR"]);
  });

  it("respects the limit", () => {
    expect(searchMarketEntries(SNAPSHOT, "a", 1)).toHaveLength(1);
  });
});

describe("gainVsCost", () => {
  it("computes gain and return vs cost", () => {
    expect(gainVsCost(250, 200)).toEqual({ gain: 50, returnPct: 25 });
    expect(gainVsCost(150, 200)).toEqual({ gain: -50, returnPct: -25 });
  });

  it("returns null return when cost is zero", () => {
    expect(gainVsCost(150, 0)).toEqual({ gain: 150, returnPct: null });
  });

  it("returns nulls without a live price", () => {
    expect(gainVsCost(null, 200)).toEqual({ gain: null, returnPct: null });
    expect(gainVsCost(undefined, 200)).toEqual({ gain: null, returnPct: null });
    expect(gainVsCost(Number.NaN, 200)).toEqual({
      gain: null,
      returnPct: null,
    });
  });
});

describe("resolveCurrentValue", () => {
  const lookup = (symbol: string) =>
    symbol === "AAPL" ? 200 : symbol === "BROKEN" ? Number.NaN : null;

  it("prefers the live quote for tracked symbols", () => {
    expect(resolveCurrentValue("aapl", 150, lookup)).toBe(200);
    expect(resolveCurrentValue(" AAPL ", undefined, lookup)).toBe(200);
  });

  it("falls back to the manual value without a live price", () => {
    expect(resolveCurrentValue("UNKNOWN", 150, lookup)).toBe(150);
    expect(resolveCurrentValue(null, 150, lookup)).toBe(150);
    expect(resolveCurrentValue("", 150, lookup)).toBe(150);
    expect(resolveCurrentValue("BROKEN", 150, lookup)).toBe(150);
  });

  it("returns null when neither source has a value", () => {
    expect(resolveCurrentValue("UNKNOWN", undefined, lookup)).toBeNull();
    expect(resolveCurrentValue("UNKNOWN", "", lookup)).toBeNull();
    expect(resolveCurrentValue(null, null, lookup)).toBeNull();
  });
});
