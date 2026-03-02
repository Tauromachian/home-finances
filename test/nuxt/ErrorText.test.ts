import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import ErrorText from "~/components/ErrorText.vue";

describe("ErrorText.vue component", () => {
  it("Sets display none if it has no slots", () => {
    const wrapper = mount(ErrorText, {});

    expect(wrapper.element.style.display).toBe("none");
  });

  it("Sets display block if it has slots", () => {
    const wrapper = mount(ErrorText, {
      slots: { default: "Test text" },
    });

    expect(wrapper.element.style.display).toBe("");
  });
});
