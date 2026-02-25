<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Investment } from "~/types/investment";

const { investments = [] } = defineProps<{ investments?: Investment[] }>();

const calculatedSeries = computed(() => {
  const series = [];

  for (const investment of investments) {
    const serie = {
      name: investment.name,
      data: [],
    };
    series.push(serie);

    const gains = investment.currentValue - investment.amountInvested;
    const monthlyGains = gains / 12;
    let growingAmount = investment.amountInvested;

    for (let i = 0; i < 12; i++) {
      growingAmount += monthlyGains;
      serie.data.push(growingAmount.toFixed(2));
    }
  }

  return series;
});

function getCategory(category: string): Category {
  return assets.find((item) => {
    return item.name == category;
  });
}

const colors = computed(() => {
  const colors = [];

  for (const investment of investments) {
    const category = getCategory(investment.category);
    colors.push(category.color);
  }

  return colors;
});

const options = computed(() => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
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
    colors: [...colors.value],
    xaxis: {
      categories: months,
    },
  };
});
</script>

<template>
  <ClientOnly>
    <apexchart type="line" :options :series="calculatedSeries"> </apexchart>
  </ClientOnly>
</template>

<style scoped></style>
