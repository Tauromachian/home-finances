<script setup lang="ts">
import { assetsCategories } from "@/utils/categories";

import type { Investment } from "~/types/investment";

const props = defineProps({
  investments: {
    type: Array as PropType<Investment[]>,
    required: true,
  },
});

const textColor = inject<Ref<string | undefined>>("donutChartTextColor");

const investmentsByCategory = computed(() => {
  const totalByCategory = {};

  const categoryByName = assetsCategories.reduce((acum, category) => {
    acum[category.name] = category;
    return acum;
  }, {});

  for (const item of props.investments) {
    const { category, currentValue } = item;

    if (!totalByCategory[category]) totalByCategory[category] = 0;
    totalByCategory[category] = totalByCategory[category] +=
      Number(currentValue);
  }

  const investmentsPerCategory = [];
  for (const categoryName of Object.keys(totalByCategory)) {
    const category = categoryByName[categoryName];

    investmentsPerCategory.push({
      total: totalByCategory[categoryName],
      color: category.color,
      name: category.name,
    });
  }

  investmentsPerCategory.sort((a, b) => b.total - a.total);

  return investmentsPerCategory;
});

const chartData = computed<{
  labels: string[];
  colors: string[];
  series: number[];
}>(() => {
  const chartLabels = [];
  const chartColors = [];
  const chartSeries = [];

  investmentsByCategory.value.forEach((category) => {
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
