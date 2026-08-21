<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

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

const options = computed<ApexOptions>(() => ({
  chart: {
    height: 320,
  },
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
}));
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="text-sm">Expenses vs Gains</p>
      <BaseApexChart type="bar" :options="options" :series="series">
      </BaseApexChart>
    </AppCardBody>
  </AppCard>
</template>
