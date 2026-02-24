<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Investment } from "~/types/investment";

function getCategory(category: string): Category {
  return assets.find((item) => {
    return item.name == category;
  });
}

defineProps<{ investments: Investment[] }>();
defineEmits<{ remove: [id: number | string] }>();
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="text-md font-bold mb-4">Holdings</p>
      <template v-if="investments.length">
        <InvestmentItem
          v-for="(investment, index) in investments"
          :key="`investment-${index}`"
          :investment
          :category="getCategory(investment.category)"
          @remove="$emit('remove', investment.id)"
        ></InvestmentItem>
      </template>
      <EmptyState v-else></EmptyState>
    </AppCardBody>
  </AppCard>
</template>

<style scoped></style>
