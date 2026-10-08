<script setup lang="ts">
import {
  defaultReportRange,
  endOfThisMonth,
  parseIsoDate,
} from "~/utils/period";

import type { Income } from "~/types/income";

const props = defineProps<{
  incomes: Income[];
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

const { totalIncomes, yearToDateIncomes } = useIncomes(
  () => props.incomes,
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
          <p class="text-sm">Total Incomes</p>
          <p
            class="text-3xl font-serif text-accent-0 mt-2"
            data-testid="reports-total"
          >
            €{{ totalIncomes.toFixed(2) }}
          </p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Entries</p>
          <p class="text-3xl font-serif mt-2 text-text-1">
            {{ yearToDateIncomes.length }}
          </p>
        </AppCardBody>
      </AppCard>
    </div>

    <div
      v-if="!yearToDateIncomes?.length"
      class="flex flex-col items-center gap-5 justify-center my-6"
    >
      <Icon size="48" name="material-symbols-light:note-outline"></Icon>

      <p>No incomes in this period! Add one</p>
    </div>
  </div>
</template>
