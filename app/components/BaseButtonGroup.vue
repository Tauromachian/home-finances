<script setup lang="ts">
// Presentational only: joins slotted buttons into a single segmented
// control. Active/inactive state stays with the buttons themselves
// (e.g. via `variant`), so native events and v-model keep working untouched.
const { role = "group" } = defineProps<{
  role?: string;
}>();
</script>

<template>
  <div
    :role="role"
    class="inline-flex items-stretch [&>button]:-ml-px [&>button]:rounded-none [&>button]:focus-visible:relative [&>button]:focus-visible:z-10 [&>button:first-child]:ml-0 [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-r-xl"
  >
    <slot></slot>
  </div>
</template>
