import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import BaseButton from "~/components/BaseButton.vue";

describe("BaseButton.vue", () => {
  it("Sets default colors correctly", () => {
    const wrapper = mount(BaseButton);

    expect(wrapper.classes()).toContain("bg-accent-0");
    expect(wrapper.classes()).toContain("hover:bg-accent-1");
  });

  it("Sets correct colors", () => {
    const wrapper = mount(BaseButton, {
      props: { colors: { color: "primary-0", hover: "primary-1" } },
    });

    expect(wrapper.classes()).toContain("bg-primary-0");
    expect(wrapper.classes()).toContain("hover:bg-primary-1");
  });

  it("Renders default variant correctly", () => {
    const wrapper = mount(BaseButton);

    expect(wrapper.classes()).toContain("text-white");
    expect(wrapper.classes()).toContain("focus:text-white");
  });

  it("Renders outlined variant correctly", () => {
    const wrapper = mount(BaseButton, { props: { variant: "outlined" } });

    expect(wrapper.classes()).toContain("border");
    expect(wrapper.classes()).toContain("bg-transparent");
    expect(wrapper.classes()).toContain("border-neutral-1");
    expect(wrapper.classes()).toContain("text-text-1");
  });

  it("Renders outlined variant correctly", () => {
    const wrapper = mount(BaseButton, { props: { variant: "outlined" } });

    expect(wrapper.classes()).toContain("border");
    expect(wrapper.classes()).toContain("bg-transparent");
    expect(wrapper.classes()).toContain("border-neutral-1");
    expect(wrapper.classes()).toContain("text-text-1");
  });

  it("Renders text variant correctly", () => {
    const wrapper = mount(BaseButton, { props: { variant: "outlined" } });

    expect(wrapper.classes()).toContain("bg-transparent");
  });
});
