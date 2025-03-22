<template>
  <button
    class="px-3 py-2 rounded-full transition cursor-pointer"
    :class="classes"
    :value="value"
  >
    <slot></slot>
  </button>
</template>

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
});

const classes = computed(() => {
  const calculatedClasses = {
    text: "bg-transparent",
    outlined: "border bg-transparent border-primary-700",
    regular:
      "bg-primary-500 text-white focus:bg-primary-700 focus:text-white hover:bg-primary-700",
  };

  if (props.variant) return calculatedClasses[props.variant];

  return calculatedClasses.regular;
});
</script>
