const AppChipGroup = defineComponent({
  name: "AppChipGroup",
  props: {
    modelValue: {
      type: [String, Number],
      default: () => "",
    },
  },

  emits: ["update:modelValue"],

  setup(props, { slots, emit }) {
    const buttons = computed(() => {
      const buttons = slots.default()[0].children;

      if (Array.isArray(buttons)) {
        return buttons.map((button: VNode) => {
          button.props["onClick"] = (event: MouseEvent) => {
            const value = (event.target as HTMLButtonElement).value;
            emit("update:modelValue", value);
          };

          if (button.props.value === props.modelValue) {
            button.props.variant = "";
          } else {
            button.props.variant = "outlined";
          }

          return button;
        });
      }

      return [];
    });

    return () => <span class="flex flex-wrap gap-1">{...buttons.value}</span>;
  },
});

export default AppChipGroup;
