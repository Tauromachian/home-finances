<script setup lang="ts">
import { months } from "@/utils/months";
import type { Expense } from "~/types/expense";

const props = defineProps({
  expenses: {
    type: Array,
    required: true,
  },
});

const series = computed(() => {
  const expensesObject = props.expenses.reduce((acum, expense: Expense) => {
    const { category, amount, frequency } = expense;

    if (!acum[category]) {
      acum[category] = Array.from(Array(12)).map(() => 0);
    }

    if (frequency.toLowerCase() === "monthly") {
      acum[category] = acum[category].map(
        (item: number) => item + Number(amount),
      );
    }

    if (frequency.toLowerCase() === "annual") {
      acum[category] = acum[category].map((item: number) =>
        Math.round((item + Number(amount)) / 12),
      );
    }

    return acum;
  }, {});

  const series = [];

  for (const key in expensesObject as object) {
    if (expensesObject.hasOwnProperty(key)) {
      series.push({
        name: key,
        data: expensesObject[key],
      });
    }
  }

  return series;
});

const options = {
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  xaxis: {
    categories: months,
  },
  yaxis: {
    title: {
      text: "Money",
    },
  },
};
</script>

<template>
  <apexchart
    type="line"
    width="100%"
    height="250px"
    :options="options"
    :series="series"
  ></apexchart>
</template>
