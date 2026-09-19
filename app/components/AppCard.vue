<script setup lang="ts">
const {
  variant = "",
  color = "neutral-2",
  radius = "rounded-2xl",
} = defineProps<{
  variant?: "" | "outlined";
  color?: string;
  radius?: string;
}>();

const classes = computed(() => {
  const classesByVariant = {
    "": ["shadow-sm", `bg-${color}`],
    outlined: ["border", "border-neutral-1", "bg-neutral-0"],
  };

  const classByVariant = classesByVariant[variant];

  classByVariant.push(radius);

  return classByVariant;
});
</script>

<template>
  <div class="w-full" :class="classes">
    <slot></slot>
  </div>
</template>
