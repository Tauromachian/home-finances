<script setup lang="ts">
import { categories } from "@/utils/categories";
import type { Expense } from "~/types/expense";

const props = defineProps({
  expenses: {
    type: Array as PropType<Expense[]>,
    required: true,
  },
});

const chartLabels = ref([]);
const chartColors = ref([]);
const chartSeries = ref([]);

const options = ref({
  labels: chartLabels,
  colors: chartColors,
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
});

onMounted(() => {
  const totalByCategory = {};

  for (const item of props.expenses) {
    const { category, amount } = item;

    if (!totalByCategory[category]) totalByCategory[category] = 0;
    totalByCategory[category] = totalByCategory[category] += Number(amount);
  }

  const expensesPerCategory = [];
  for (const categoryName of Object.keys(totalByCategory)) {
    const category = categories.find((x) => x.name === categoryName);

    expensesPerCategory.push({
      total: totalByCategory[categoryName],
      color: category.color,
      name: category.name,
    });
  }

  expensesPerCategory.sort((a, b) => b.total - a.total);

  if (expensesPerCategory.length > 5) {
    const excedentArray = [...expensesPerCategory];
    excedentArray.splice(0, 5);

    const excedentTotal = excedentArray.reduce((total, item) => {
      return total + item.total;
    }, 0);

    expensesPerCategory.splice(5, expensesPerCategory.length - 5);
    expensesPerCategory.push({
      total: excedentTotal,
      color: "#a6a6a6",
      name: "Others",
    });
  }

  chartLabels.value = [];
  chartColors.value = [];
  chartSeries.value = [];
  expensesPerCategory.forEach((category) => {
    chartLabels.value.push(category.name);
    chartColors.value.push(category.color);
    chartSeries.value.push(category.total);
  });
});
</script>

<template>
  <ClientOnly>
    <apexchart
      type="donut"
      :options="options"
      :series="chartSeries"
      class="my-2"
    ></apexchart>
  </ClientOnly>
</template>
