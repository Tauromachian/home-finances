<script setup lang="ts">
const {
  variant = "",
  value = "",
  color = "accent",
} = defineProps<{
  variant?: "" | "text" | "outlined";
  value?: string | number;
  color?: string;
}>();

const classes = computed(() => {
  const calculatedClasses = {
    text: ["bg-transparent"],
    outlined: ["border", "bg-transparent", "border-primary-700"],
    regular: ["text-white", "focus:text-white"],
  };

  calculatedClasses.regular.push(
    ...`bg-${color}-0 hover:bg-${color}-1`.split(" "),
  );

  if (variant) return calculatedClasses[variant];

  return calculatedClasses.regular;
});
</script>

<template>
  <button
    class="rounded-full px-4 py-2 text-sm cursor-pointer text-text-1 border-neutral-1"
    :class="classes"
    :value="value"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
