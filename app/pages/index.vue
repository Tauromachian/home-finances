<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Expense } from "~/types/expense";

import { useExpenseStore } from "../stores/expenses";

type Frequency = "All" | "One time" | "Monthly" | "Annual";

const expenseStore = useExpenseStore();

const appToaster = inject<Ref>("appToaster");

const frequencies: Frequency[] = ["All", "One time", "Monthly", "Annual"];
const selectedExpenseType = ref<Frequency>("All");
const isOpen = ref(false);

function submitForm(form: Expense) {
  expenseStore.addExpense(form);
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast("New expense added!");
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

    <AppChipGroup v-model="selectedExpenseType" class="mb-4">
      <AppChip
        v-for="(frequency, index) in frequencies"
        :key="`expense-type-${index}`"
        :value="frequency"
      >
        {{ frequency }}
      </AppChip>
    </AppChipGroup>

    <div class="grid grid-rows-3">
      <div class="grid grid-cols-2 gap-5">
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

    <AppDialog v-model="isOpen">
      <ExpenseForm @submit="submitForm"></ExpenseForm>
    </AppDialog>
  </div>
</template>

<style lang="scss" scoped></style>
