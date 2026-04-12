<script setup lang="ts">
const series = [
  {
    name: "Income",
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  },
  {
    name: "Expenses",
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  },
];

const options = {
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
    categories: months,
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  fill: {
    opacity: 1,
  },
};
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="text-sm">Expenses vs Gains</p>
      <ClientOnly>
        <apexchart type="bar" :options="options" :series="series"> </apexchart>
      </ClientOnly>
    </AppCardBody>
  </AppCard>
</template>
