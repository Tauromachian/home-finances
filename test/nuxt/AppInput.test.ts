import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import AppInput from "~/components/AppInput.vue";
import ErrorText from "~/components/ErrorText.vue";

describe("AppInput", () => {
  it("renders label", () => {
    const wrapper = mount(AppInput, { props: { label: "Test label" } });

    expect(wrapper.html()).toContain("Test label");
  });
  it("hides label if label props is not passed", () => {
    const wrapper = mount(AppInput);

    expect(wrapper.find("label").exists()).toBeFalsy();
  });
  it("renders error", () => {
    const wrapper = mount(AppInput, { props: { error: "Test error msg" } });

    expect(wrapper.html()).toContain("Test error msg");
  });
  it("hides error if noError is passed as true", () => {
    const wrapper = mount(AppInput, { props: { noError: true } });

    expect(wrapper.findComponent(ErrorText).exists()).toBeFalsy();
  });
  it("remove margin if noError prop is passed", () => {
    const wrapper = mount(AppInput, { props: { noError: true } });

    expect(
      wrapper.find('[data-testid="input-wrapper-el"]').classes(),
    ).toContain("mb-1");
  });
  it("renders prepend and append slots", () => {
    const wrapper = mount(AppInput, {
      slots: { prepend: () => "test", append: () => "test" },
    });

    expect(
      wrapper.find('[data-testid="prepend-icon-el"]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('[data-testid="append-icon-el"]').exists(),
    ).toBeTruthy();
  });
  it("adds reactive classes to icons when events are listened to", () => {
    const wrapper = mount(AppInput, {
      slots: { prepend: () => "test", append: () => "test" },
      props: { "onClick:prepend": () => {}, "onClick:append": () => {} },
    });

    expect(wrapper.find('[data-testid="prepend-icon-el"]').classes()).toContain(
      "cursor-pointer",
    );
    expect(wrapper.find('[data-testid="append-icon-el"]').classes()).toContain(
      "cursor-pointer",
    );
  });
});
