import { describe, expect, it, vi } from "vitest";

import { h } from "vue";

import { mount } from "@vue/test-utils";

import BaseButton from "~/components/BaseButton.vue";
import BaseButtonGroup from "~/components/BaseButtonGroup";

function mountGroup(props = {}) {
  return mount(BaseButtonGroup, {
    props,
    slots: {
      default: () => [
        h(BaseButton, { value: "one" }, () => "One"),
        h(BaseButton, { value: "two", variant: "outlined" }, () => "Two"),
      ],
    },
  });
}

describe("BaseButtonGroup", () => {
  it("Renders a group wrapper with joined-button layout classes", () => {
    const wrapper = mountGroup();

    expect(wrapper.attributes("role")).toBe("group");
    expect(wrapper.classes()).toContain("inline-flex");
  });

  it("Renders all slotted buttons", () => {
    const wrapper = mountGroup();
    const buttons = wrapper.findAll("button");

    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toBe("One");
    expect(buttons[1].text()).toBe("Two");
  });

  it("Does not swallow native button events", () => {
    const onClick = vi.fn();
    const wrapper = mount(BaseButtonGroup, {
      slots: {
        default: () => h(BaseButton, { value: "one", onClick }, () => "One"),
      },
    });

    wrapper.find("button").trigger("click");

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("Emits update:modelValue with the clicked button value", async () => {
    const wrapper = mountGroup({ modelValue: "one" });
    const buttons = wrapper.findAll("button");

    await buttons[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([["two"]]);
  });

  it("Renders nothing when no default slot is provided", () => {
    const wrapper = mount(BaseButtonGroup);

    expect(wrapper.findAll("button")).toHaveLength(0);
  });
});
