<script setup lang="ts">
const { variant = "", color = "neutral-2" } = defineProps<{
  variant?: "" | "outlined";
  color?: string;
}>();

const classes = computed(() => {
  const classesByVariant = {
    "": ["shadow-sm", `bg-${color}`],
    outlined: ["border", "border-neutral-1", "bg-neutral-0"],
  };

  return classesByVariant[variant];
});
</script>

<template>
  <div class="w-full rounded-2xl" :class="classes">
    <slot></slot>
  </div>
</template>
