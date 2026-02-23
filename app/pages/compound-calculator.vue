<script setup lang="ts">
import type { CompoundForm } from "~/types/compound";

const form = reactive<CompoundForm>({
  percent: 8,
  years: 10,
  initialAmount: 100,
  monthlyContribution: 100,
});

const compoundedValue = computed(() => {
  const initialAmount = form.initialAmount ?? 1;
  const monthlyContribution = form.monthlyContribution ?? 1;
  const percent = form.percent ?? 1;
  const years = form.years ?? 1;

  return compoundInterestWithMonthlyReinvestment(
    initialAmount,
    monthlyContribution,
    percent,
    years,
  );
});
</script>

<template>
  <div>
    <div class="flex flex-col gap-5 md:items-start max-w-xl mx-auto">
      <CompoundStatsCard :compound-value="compoundedValue"> </CompoundStatsCard>

      <CompoundForm v-model="form"></CompoundForm>
    </div>
  </div>
</template>
