import { describe, expect, it } from "vitest";

import { validateChargeSchedule } from "../../server/utils/programmedExpense";

describe("validateChargeSchedule", () => {
  it("Accepts a monthly expense without a month", () => {
    expect(
      validateChargeSchedule({
        frequency: "monthly",
        chargeDay: 15,
      }),
    ).toEqual({
      ok: true,
      value: { frequency: "monthly", chargeDay: 15, chargeMonth: null },
    });
  });

  it("Forces the month to null for non-yearly frequencies", () => {
    expect(
      validateChargeSchedule({
        frequency: "monthly",
        chargeDay: 1,
        chargeMonth: 5,
      }),
    ).toEqual({
      ok: true,
      value: { frequency: "monthly", chargeDay: 1, chargeMonth: null },
    });
  });

  it("Accepts a yearly expense with a valid month", () => {
    expect(
      validateChargeSchedule({
        frequency: "yearly",
        chargeDay: 10,
        chargeMonth: 3,
      }),
    ).toEqual({
      ok: true,
      value: { frequency: "yearly", chargeDay: 10, chargeMonth: 3 },
    });
  });

  it("Rejects a yearly expense without a month", () => {
    const result = validateChargeSchedule({
      frequency: "yearly",
      chargeDay: 10,
    });

    expect(result.ok).toBe(false);
  });

  it("Rejects out-of-range day and month values", () => {
    expect(
      validateChargeSchedule({ frequency: "monthly", chargeDay: 0 }).ok,
    ).toBe(false);
    expect(
      validateChargeSchedule({ frequency: "monthly", chargeDay: 32 }).ok,
    ).toBe(false);
    expect(
      validateChargeSchedule({
        frequency: "yearly",
        chargeDay: 10,
        chargeMonth: 13,
      }).ok,
    ).toBe(false);
    expect(
      validateChargeSchedule({ frequency: "monthly", chargeDay: 1.5 }).ok,
    ).toBe(false);
  });

  it("Rejects a missing or unknown frequency", () => {
    expect(validateChargeSchedule({ chargeDay: 1 }).ok).toBe(false);
    expect(
      validateChargeSchedule({ frequency: "fortnightly", chargeDay: 1 }).ok,
    ).toBe(false);
  });
});
