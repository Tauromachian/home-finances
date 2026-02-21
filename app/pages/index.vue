<script setup lang="ts">
import type { Category } from "~/types/category";

import { useExpenseStore } from "../stores/expenses";

const expenseStore = useExpenseStore();

const appToaster = inject<Ref>("appToaster");

const fadingInOutArrow = ref(false);
const frequencies = ["All", "One time", "Monthly", "Annual"];
const selectedExpenseType = ref("All");
const isOpen = ref(false);

function scrollToStats() {
  const component = document.getElementById("expense-stats");

  if (!component) return;

  component.scrollIntoView({ behavior: "smooth" });

  closeScrollDown();
}

function submitForm(form) {
  expenseStore.addExpense(form);
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast("New expense added!");
}

function closeScrollDown() {
  fadingInOutArrow.value = false;
}

function getCategory(category: string): Category {
  return categories.find((item) => {
    return item.name == category;
  });
}

const filteredExpenses = computed(() => {
  const allExpenses = expenseStore.expenses;

  return allExpenses.filter((expense) => {
    if (selectedExpenseType.value === "All") return true;
    return expense.types === selectedExpenseType.value;
  });
});

onMounted(() => expenseStore.loadExpenses());
</script>

<template>
  <div>
    <BaseButton class="mb-5" @click="isOpen = true">
      <span class="text-xl">+</span> Add Expense
    </BaseButton>

    <div class="flex flex-col md:flex-row gap-5 md:items-start">
      <AppDialog v-model="isOpen">
        <ExpenseForm @submit="submitForm"></ExpenseForm>
      </AppDialog>

      <div id="expense-stats" class="w-full">
        <BaseButtonGroup v-model="selectedExpenseType" class="mb-4">
          <BaseButton
            v-for="(frequency, index) in frequencies"
            :key="`expense-type-${index}`"
            :value="frequency"
          >
            {{ frequency }}
          </BaseButton>
        </BaseButtonGroup>

        <div class="flex flex-wrap gap-3">
          <AppCard>
            <div
              v-if="!filteredExpenses?.length"
              class="flex justify-center mt-6"
            >
              No expenses! Add one
            </div>

            <AppCardBody>
              <ExpenseDonutChart
                v-if="filteredExpenses?.length"
                :expenses="filteredExpenses"
                :categories="categories"
              ></ExpenseDonutChart>
            </AppCardBody>
          </AppCard>

          <AppCard>
            <div
              v-if="!filteredExpenses?.length"
              class="flex justify-center mt-6"
            >
              No expenses! Add one
            </div>

            <AppCardBody>
              <ExpenseItem
                v-for="expense in filteredExpenses"
                :key="expense.id"
                :expense="expense"
                :category="getCategory(expense.category)"
                class="border-b last:border-0 border-gray-300"
                @remove="expenseStore.removeExpense(expense.id)"
              ></ExpenseItem>
            </AppCardBody>
          </AppCard>
        </div>
      </div>
    </div>

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
