<script setup>
import { ref } from "vue";

import { useExpenseStore } from "../stores/expenses";

const expenseStore = useExpenseStore();

const appToaster = ref(null);
const fadingInOutArrow = ref(false);

function scrollToStats() {
  const component = document.getElementById("expense-stats");

  if (!component) return;

  component.scrollIntoView({ behavior: "smooth" });

  closeScrollDown();
}

function submitForm(form) {
  // show scroll-down arrow
  expenseStore.addExpense(form);

  if (!appToaster?.value) return;

  appToaster.value.openToast("New expense added!");
}

function closeScrollDown() {
  fadingInOutArrow.value = false;
}

onMounted(() => {
  expenseStore.loadExpenses();
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-5">Expenses Tracker</h1>

    <div class="flex flex-col md:flex-row gap-5 md:items-start">
      <ExpenseForm @submit="submitForm"></ExpenseForm>

      <ExpenseStatsCard />
    </div>

    <AppToaster ref="appToaster"></AppToaster>

    <ScrollDownArrow
      class="transition-opacity"
      :class="{
        'opacity-100': fadingInOutArrow,
        'opacity-0': !fadingInOutArrow,
      }"
      @scroll-to-stats="scrollToStats"
    ></ScrollDownArrow>
  </div>
</template>

<style lang="scss" scoped></style>
