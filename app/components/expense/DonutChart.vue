<script setup lang="ts">
import { categories } from "@/utils/categories";
import type { Expense } from "~/types/expense";

const props = defineProps({
  expenses: {
    type: Array as PropType<Expense[]>,
    required: true,
  },
});

const theme = inject<Ref<string>>("theme");
const textColor = ref<string>("Light");

watch(
  theme,
  () => {
    textColor.value = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--color-text-1");
  },
  { immediate: true },
);

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
    chartLabels.push(`${category.name} €${category.total}`);
    chartColors.push(category.color);
    chartSeries.push(category.total);
  });

  return { labels: chartLabels, colors: chartColors, series: chartSeries };
});

const options = computed(() => {
  return {
    labels: chartData.value.labels,
    colors: chartData.value.colors,
    legend: {
      formatter: function (val: string) {
        const [firstSection, secondSection] = val.split("€");

        return `<span class="font-sans text-md md:text-lg ml-2 text-text-0">
                    ${firstSection}
                    <span class="text-text-1 font-bold">€${secondSection}
                    </span>
              </span>`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "28px",
              fontFamily: '"DM Serif Display", sans-serif',
              fontWeight: 700,
              color: textColor.value,
            },
            total: {
              show: true,
              fontSize: 18,
              color: textColor.value,
              fontFamily: '"DM Sans", sans-serif',
            },
          },
        },
      },
    },
  };
});
</script>

<template>
  <ClientOnly>
    <apexchart
      type="donut"
      :options="options"
      :series="chartData.series"
      class="mx-5 mb-5"
    ></apexchart>
  </ClientOnly>
</template>
