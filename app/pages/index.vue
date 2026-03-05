<script setup lang="ts">
import { expensesCategories } from "~/utils/categories";

import type { Expense } from "~/types/expense";

import { useExpenseStore } from "../stores/expenses";

type Frequency = "All" | "One time" | "Monthly" | "Annual";
type FormMode = "edit" | "insert";

const expenseStore = useExpenseStore();

const formRef = useTemplateRef("formRef");

const appToaster = inject<Ref>("appToaster");

const expenseForm = ref<Partial<Expense>>();
const selectedExpenseType = ref<Frequency>("All");
const isOpen = ref(false);
const isConfirmationDialogOpen = ref(false);

const EMPTY_EXPENSE: Expense = {
  name: "",
  amount: 0,
  category: "",
  frequency: "",
  description: "",
};

let selectedId: number | string = "";
let formMode: FormMode;

function showMessage(message: string) {
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast(message);
}

function submitForm(form: Expense) {
  if (formMode === "insert") {
    expenseStore.addExpense(form);
    showMessage("New expense added!");
  } else {
    expenseStore.editExpense(selectedId, form);
    showMessage("Expense edited");
  }
}

function openForm(mode: FormMode, id?: string | number) {
  formMode = mode;

  if (mode === "insert") {
    expenseForm.value = { ...EMPTY_EXPENSE };

    formRef.value.internalRef.resetForm();
  } else {
    const expenseToEdit: Expense = expenseStore.expenses.find(
      (expense: Expense) => expense.id === id,
    );

    selectedId = expenseToEdit.id;
    expenseForm.value = { ...expenseToEdit };
  }

  isOpen.value = true;
}

function openDeleteConfirmationDialog(id: string | number) {
  selectedId = id;
  isConfirmationDialogOpen.value = true;
}

function deleteExpense() {
  expenseStore.removeExpense(selectedId);
  isConfirmationDialogOpen.value = false;
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
    <BaseButton class="mb-5" @click="openForm('insert')">
      <span class="text-xl">+</span> Add Expense
    </BaseButton>

    <div class="grid gap-5">
      <div class="grid md:grid-cols-3 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-sm">Total Expenses</p>
            <p class="text-3xl font-serif text-accent-0 mt-2">
              €{{ totalExpenses }}
            </p>
          </AppCardBody>
        </AppCard>
        <AppCard>
          <AppCardBody>
            <p class="text-sm">Monthly</p>
            <p class="text-3xl font-serif mt-2 text-text-1">
              €{{ monthlyExpenses }}
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
            <Icon size="48" name="material-symbols-light:note-outline"></Icon>

            <p>No expenses! Add one</p>
          </div>

          <AppCardBody>
            <ExpenseDonutChart
              v-if="filteredExpenses?.length"
              :expenses="filteredExpenses"
              :categories="expensesCategories"
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
                :category="
                  getCategoryByName(expense.category, expensesCategories)
                "
                @delete="openDeleteConfirmationDialog"
                @edit="(id: string | number) => openForm('edit', id)"
              ></ExpenseItem>
            </div>

            <div
              v-if="!filteredExpenses?.length"
              class="flex flex-col items-center gap-5 justify-center my-6"
            >
              <Icon size="48" name="material-symbols-light:note-outline"></Icon>
              <p>No expenses! Add one</p>
            </div>
          </AppCardBody>
        </AppCard>
      </div>
    </div>

    <DialogConfirmDelete
      v-model="isConfirmationDialogOpen"
      @click:delete="deleteExpense"
    ></DialogConfirmDelete>

    <AppDialog v-model="isOpen">
      <ExpenseForm
        ref="formRef"
        v-model="expenseForm"
        @submit="submitForm"
      ></ExpenseForm>
    </AppDialog>
  </div>
</template>
