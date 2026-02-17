<script setup lang="ts">
import type { CompoundForm } from "~/types/compound";

const form = reactive<CompoundForm>({
  percent: 8,
  years: 10,
  initialAmount: 100,
  monthlyContribution: 100,
});

const compounedValue = computed(() => {
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
    <h1 class="text-3xl font-bold mb-5">Compound Calculator</h1>

    <div class="flex flex-col md:flex-row gap-5 md:items-start">
      <CompoundForm v-model="form"></CompoundForm>

      <CompoundStatsCard :compound-value="compounedValue"> </CompoundStatsCard>
    </div>

    <AppToaster ref="appToaster"></AppToaster>
  </div>
</template>
