import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createInvestment,
  deleteInvestment,
  getInvestments,
  updateInvestment,
} from "../../app/services/investments";
import type { Investment } from "../../app/types/investment";

const INVESTMENT: Investment = {
  id: 1,
  name: "Apple",
  category: "Stocks/ETFs",
  amount: 100,
  currentValue: 200,
  description: "",
  marketSymbol: "AAPL",
};

function stubFetch(payload: unknown = {}) {
  const mock = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(payload),
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("getInvestments", () => {
  it("returns rows and defaults marketSymbol to null", async () => {
    stubFetch({
      data: [{ ...INVESTMENT, marketSymbol: undefined }, INVESTMENT],
    });

    const result = await getInvestments();

    expect(result).toHaveLength(2);
    expect(result[0].marketSymbol).toBeNull();
    expect(result[1].marketSymbol).toBe("AAPL");
  });

  it("returns an empty list without data", async () => {
    stubFetch({});

    await expect(getInvestments()).resolves.toEqual([]);
  });
});

describe("createInvestment", () => {
  it("POSTs the investment as JSON", async () => {
    const fetchMock = stubFetch();

    await createInvestment(INVESTMENT);

    expect(fetchMock).toHaveBeenCalledWith("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(INVESTMENT),
    });
  });
});

describe("updateInvestment", () => {
  it("PUTs the investment to its URL", async () => {
    const fetchMock = stubFetch();

    await updateInvestment(1, INVESTMENT);

    expect(fetchMock).toHaveBeenCalledWith("/api/investments/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(INVESTMENT),
    });
  });
});

describe("deleteInvestment", () => {
  it("DELETEs the investment URL", async () => {
    const fetchMock = stubFetch();

    await deleteInvestment(1);

    expect(fetchMock).toHaveBeenCalledWith("/api/investments/1", {
      method: "DELETE",
    });
  });
});
