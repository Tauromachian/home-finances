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
            formatter: function (w) {
              return "$" + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            },
            color: "#1f2937",
          },
        },
      },
    },
  },
});

onMounted(() => {
  const totalByCategory = {};

  const auxiliarArray = props.expenses.reduce((acum, item) => {
    const { category, amount } = item;

    if (!totalByCategory[category]) {
      totalByCategory[category] = 0;
    }

    totalByCategory[category] = totalByCategory[category] += Number(amount);
    acum.push({ categoryName: category, total: totalByCategory[category] });

    return acum;
  }, []);

  const expensesPerCategory = auxiliarArray.map((item) => {
    const { categoryName, total } = item;
    const category = categories.find((x) => x.name === categoryName);
    return {
      total,
      color: category.color,
      name: category.name,
    };
  });

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
