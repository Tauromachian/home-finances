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
        <div v-if="!filteredExpenses?.length" class="flex justify-center mt-6">
          No expenses! Add one
        </div>

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
        <div v-if="!filteredExpenses?.length" class="flex justify-center mt-6">
          No expenses! Add one
        </div>

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
  </div>
</template>
