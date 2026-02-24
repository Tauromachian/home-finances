<script setup lang="ts">
defineProps({
  compoundValue: { type: Number, default: 1 },
  totalInvested: { type: Number, default: 1 },
  interestEarned: { type: Number, default: 1 },
});
</script>

<template>
  <AppCard color="accent-3" class="text-text-inverse">
    <AppCardBody class="flex flex-col items-center gap-2">
      <p class="opacity-60">Total</p>
      <p class="text-5xl font-serif text-accent-4">{{ compoundValue }}</p>
      <span class="flex gap-2 opacity-60">
        <p>Interest Earned: {{ interestEarned }}</p>
        <p>||</p>
        <p>Total Invested: {{ totalInvested }}</p>
      </span>
    </AppCardBody>
  </AppCard>
</template>
