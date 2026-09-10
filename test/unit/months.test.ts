import { describe, expect, it } from "vitest";

import { getMonthTitle, parseMonthValue } from "../../app/utils/months";

describe("getMonthTitle", () => {
  it("Resolves month numbers and numeric strings to titles", () => {
    expect(getMonthTitle(1)).toBe("January");
    expect(getMonthTitle("6")).toBe("June");
    expect(getMonthTitle(12)).toBe("December");
  });

  it("Returns empty string for missing values", () => {
    expect(getMonthTitle(null)).toBe("");
    expect(getMonthTitle(undefined)).toBe("");
    expect(getMonthTitle("")).toBe("");
  });
});

describe("parseMonthValue", () => {
  it("Parses month numbers, numeric strings and titles", () => {
    expect(parseMonthValue(6)).toBe(6);
    expect(parseMonthValue("6")).toBe(6);
    expect(parseMonthValue("June")).toBe(6);
    expect(parseMonthValue("june")).toBe(6);
  });

  it("Returns null for missing or invalid values", () => {
    expect(parseMonthValue(null)).toBeNull();
    expect(parseMonthValue(undefined)).toBeNull();
    expect(parseMonthValue("")).toBeNull();
    expect(parseMonthValue("Not a month")).toBeNull();
    expect(parseMonthValue(0)).toBeNull();
    expect(parseMonthValue(13)).toBeNull();
  });
});
