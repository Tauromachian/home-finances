<script setup lang="ts">
import { categories } from "@/utils/categories";
import type { Expense } from "~/types/expense";

const props = defineProps({
  expenses: {
    type: Array as PropType<Expense[]>,
    required: true,
  },
});

const expensesByCategory = computed(() => {
  const totalByCategory = {};

  const categoryByName = categories.reduce((acum, category) => {
    acum[category.name] = category;
    return acum;
  }, {});

  for (const item of props.expenses) {
    const { category, amount } = item;

    if (!totalByCategory[category]) totalByCategory[category] = 0;
    totalByCategory[category] = totalByCategory[category] += Number(amount);
  }

  const expensesPerCategory = [];
  for (const categoryName of Object.keys(totalByCategory)) {
    const category = categoryByName[categoryName];

    expensesPerCategory.push({
      total: totalByCategory[categoryName],
      color: category.color,
      name: category.name,
    });
  }

  expensesPerCategory.sort((a, b) => b.total - a.total);

  return expensesPerCategory;
});

const chartData = computed<{
  labels: string[];
  colors: string[];
  series: number[];
}>(() => {
  const chartLabels = [];
  const chartColors = [];
  const chartSeries = [];

  expensesByCategory.value.forEach((category) => {
    chartLabels.push(category.name);
    chartColors.push(category.color);
    chartSeries.push(category.total);
  });

  return { labels: chartLabels, colors: chartColors, series: chartSeries };
});

const options = computed(() => ({
  labels: chartData.value.labels,
  colors: chartData.value.colors,
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            fontSize: 18,
            color: "#1f2937",
          },
        },
      },
    },
  },
}));
</script>

<template>
  <ClientOnly>
    <apexchart
      type="donut"
      :options="options"
      :series="chartData.series"
      class="mr-20"
    ></apexchart>
  </ClientOnly>
</template>
