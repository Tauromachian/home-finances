import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import AppChip from "~/components/AppChip.vue";

describe("AppChip.vue", () => {
  it("Sets default styles correctly", () => {
    const wrapper = mount(AppChip);

    expect(wrapper.classes()).toContain("text-white");
    expect(wrapper.classes()).toContain("focus:text-white");
    expect(wrapper.classes()).toContain("bg-accent-0");
    expect(wrapper.classes()).toContain("hover:bg-accent-1");
  });

  it("Sets outlined variant classes correctly", () => {
    const wrapper = mount(AppChip, { props: { variant: "outlined" } });

    expect(wrapper.classes()).toContain("border");
    expect(wrapper.classes()).toContain("bg-transparent");
    expect(wrapper.classes()).toContain("border-primary-700");
  });

  it("Sets text variant classes correctly", () => {
    const wrapper = mount(AppChip, { props: { variant: "text" } });

    expect(wrapper.classes()).toContain("bg-transparent");
  });
});
