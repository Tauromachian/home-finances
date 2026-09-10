import { describe, expect, it } from "vitest";

import { chargeDay } from "../../app/utils/rules";

describe("chargeDay", () => {
  it("Accepts days between 1 and 31", () => {
    expect(chargeDay(1)).toBe(true);
    expect(chargeDay(15)).toBe(true);
    expect(chargeDay(31)).toBe(true);
    expect(chargeDay("7")).toBe(true);
  });

  it("Rejects days outside 1-31", () => {
    expect(chargeDay(0)).toBe("This field needs to be a day between 1 and 31");
    expect(chargeDay(32)).toBe("This field needs to be a day between 1 and 31");
    expect(chargeDay(1.5)).toBe(
      "This field needs to be a day between 1 and 31",
    );
    expect(chargeDay("abc")).toBe(
      "This field needs to be a day between 1 and 31",
    );
  });

  it("Requires a value", () => {
    expect(chargeDay("")).toBe("This field is required");
    expect(chargeDay(null)).toBe("This field is required");
    expect(chargeDay(undefined)).toBe("This field is required");
  });
});
