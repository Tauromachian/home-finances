<script setup lang="ts">
import { expensesCategories } from "@/utils/categories";
import type { ApexOptions } from "apexcharts";
import type { Expense } from "~/types/expense";

const props = defineProps({
  expenses: {
    type: Array as PropType<Expense[]>,
    required: true,
  },
});

const { isLGAndUp } = useDisplay();

const textColor = inject<Ref<string | undefined>>("donutChartTextColor");

const expensesByCategory = computed(() => {
  const totalByCategory = {};

  const categoryByName = expensesCategories.reduce((acum, category) => {
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

const options = computed<ApexOptions>(() => {
  return {
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  value: {
                    fontSize: "20px",
                  },
                  total: {
                    fontSize: "14px",
                  },
                },
              },
            },
          },
        },
      },
    ],
    labels: chartData.value.labels,
    colors: chartData.value.colors,
    legend: {
      position: isLGAndUp.value ? "right" : "bottom",
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
              fontSize: "18px",
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
  <BaseApexChart
    type="donut"
    :options="options"
    :series="chartData.series"
    class="md:mx-5 md:mb-5"
  ></BaseApexChart>
</template>
