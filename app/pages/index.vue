<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Expense } from "~/types/expense";

import { useExpenseStore } from "../stores/expenses";

type Frequency = "All" | "One time" | "Monthly" | "Annual";

const expenseStore = useExpenseStore();

const appToaster = inject<Ref>("appToaster");

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

    <div class="grid gap-5">
      <div class="grid md:grid-cols-3 gap-5">
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
      <div class="grid md:grid-cols-2 gap-5 max-h-120">
        <AppCard class="h-full max-h-[inherit]">
          <AppCardBody>
            <p class="text-md font-bold">Breakdown</p>
          </AppCardBody>

          <div
            v-if="!filteredExpenses?.length"
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols:note-outline"></Icon>

            <p>No expenses! Add one</p>
          </div>

          <AppCardBody>
            <ExpenseDonutChart
              v-if="filteredExpenses?.length"
              :expenses="filteredExpenses"
              :categories="categories"
            ></ExpenseDonutChart>
          </AppCardBody>
        </AppCard>

        <AppCard class="h-full max-h-[inherit]">
          <AppCardBody class="max-h-full">
            <p class="text-md font-bold mb-4">Expenses</p>
            <div class="flex flex-col gap-3 max-h-96 overflow-y-scroll">
              <ExpenseItem
                v-for="expense in filteredExpenses"
                :key="expense.id"
                :expense="expense"
                variant="outlined"
                :category="getCategory(expense.category)"
                @remove="expenseStore.removeExpense(expense.id)"
              ></ExpenseItem>
            </div>

            <div
              v-if="!filteredExpenses?.length"
              class="flex flex-col items-center gap-5 justify-center my-6"
            >
              <Icon size="48" name="material-symbols:note-outline"></Icon>
              <p>No expenses! Add one</p>
            </div>
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
