<script setup lang="ts">
import { expensesCategories } from "~/utils/categories";
import { loadExpenses as fetchExpenses } from "~/services/expenses";
import { loadProgrammedExpenses as fetchProgrammedExpenses } from "~/services/programmedExpenses";

import type { Expense, ProgrammedExpense } from "~/types/expense";
import { Frequency } from "~/types/frequency";

type FormMode = "edit" | "insert";
type FormKind = "actual" | "programmed";
type ExpensesTab = "manage" | "frequent" | "reports";

const route = useRoute();
const router = useRouter();

// Sub-view is persisted in the query string (?tab=reports), so it
// survives reloads and can be shared. Defaults to "manage".
const activeTab = computed<ExpensesTab>({
  get: () =>
    route.query.tab === "reports"
      ? "reports"
      : route.query.tab === "frequent"
        ? "frequent"
        : "manage",
  set: (tab: ExpensesTab) => {
    const query = { ...route.query };

    if (tab === "manage") {
      delete query.tab;
    } else {
      query.tab = tab;
    }

    router.replace({ query });
  },
});

const expenses = ref<Expense[]>([]);
const programmedExpenses = ref<ProgrammedExpense[]>([]);

const currentYear = new Date().getFullYear();

const { yearlyExpenses, monthlyExpenses, categoriesCount, yearToDateExpenses } =
  useExpenses(expenses);

async function loadExpenses() {
  expenses.value = await fetchExpenses();
}

async function loadProgrammedExpenses() {
  programmedExpenses.value = await fetchProgrammedExpenses();
}

const formRef = useTemplateRef("formRef");

const appToaster = inject<Ref>("appToaster");

const EMPTY_EXPENSE: Expense = {
  name: "",
  amount: 0,
  category: "",
  date: "",
  description: "",
};

const EMPTY_PROGRAMMED_EXPENSE: ProgrammedExpense = {
  name: "",
  amount: 0,
  category: "",
  frequency: Frequency.MONTHLY,
  description: "",
  chargeDay: null,
  chargeMonth: null,
};

const expenseForm = ref<Expense | ProgrammedExpense>({ ...EMPTY_EXPENSE });
const formKind = ref<FormKind>("actual");
const deleteKind = ref<FormKind>("actual");
const isOpen = ref(false);
const isConfirmationDialogOpen = ref(false);

let selectedId: number | string = "";
const formMode = ref<FormMode>("insert");

function showMessage(message: string) {
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast(message);
}

async function submitForm(form: Expense | ProgrammedExpense) {
  const isProgrammed = formKind.value === "programmed";
  const url = isProgrammed ? "/api/programmed-expenses" : "/api/expenses";

  if (formMode.value === "insert") {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("New expense added!");
  } else {
    await fetch(`${url}/${selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("Expense edited");
  }

  if (isProgrammed) {
    loadProgrammedExpenses();
  } else {
    loadExpenses();
  }
}

function openForm(mode: FormMode, expense?: Expense | ProgrammedExpense) {
  formMode.value = mode;
  formKind.value = activeTab.value === "frequent" ? "programmed" : "actual";

  if (mode === "insert") {
    expenseForm.value =
      formKind.value === "programmed"
        ? { ...EMPTY_PROGRAMMED_EXPENSE }
        : { ...EMPTY_EXPENSE };

    formRef.value.resetForm();
  } else {
    if (!expense) throw new Error("You need to pass an expense for the edit");

    selectedId = expense.id;

    expenseForm.value = {
      ...expense,
    };
  }

  isOpen.value = true;
}

function openDeleteConfirmationDialog(id: string | number, kind: FormKind) {
  selectedId = id;
  deleteKind.value = kind;
  isConfirmationDialogOpen.value = true;
}

async function deleteExpense() {
  const isProgrammed = deleteKind.value === "programmed";
  const url = isProgrammed ? "/api/programmed-expenses" : "/api/expenses";

  await fetch(`${url}/${selectedId}`, { method: "DELETE" });
  isConfirmationDialogOpen.value = false;

  if (isProgrammed) {
    loadProgrammedExpenses();
  } else {
    loadExpenses();
  }
}

onBeforeMount(() => {
  loadExpenses();
  loadProgrammedExpenses();
});
</script>

<template>
  <div>
    <div class="flex items-center mb-5">
      <BaseButtonGroup
        aria-label="Expenses view"
        data-testid="expenses-view-toggle"
      >
        <BaseButton
          :variant="activeTab === 'manage' ? 'regular' : 'outlined'"
          @click="activeTab = 'manage'"
        >
          Manage
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'frequent' ? 'regular' : 'outlined'"
          @click="activeTab = 'frequent'"
        >
          Frequent
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'reports' ? 'regular' : 'outlined'"
          @click="activeTab = 'reports'"
        >
          Reports
        </BaseButton>
      </BaseButtonGroup>
    </div>

    <div v-if="activeTab === 'manage'" class="flex flex-col gap-5">
      <AppCard>
        <AppCardBody>
          <BaseButton class="mb-5" @click="openForm('insert')">
            <span class="text-xl">+</span> Add Expense
          </BaseButton>
          <div class="flex flex-col gap-3" data-testid="expenses-items">
            <ExpenseItem
              v-for="expense in expenses"
              :key="expense.id"
              :expense="expense"
              variant="outlined"
              :category="
                getCategoryByName(expense.category, expensesCategories)
              "
              @delete="(id) => openDeleteConfirmationDialog(id, 'actual')"
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

    <div v-else-if="activeTab === 'frequent'" class="flex flex-col gap-5">
      <AppCard>
        <AppCardBody>
          <BaseButton class="mb-5" @click="openForm('insert')">
            <span class="text-xl">+</span> Add Expense
          </BaseButton>
          <div
            class="flex flex-col gap-3"
            data-testid="frequent-expenses-items"
          >
            <ExpenseItem
              v-for="expense in programmedExpenses"
              :key="expense.id"
              :expense="expense"
              variant="outlined"
              :category="
                getCategoryByName(expense.category, expensesCategories)
              "
              @delete="(id) => openDeleteConfirmationDialog(id, 'programmed')"
              @edit="openForm('edit', expense)"
            ></ExpenseItem>
          </div>

          <div
            v-if="!programmedExpenses?.length"
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols-light:note-outline"></Icon>
            <p>No frequent expenses! Add one</p>
          </div>
        </AppCardBody>
      </AppCard>
    </div>

    <div v-else class="flex flex-col gap-5">
      <div class="grid md:grid-cols-3 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-sm">Yearly Expenses</p>
            <p class="text-3xl font-serif text-accent-0 mt-2">
              €{{ yearlyExpenses.toFixed(2) }}
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

      <div
        v-if="!expenses?.length"
        class="flex flex-col items-center gap-5 justify-center my-6"
      >
        <Icon size="48" name="material-symbols-light:note-outline"></Icon>

        <p>No expenses! Add one</p>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">Breakdown ({{ currentYear }})</p>
          </AppCardBody>

          <div class="py-4 md:px-6">
            <ClientOnly>
              <ExpenseDonutChart
                :expenses="yearToDateExpenses"
                :categories="expensesCategories"
              ></ExpenseDonutChart>
              <template #fallback>
                <AppLoader size="80" class="my-40"></AppLoader>
              </template>
            </ClientOnly>
          </div>
        </AppCard>

        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">
              Expenses by Month ({{ currentYear }})
            </p>
          </AppCardBody>

          <div class="py-4 md:px-6">
            <ClientOnly>
              <ExpenseLineChart :expenses="expenses"></ExpenseLineChart>
              <template #fallback>
                <AppLoader size="80" class="my-40"></AppLoader>
              </template>
            </ClientOnly>
          </div>
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
        :kind="formKind"
        @submit="submitForm"
      ></ExpenseForm>
    </AppDialog>
  </div>
</template>
