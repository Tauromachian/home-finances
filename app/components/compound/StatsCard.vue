<script setup lang="ts">
defineProps({
  compoundValue: { type: Number, default: 1 },
});
</script>

<template>
  <AppCard color="accent-3">
    <AppCardBody class="flex flex-col items-center gap-2">
      <p>Total</p>
      <p class="text-5xl font-serif text-accent-4">{{ compoundValue }}</p>
    </AppCardBody>
  </AppCard>
</template>
