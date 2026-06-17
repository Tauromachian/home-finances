import VueApexCharts from "vue3-apexcharts";

export default defineNuxtPlugin({
  name: "apexcharts",
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.vueApp.use(VueApexCharts);
  },
});
