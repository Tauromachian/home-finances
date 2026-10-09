import { cloneVNode, type Slot } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: [String, Number], default: "" },
  },
  emit: ["update:modelValue"],
  setup(props, { emit, slots }) {
    const active = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        emit("update:modelValue", val);
      },
    });

    function makeButtons(slot: Slot): VNode[] {
      const buttons = slot();

      const newButtons = [];

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        newButtons.push(
          cloneVNode(button, {
            onClick: (event: PointerEvent) => {
              active.value = (event.target as HTMLButtonElement)?.value ?? i;
            },
          }),
        );
      }

      return newButtons;
    }

    return () => (
      <div class="inline-flex items-stretch [&>button]:-ml-px [&>button]:rounded-none [&>button]:focus-visible:relative [&>button]:focus-visible:z-10 [&>button:first-child]:ml-0 [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-r-xl">
        {makeButtons(slots.default)}
      </div>
    );
  },
});
