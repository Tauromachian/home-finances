<script setup lang="ts">
import type { Expense } from "~/types/expense";

defineProps({
  expenses: {
    type: Array as PropType<Expense[]>,
    default: () => [],
  },
});
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="uppercase text-sm font-bold">By Category</p>
    </AppCardBody>
  </AppCard>
</template>

<style scoped></style>
