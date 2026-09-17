import { describe, expect, it } from "vitest";

import { isInScope } from "../../app/composables/useGroups";

describe("isInScope", () => {
  it("Personal scope only matches personal records", () => {
    expect(isInScope(null, null)).toBe(true);
    expect(isInScope(undefined, null)).toBe(true);
    expect(isInScope(3, null)).toBe(false);
  });

  it("Group scope only matches that group's records", () => {
    expect(isInScope(3, 3)).toBe(true);
    expect(isInScope(null, 3)).toBe(false);
    expect(isInScope(4, 3)).toBe(false);
  });
});
