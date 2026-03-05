import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import AppCard from "~/components/AppCard.vue";

describe("AppCard.vue", () => {
  it("sets the correct default color", () => {
    const wrapper = mount(AppCard);

    expect(wrapper.classes()).toContain("bg-neutral-2");
  });

  it("sets the correct color", () => {
    const wrapper = mount(AppCard, { props: { color: "red" } });

    expect(wrapper.classes()).toContain("bg-red");
  });

  it("renders regular variant correctly", () => {
    const wrapper = mount(AppCard);

    expect(wrapper.classes()).toContain("shadow-sm");
    expect(wrapper.classes()).toContain("bg-neutral-2");
  });

  it("renders outlined variant correctly", () => {
    const wrapper = mount(AppCard, { props: { variant: "outlined" } });

    expect(wrapper.classes()).toContain("border");
    expect(wrapper.classes()).toContain("border-neutral-1");
    expect(wrapper.classes()).toContain("bg-neutral-0");
  });
});
