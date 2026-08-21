import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";

import AppDialog from "~/components/AppDialog.vue";

describe("AppDialog", () => {
  const togglePopoverMock = vi.fn();

  beforeAll(() => {
    HTMLElement.prototype.togglePopover = togglePopoverMock;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("applies correct classes when open", async () => {
    mount(AppDialog, { props: { modelValue: true } });

    expect(document.body.querySelector("dialog").classList).toContain(
      "scale-100",
    );
    expect(document.body.querySelector("dialog").classList).toContain(
      "backdrop:opacity-40",
    );
  });

  it("applies correct classes when close", async () => {
    mount(AppDialog, { props: { modelValue: false } });

    expect(document.body.querySelector("dialog").classList).toContain(
      "scale-0",
    );
    expect(document.body.querySelector("dialog").classList).toContain(
      "backdrop:opacity-0",
    );
  });

  it("toggles between close and open correctly", async () => {
    const wrapper = mount(AppDialog, { props: { modelValue: false } });

    expect(document.body.querySelector("dialog").classList).toContain(
      "scale-0",
    );
    expect(document.body.querySelector("dialog").classList).toContain(
      "backdrop:opacity-0",
    );

    wrapper.setProps({ modelValue: true });
    await nextTick();

    expect(togglePopoverMock).toHaveBeenCalled();

    expect(document.body.querySelector("dialog").classList).toContain(
      "scale-100",
    );
    expect(document.body.querySelector("dialog").classList).toContain(
      "backdrop:opacity-40",
    );
  });
});
