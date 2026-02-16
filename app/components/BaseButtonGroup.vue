<script>
import { h, cloneVNode, watch } from "vue";

export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: () => "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { slots, emit }) {
    const genButtons = () => {
      return slots.default()[0].children.map((button) =>
        cloneVNode(button, {
          variant: button.props.value === props.modelValue ? "" : "outlined",
          onClick: (event) => {
            const value = event.target.value;
            emit("update:modelValue", value);
          },
        }),
      );
    };

    let buttons = genButtons();

    watch(
      () => props.modelValue,
      () => {
        buttons = genButtons();
      },
    );

    return () => h("span", { class: "flex flex-wrap gap-1" }, buttons);
  },
};
</script>

<style lang="scss" scoped></style>
