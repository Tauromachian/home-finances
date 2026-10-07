import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import AppMenu from "~/components/AppMenu";

const activatorSlot = '<button class="trigger">Open</button>';
const defaultSlot = '<div class="menu-content">Hello</div>';

function mountMenu(props: Record<string, unknown> = {}, slots = {}) {
  return mount(
    AppMenu as never,
    {
      props,
      slots: {
        activator: activatorSlot,
        default: defaultSlot,
        ...slots,
      },
    } as never,
  );
}

describe("AppMenu", () => {
  it("wires the activator to the popover via popovertarget/id", () => {
    const wrapper = mountMenu();
    const trigger = wrapper.find(".trigger");
    const popover = wrapper.find("[popover]");

    expect(trigger.attributes("popovertarget")).toBe(popover.attributes("id"));
    expect(trigger.attributes("id")).toBeTruthy();
  });

  it("anchors the popover to the activator", () => {
    const wrapper = mountMenu();
    const trigger = wrapper.find(".trigger");
    const popover = wrapper.find("[popover]");

    expect(popover.attributes("anchor")).toBe(trigger.attributes("id"));
  });

  it("applies the default position (below, right-aligned)", () => {
    const wrapper = mountMenu();
    const popover = wrapper.find("[popover]");

    // NOTE: jsdom does not serialize the position-area property into the
    // style attribute, so assert on the value Vue assigned instead.
    expect(
      (popover.element as HTMLElement).style as unknown as Record<
        string,
        string
      >,
    ).toHaveProperty("positionArea", "bottom span-end");
  });

  it("applies a custom position from the outside", () => {
    const wrapper = mountMenu({ position: "top span-start" });
    const popover = wrapper.find("[popover]");

    expect(
      (popover.element as HTMLElement).style as unknown as Record<
        string,
        string
      >,
    ).toHaveProperty("positionArea", "top span-start");
  });

  it("renders the default slot content", () => {
    const wrapper = mountMenu();

    expect(wrapper.find(".menu-content").text()).toBe("Hello");
  });

  it("renders the popover without crashing when the activator is empty", () => {
    const wrapper = mountMenu({}, { activator: "" });

    expect(wrapper.find("[popover]").exists()).toBe(true);
  });
});
