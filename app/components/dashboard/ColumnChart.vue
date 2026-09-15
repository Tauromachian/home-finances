<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { getMonthlyIncomesSeries } from "~/services/incomes";
import { getMonthlyExpensesSeries } from "~/services/expenses";
import type { Income } from "~/types/income";
import type { Expense } from "~/types/expense";

const props = defineProps({
  incomes: {
    type: Array as PropType<Income[]>,
    default: () => [],
  },
  expenses: {
    type: Array as PropType<Expense[]>,
    default: () => [],
  },
});

const incomesData = computed(() =>
  getMonthlyIncomesSeries(props.incomes, new Date()),
);

const expensesData = computed(() =>
  getMonthlyExpensesSeries(props.expenses, new Date()),
);

const categories = computed(() =>
  incomesData.value.labels.length
    ? incomesData.value.labels
    : expensesData.value.labels,
);

const series = computed(() => [
  {
    name: "Income",
    data: incomesData.value.totals,
  },
  {
    name: "Expenses",
    data: expensesData.value.totals,
  },
]);

const options = computed<ApexOptions>(() => ({
  chart: {
    height: 320,
  },
  colors: ["#16a34a", "#dc2626"],
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          height: 220,
        },
        xaxis: {
          labels: {
            style: {
              fontSize: "10px",
            },
            rotate: -30,
            rotateAlways: true,
          },
        },
        yaxis: {
          title: {
            text: "",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 5,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: categories.value,
  },
  yaxis: {
    title: {
      text: "€",
    },
    labels: {
      formatter: (value: number) => `€${Math.round(value)}`,
    },
  },
  fill: {
    opacity: 1,
  },
}));
</script>

<template>
  <BaseApexChart type="bar" :options="options" :series="series">
  </BaseApexChart>
</template>
