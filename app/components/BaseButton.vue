<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "",
    validator(value) {
      return ["", "text", "outlined"].includes(value);
    },
  },
  value: {
    type: [String, Number],
    default: "",
  },
  color: {
    type: String,
    default: "accent",
  },
});

const classes = computed(() => {
  const calculatedClasses = {
    text: ["bg-transparent"],
    outlined: ["border", "bg-transparent", "border-primary-700"],
    regular: ["text-white", "focus:text-white"],
  };

  const color = props.color;
  calculatedClasses.regular.push(
    `bg-${color}-0 hover:bg-${color}-1`.split(" "),
  );

  if (props.variant) return calculatedClasses[props.variant];

  return calculatedClasses.regular;
});
</script>

<template>
  <button
    class="px-3 py-2 rounded-xl transition cursor-pointer"
    :class="classes"
    :value="value"
  >
    <slot></slot>
  </button>
</template>
