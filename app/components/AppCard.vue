<script setup lang="ts">
const { variant = "" } = defineProps<{
  variant?: "" | "outlined";
}>();

const classes = computed(() => {
  const classesByVariant = {
    "": ["shadow-sm", "bg-neutral-2"],
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
