<script setup lang="ts">
import type { Investment } from "~/types/investment";

defineProps<{ investments: Investment[] }>();
defineEmits<{ remove: [id: number | string] }>();
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="text-md font-bold mb-4">Holdings</p>
      <div v-if="investments.length" class="flex flex-col gap-2">
        <InvestmentItem
          v-for="(investment, index) in investments"
          :key="`investment-${index}`"
          :investment
          :category="getCategoryByName(investment.category, assetsCategories)"
          @remove="$emit('remove', investment.id)"
        ></InvestmentItem>
      </div>
      <EmptyState v-else></EmptyState>
    </AppCardBody>
  </AppCard>
</template>

<style scoped></style>
