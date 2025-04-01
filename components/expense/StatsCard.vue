<script setup>
import { useExpenseStore } from "../stores/expenses";

import { categories } from "../utils/categories";

const expenseStore = useExpenseStore();

const chartKey = ref(0);
const frequencies = ref(["All", "One time", "Monthly", "Annual"]);
const selectedExpenseType = ref("All");

const filteredExpenses = computed(() => {
  const allExpenses = expenseStore.expenses;

  return allExpenses.filter((expense) => {
    if (selectedExpenseType.value === "All") return true;
    return expense.types === selectedExpenseType.value;
  });
});

watch(filteredExpenses, () => chartKey.value++);

function getCategory(category) {
  return categories[
    categories.findIndex((item) => {
      return item.name == category;
    })
  ];
}
</script>

<template>
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

    <div class="flex gap-3">
      <AppCard>
        <AppCardBody>
          <ExpenseDonutChart
            v-if="filteredExpenses?.length"
            :key="chartKey"
            :expenses="filteredExpenses"
            :categories="categories"
          ></ExpenseDonutChart>
        </AppCardBody>
      </AppCard>

      <AppCard>
        <AppCardBody>
          <ExpenseItem
            v-for="expense in filteredExpenses"
            :key="expense.id"
            :expense="expense"
            :category="getCategory(expense.categories)"
            class="border-b last:border-0 border-gray-300"
            @remove="expenseStore.removeExpense(expense.id)"
          ></ExpenseItem>
        </AppCardBody>
      </AppCard>
    </div>
    <div class="max-h-screen overflow-scroll relative">
      <div v-if="!filteredExpenses?.length" class="text-center my-20">
        No expenses! Add one
      </div>
      <template v-else> </template>
    </div>
  </div>
</template>
