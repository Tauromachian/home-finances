<script setup lang="ts">
import { getExpenses as fetchExpenses } from "~/services/expenses";
import { getProgrammedExpenses as fetchProgrammedExpenses } from "~/services/programmedExpenses";
import { EXPENSE_COLUMNS } from "~/utils/spreadsheet";

import type { Expense, ProgrammedExpense } from "~/types/expense";
import { Frequency } from "~/types/frequency";
import type { Filter } from "~/types/filter";

type FormMode = "edit" | "insert";
type FormKind = "actual" | "programmed";
type ExpensesTab = "manage" | "frequent" | "reports" | "import-export";

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
        : route.query.tab === "import-export"
          ? "import-export"
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

const { inScope, activeGroupId } = useGroups();

const expenses = ref<Expense[]>([]);
const programmedExpenses = ref<ProgrammedExpense[]>([]);
const isLoading = ref(true);

const scopedExpenses = computed(() => inScope(expenses.value));
const scopedProgrammedExpenses = computed(() =>
  inScope(programmedExpenses.value),
);

async function loadExpenses(filter?: Filter) {
  isLoading.value = true;
  expenses.value = await fetchExpenses({ ...filter });
  isLoading.value = false;
}

async function loadProgrammedExpenses() {
  isLoading.value = true;
  programmedExpenses.value = await fetchProgrammedExpenses();
  isLoading.value = false;
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
  groupId: null,
};

const EMPTY_PROGRAMMED_EXPENSE: ProgrammedExpense = {
  name: "",
  amount: 0,
  category: "",
  frequency: Frequency.MONTHLY,
  description: "",
  chargeDay: null,
  chargeMonth: null,
  groupId: null,
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
      programmedExpenseForm.value = {
        ...EMPTY_PROGRAMMED_EXPENSE,
        groupId: activeGroupId.value,
      };
    } else {
      expenseForm.value = { ...EMPTY_EXPENSE, groupId: activeGroupId.value };
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
        v-model="activeTab"
        aria-label="Expenses view"
        data-testid="expenses-view-toggle"
      >
        <BaseButton
          :variant="activeTab === 'manage' ? 'regular' : 'outlined'"
          value="manage"
        >
          Manage
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'frequent' ? 'regular' : 'outlined'"
          value="frequent"
        >
          Frequent
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'reports' ? 'regular' : 'outlined'"
          value="reports"
        >
          Reports
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'import-export' ? 'regular' : 'outlined'"
          value="import-export"
        >
          Import / Export
        </BaseButton>
      </BaseButtonGroup>
    </div>

    <ExpenseManageTab
      v-if="activeTab === 'manage'"
      :expenses="scopedExpenses"
      :is-loading="isLoading"
      @add="openForm('insert')"
      @edit="(expense) => openForm('edit', expense)"
      @delete="(id) => openDeleteConfirmationDialog(id, 'actual')"
      @filter-change="loadExpenses"
    />

    <ExpenseFrequentTab
      v-else-if="activeTab === 'frequent'"
      :expenses="scopedProgrammedExpenses"
      :is-loading="isLoading"
      @add="openForm('insert')"
      @edit="(expense) => openForm('edit', expense)"
      @delete="(id) => openDeleteConfirmationDialog(id, 'programmed')"
    />

    <div v-else-if="activeTab === 'import-export'">
      <ImportExportTab
        :records="scopedExpenses"
        :columns="EXPENSE_COLUMNS"
        import-url="/api/expenses/import"
        entity-name="expense"
        date-key="expenseDate"
        @imported="loadExpenses"
      />
    </div>

    <ExpenseReportsTab v-else :expenses="scopedExpenses" />

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
