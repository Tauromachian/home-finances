import { describe, expect, it, vi } from "vitest";

import { h } from "vue";

import { mount } from "@vue/test-utils";

import BaseButton from "~/components/BaseButton.vue";
import BaseButtonGroup from "~/components/BaseButtonGroup.vue";

function mountGroup() {
  return mount(BaseButtonGroup, {
    slots: {
      default: () => [
        h(BaseButton, null, () => "One"),
        h(BaseButton, { variant: "outlined" }, () => "Two"),
      ],
    },
  });
}

describe("BaseButtonGroup.vue", () => {
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
        default: () => h(BaseButton, { onClick }, () => "One"),
      },
    });

    wrapper.find("button").trigger("click");

    expect(onClick).toHaveBeenCalledOnce();
  });
});
