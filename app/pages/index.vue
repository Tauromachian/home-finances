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

const filteredExpenses = computed<Expense[]>(() => {
  const allExpenses = expenseStore.expenses;

  return allExpenses.filter((expense) => {
    if (selectedExpenseType.value === "All") return true;
    return expense.types === selectedExpenseType.value;
  });
});

const totalExpenses = computed(() => {
  return filteredExpenses.value.reduce((acum: number, next: Expense) => {
    acum += Number(next.amount);

    return acum;
  }, 0);
});

const monthlyExpenses = computed(() => {
  return filteredExpenses.value.reduce((acum: number, next: Expense) => {
    if (next.frequency === "Monthly") {
      const monthly = (next.amount / 12).toFixed(2);
      acum += Number(monthly);
    } else {
      acum += next.amount;
    }

    return acum;
  }, 0);
});

const categoriesCount = computed(() => {
  const categoriesObj = filteredExpenses.value.reduce(
    (acum: Record<string, boolean>, next: Expense) => {
      acum[next.category] = true;
      return acum;
    },
    {},
  );

  return Object.keys(categoriesObj).length;
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

    <div class="grid gap-5">
      <div class="grid grid-cols-3 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-sm">Total Expenses</p>
            <p class="text-3xl font-serif text-accent-0 mt-2">
              ${{ totalExpenses }}
            </p>
          </AppCardBody>
        </AppCard>
        <AppCard>
          <AppCardBody>
            <p class="text-sm">Monthly</p>
            <p class="text-3xl font-serif mt-2 text-text-1">
              ${{ monthlyExpenses }}
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

      <ExpenseCategory></ExpenseCategory>
    </div>

    <AppDialog v-model="isOpen">
      <ExpenseForm @submit="submitForm"></ExpenseForm>
    </AppDialog>
  </div>
</template>

<style lang="scss" scoped></style>
