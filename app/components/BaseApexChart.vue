<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import type { VueApexChartsComponentProps } from "vue3-apexcharts";
import AppLoader from "./AppLoader.vue";

const VueApexCharts = defineAsyncComponent({
  loader: () => import("vue3-apexcharts"),
  loadingComponent: AppLoader,
  delay: 0,
});

defineProps<{
  type: "bar" | "line" | "donut";
  options: ApexOptions;
  series: VueApexChartsComponentProps["series"];
  width?: number | string;
  height?: number | string;
}>();
</script>

<template>
  <VueApexCharts :type :options :series :width :height />
</template>
