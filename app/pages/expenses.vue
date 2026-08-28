<script setup lang="ts">
import { expensesCategories } from "~/utils/categories";

import type { Expense } from "~/types/expense";

type FormMode = "edit" | "insert";

const expenses = ref<Expense[]>([]);

const formRef = useTemplateRef("formRef");

const appToaster = inject<Ref>("appToaster");

const expenseForm = ref<Partial<Expense>>();
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
const formMode = ref<FormMode>("insert");

function showMessage(message: string) {
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast(message);
}

async function submitForm(form: Expense) {
  if (formMode.value === "insert") {
    await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("New expense added!");
  } else {
    await fetch("/api/expenses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("Expense edited");
  }

  loadData();
}

function openForm(mode: FormMode, expense?: Expense) {
  formMode.value = mode;

  if (mode === "insert") {
    expenseForm.value = { ...EMPTY_EXPENSE };

    formRef.value.internalRef.resetForm();
  } else {
    if (!expense) throw new Error("You need to pass an expense for the edit");

    selectedId = expense.id;

    expenseForm.value = {
      ...expense,
    };
  }

  isOpen.value = true;
}

function openDeleteConfirmationDialog(id: string | number) {
  selectedId = id;
  isConfirmationDialogOpen.value = true;
}

async function deleteExpense() {
  await fetch(`/api/expenses/${selectedId}`, { method: "DELETE" });
  isConfirmationDialogOpen.value = false;
  loadData();
}

const yearlyExpenses = computed(() => {
  return expenses.value.reduce((acum: number, next: Expense) => {
    if (next.frequency === "Yearly") {
      acum += Number(next.amount);
    } else if (next.frequency === "Monthly") {
      const yearly = next.amount * 12;
      acum += yearly;
    } else {
      acum += next.amount;
    }

    return acum;
  }, 0);
});

const monthlyExpenses = computed(() => {
  return expenses.value.reduce((acum: number, next: Expense) => {
    if (next.frequency === "Monthly" || next.frequency === "One Time") {
      acum += next.amount;
    } else if (next) {
      const monthly = (next.amount / 12).toFixed(2);
      acum += Number(monthly);
    }

    return acum;
  }, 0);
});

const categoriesCount = computed(() => {
  const categoriesObj = expenses.value.reduce(
    (acum: Record<string, boolean>, next: Expense) => {
      acum[next.category] = true;
      return acum;
    },
    {},
  );

  return Object.keys(categoriesObj).length;
});

async function loadData() {
  const res = await fetch("/api/expenses");
  const data = await res.json();
  expenses.value = data.data;
}

onBeforeMount(() => loadData());
</script>

<template>
  <div>
    <BaseButton class="mb-5" @click="openForm('insert')">
      <span class="text-xl">+</span> Add Expense
    </BaseButton>

    <div class="flex flex-col gap-5">
      <div class="grid md:grid-cols-3 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-sm">Yearly Expenses</p>
            <p class="text-3xl font-serif text-accent-0 mt-2">
              €{{ yearlyExpenses }}
            </p>
          </AppCardBody>
        </AppCard>
        <AppCard>
          <AppCardBody>
            <p class="text-sm">Monthly Expenses</p>
            <p class="text-3xl font-serif mt-2 text-text-1">
              €{{ monthlyExpenses.toFixed(2) }}
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
            v-if="!expenses?.length"
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols-light:note-outline"></Icon>

            <p>No expenses! Add one</p>
          </div>

          <div class="py-4 md:px-6">
            <ClientOnly>
              <ExpenseDonutChart
                v-if="expenses?.length"
                :expenses="expenses"
                :categories="expensesCategories"
              ></ExpenseDonutChart>
              <template #fallback>
                <AppLoader size="80" class="my-40"></AppLoader>
              </template>
            </ClientOnly>
          </div>
        </AppCard>

        <AppCard class="h-full max-h-[inherit]">
          <AppCardBody class="max-h-full">
            <p class="text-md font-bold mb-4">Expenses</p>
            <div
              class="flex flex-col gap-3 max-h-96 overflow-y-scroll"
              data-testid="expenses-items"
            >
              <ExpenseItem
                v-for="expense in expenses"
                :key="expense.id"
                :expense="expense"
                variant="outlined"
                :category="
                  getCategoryByName(expense.category, expensesCategories)
                "
                @delete="openDeleteConfirmationDialog"
                @edit="openForm('edit', expense)"
              ></ExpenseItem>
            </div>

            <div
              v-if="!expenses?.length"
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
        :form-mode="formMode"
        @submit="submitForm"
      ></ExpenseForm>
    </AppDialog>
  </div>
</template>
