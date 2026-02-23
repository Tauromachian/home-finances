<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String,
    default: "",
    validator(value: string | undefined) {
      return ["", "text", "outlined"].includes(value);
    },
  },
  value: {
    type: [String, Number],
    default: "",
  },
  colors: {
    type: Object as PropType<{ color: string; hover: string }>,
    default: () => ({ color: "accent-0", hover: "accent-1" }),
  },
});

const classes = computed(() => {
  const calculatedClasses = {
    text: ["bg-transparent"],
    outlined: ["border", "bg-transparent", "border-primary-700"],
    regular: ["text-white", "focus:text-white"],
  };

  const { color, hover } = props.colors;
  calculatedClasses.regular.push(...[`bg-${color}`, `hover:bg-${hover}`]);

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
