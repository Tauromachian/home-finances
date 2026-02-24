<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Investment } from "~/types/investment";

function getCategory(category: string): Category {
  return assets.find((item) => {
    return item.name == category;
  });
}

defineProps<{ investments: Investment[] }>();
</script>

<template>
  <AppCard>
    <AppCardBody>
      <InvestmentItem
        v-for="(investment, index) in investments"
        :key="`investment-${index}`"
        :investment
        :category="getCategory(investment.category)"
      ></InvestmentItem>
    </AppCardBody>
  </AppCard>
</template>

<style scoped></style>
