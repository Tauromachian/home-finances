<script setup lang="ts">
import { expensesCategories } from "~/utils/categories";
import {
  defaultReportRange,
  endOfThisMonth,
  parseIsoDate,
} from "~/utils/period";

import type { Expense } from "~/types/expense";

const props = defineProps<{
  expenses: Expense[];
}>();

const reportDefaults = defaultReportRange();
const reportStart = ref(reportDefaults.start);
const reportEnd = ref(reportDefaults.end);

// Clearing a picker leaves that side empty; resolve it back to the
// default so stats and charts always share the same range.
const reportRange = computed(() => {
  const end = reportEnd.value || endOfThisMonth();
  const endYear = parseIsoDate(end)?.year ?? new Date().getFullYear();
  const start = reportStart.value || `${endYear}-01-01`;

  return { start, end };
});

const { totalExpenses, categoriesCount, yearToDateExpenses } = useExpenses(
  () => props.expenses,
  new Date(),
  reportRange,
);
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppCard>
      <AppCardBody>
        <div
          class="grid sm:grid-cols-2 gap-x-5"
          data-testid="reports-time-filter"
        >
          <div data-testid="reports-start-date">
            <AppDatePicker
              v-model="reportStart"
              label="Start date"
              placeholder="Select start date"
              :max="reportRange.end"
            />
          </div>
          <div data-testid="reports-end-date">
            <AppDatePicker
              v-model="reportEnd"
              label="End date"
              placeholder="Select end date"
              :min="reportRange.start"
            />
          </div>
        </div>
      </AppCardBody>
    </AppCard>

    <div class="grid md:grid-cols-2 gap-5">
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Total Expenses</p>
          <p
            class="text-3xl font-serif text-accent-0 mt-2"
            data-testid="reports-total"
          >
            €{{ totalExpenses.toFixed(2) }}
          </p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Categories</p>
          <p class="text-3xl font-serif mt-2 text-text-1">
            {{ categoriesCount }}
          </p>
        </AppCardBody>
      </AppCard>
    </div>

    <div
      v-if="!yearToDateExpenses?.length"
      class="flex flex-col items-center gap-5 justify-center my-6"
    >
      <Icon size="48" name="material-symbols-light:note-outline"></Icon>

      <p>No expenses in this period! Add one</p>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-5">
      <AppCard>
        <AppCardBody>
          <p class="text-md font-bold">Breakdown</p>
        </AppCardBody>

        <div class="py-4 md:px-6">
          <ClientOnly>
            <ExpenseDonutChart
              :expenses="yearToDateExpenses"
              :categories="expensesCategories"
            ></ExpenseDonutChart>
            <template #fallback>
              <AppLoader size="80" class="my-40"></AppLoader>
            </template>
          </ClientOnly>
        </div>
      </AppCard>

      <AppCard>
        <AppCardBody>
          <p class="text-md font-bold">Expenses by Month</p>
        </AppCardBody>

        <div class="py-4 md:px-6">
          <ClientOnly>
            <ExpenseLineChart
              :expenses="yearToDateExpenses"
              :start="reportRange.start"
              :end="reportRange.end"
            ></ExpenseLineChart>
            <template #fallback>
              <AppLoader size="80" class="my-40"></AppLoader>
            </template>
          </ClientOnly>
        </div>
      </AppCard>
    </div>
  </div>
</template>
