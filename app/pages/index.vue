<script setup lang="ts">
import { loadExpenses as fetchExpenses } from "~/services/expenses";
import { loadIncomes as fetchIncomes } from "~/services/incomes";
import { round2 } from "~/utils/period";

import type { Expense } from "~/types/expense";
import type { Income } from "~/types/income";

const expenses = ref<Expense[]>([]);
const incomes = ref<Income[]>([]);

const { inScope, activeGroup } = useGroups();

const scopedExpenses = computed(() => inScope(expenses.value));
const scopedIncomes = computed(() => inScope(incomes.value));

const { totalExpenses } = useExpenses(scopedExpenses);
const { totalIncomes } = useIncomes(scopedIncomes);

const cashflow = computed(() =>
  round2(totalIncomes.value - totalExpenses.value),
);

const cashflowColor = computed(() =>
  cashflow.value < 0 ? "text-red-600" : "text-green-600",
);

async function loadExpenses() {
  expenses.value = await fetchExpenses();
}

async function loadIncomes() {
  incomes.value = await fetchIncomes();
}

onBeforeMount(() => {
  loadExpenses();
  loadIncomes();
});
</script>

<template>
  <div class="flex flex-col gap-3 md:gap-4">
    <p v-if="activeGroup" class="text-sm text-text-0">
      Showing {{ activeGroup.name }} finances
    </p>
    <AppCard color="accent-3" class="text-text-inverse">
      <AppCardBody>
        <p class="text-text-0">Net Worth</p>
        <h2 class="text-4xl md:text-5xl font-serif" :class="cashflowColor">
          €{{ cashflow.toFixed(2) }}
        </h2>
        <p class="text-text-0">Portfolio value plus Income minus Expenses</p>
      </AppCardBody>
    </AppCard>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Balance change</p>
          <p class="text-2xl md:text-3xl font-serif" :class="cashflowColor">
            €{{ cashflow.toFixed(2) }}
          </p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Income</p>
          <p class="text-2xl md:text-3xl font-serif text-green-600">
            €{{ totalIncomes.toFixed(2) }}
          </p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Expenses</p>
          <p class="text-2xl md:text-3xl font-serif text-red-600">
            €{{ totalExpenses.toFixed(2) }}
          </p>
        </AppCardBody>
      </AppCard>
    </div>

    <AppCard>
      <AppCardBody>
        <p class="text-sm">Expenses vs Gains</p>
        <ClientOnly>
          <DashboardColumnChart
            :incomes="scopedIncomes"
            :expenses="scopedExpenses"
          ></DashboardColumnChart>
          <template #fallback>
            <AppLoader size="80" class="my-40"></AppLoader>
          </template>
        </ClientOnly>
      </AppCardBody>
    </AppCard>
  </div>
</template>
