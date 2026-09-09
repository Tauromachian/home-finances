<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { getMonthlyExpensesSeries } from "~/services/expenses/getMonthlyExpensesSeries";
import type { Expense } from "~/types/expense";

const props = defineProps({
  expenses: {
    type: Array as PropType<Expense[]>,
    required: true,
  },
});

const chartData = computed(() => getMonthlyExpensesSeries(props.expenses));

const options = computed<ApexOptions>(() => {
  return {
    chart: {
      height: 320,
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 220,
          },
          stroke: {
            width: 2,
          },
        },
      },
    ],
    colors: ["#2563eb"],
    stroke: {
      width: 3,
      curve: "smooth",
    },
    markers: {
      size: 4,
    },
    xaxis: {
      categories: chartData.value.labels,
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `€${Math.round(value)}`,
      },
    },
  };
});
</script>

<template>
  <p
    v-if="!chartData.labels.length"
    class="text-center text-sm text-text-0 my-6"
  >
    Not enough data yet — check back next month.
  </p>
  <BaseApexChart
    v-else
    type="line"
    :options="options"
    :series="[{ name: 'Expenses', data: chartData.totals }]"
    class="md:mx-5 md:mb-5"
  ></BaseApexChart>
</template>
