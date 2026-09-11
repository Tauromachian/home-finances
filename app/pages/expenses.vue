<script setup lang="ts">
import { expensesCategories } from "~/utils/categories";
import {
  defaultReportRange,
  endOfPreviousMonth,
  formatExpenseDate,
  parseIsoDate,
} from "~/utils/expensePeriod";
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

const reportDefaults = defaultReportRange();
const reportStart = ref(reportDefaults.start);
const reportEnd = ref(reportDefaults.end);

// Clearing a picker leaves that side empty; resolve it back to the
// default so stats and charts always share the same range.
const reportRange = computed(() => {
  const end = reportEnd.value || endOfPreviousMonth();
  const endYear = parseIsoDate(end)?.year ?? new Date().getFullYear();
  const start = reportStart.value || `${endYear}-01-01`;

  return { start, end };
});

const reportRangeLabel = computed(
  () =>
    `${formatExpenseDate(reportRange.value.start)} – ${formatExpenseDate(reportRange.value.end)}`,
);

const { yearlyExpenses, monthlyExpenses, categoriesCount, yearToDateExpenses } =
  useExpenses(expenses, new Date(), reportRange);

async function loadExpenses() {
  expenses.value = await fetchExpenses();
}

async function loadProgrammedExpenses() {
  programmedExpenses.value = await fetchProgrammedExpenses();
}

const formRef = useTemplateRef("formRef");
const programmedFormRef = useTemplateRef("programmedFormRef");

const activeFormRef = computed(() =>
  formKind.value === "programmed" ? programmedFormRef.value : formRef.value,
);

const appToaster = inject<Ref>("appToaster");

const EMPTY_EXPENSE: Expense = {
  name: "",
  amount: 0,
  category: "",
  expenseDate: "",
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

const expenseForm = ref<Expense>({ ...EMPTY_EXPENSE });
const programmedExpenseForm = ref<ProgrammedExpense>({
  ...EMPTY_PROGRAMMED_EXPENSE,
});
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

async function openForm(mode: FormMode, expense?: Expense | ProgrammedExpense) {
  formMode.value = mode;
  formKind.value = activeTab.value === "frequent" ? "programmed" : "actual";

  if (mode === "insert") {
    if (formKind.value === "programmed") {
      programmedExpenseForm.value = { ...EMPTY_PROGRAMMED_EXPENSE };
    } else {
      expenseForm.value = { ...EMPTY_EXPENSE };
    }

    await nextTick();
    activeFormRef.value?.resetForm();
  } else {
    if (!expense) throw new Error("You need to pass an expense for the edit");

    selectedId = expense.id;

    if (formKind.value === "programmed") {
      programmedExpenseForm.value = { ...(expense as ProgrammedExpense) };
    } else {
      expenseForm.value = { ...(expense as Expense) };
    }
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
            <span class="text-xl">+</span> Program Expense
          </BaseButton>
          <div
            class="flex flex-col gap-3"
            data-testid="frequent-expenses-items"
          >
            <ExpenseProgrammedItem
              v-for="expense in programmedExpenses"
              :key="expense.id"
              :expense="expense"
              variant="outlined"
              :category="
                getCategoryByName(expense.category, expensesCategories)
              "
              @delete="(id) => openDeleteConfirmationDialog(id, 'programmed')"
              @edit="openForm('edit', expense)"
            ></ExpenseProgrammedItem>
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
      <AppCard>
        <AppCardBody>
          <div
            class="grid sm:grid-cols-2 gap-x-5"
            data-testid="reports-time-filter"
          >
            <div data-testid="reports-start-date">
              <AppDatePicker
                v-model="reportStart"
                label="Start date"
                placeholder="Select start date"
                :max="reportRange.end"
              />
            </div>
            <div data-testid="reports-end-date">
              <AppDatePicker
                v-model="reportEnd"
                label="End date"
                placeholder="Select end date"
                :min="reportRange.start"
              />
            </div>
          </div>
        </AppCardBody>
      </AppCard>

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
        v-if="!yearToDateExpenses?.length"
        class="flex flex-col items-center gap-5 justify-center my-6"
      >
        <Icon size="48" name="material-symbols-light:note-outline"></Icon>

        <p>No expenses in this period! Add one</p>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">Breakdown ({{ reportRangeLabel }})</p>
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
              Expenses by Month ({{ reportRangeLabel }})
            </p>
          </AppCardBody>

          <div class="py-4 md:px-6">
            <ClientOnly>
              <ExpenseLineChart
                :expenses="yearToDateExpenses"
                :start="reportRange.start"
                :end="reportRange.end"
              ></ExpenseLineChart>
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
        v-if="formKind === 'actual'"
        ref="formRef"
        v-model="expenseForm"
        :form-mode="formMode"
        @submit="submitForm"
      ></ExpenseForm>
      <ExpenseProgrammedForm
        v-else
        ref="programmedFormRef"
        v-model="programmedExpenseForm"
        :form-mode="formMode"
        @submit="submitForm"
      ></ExpenseProgrammedForm>
    </AppDialog>
  </div>
</template>
