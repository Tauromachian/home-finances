<script setup lang="ts">
import { getIncomes as fetchIncomes } from "~/services/incomes";
import { getProgrammedIncomes as fetchProgrammedIncomes } from "~/services/programmedIncomes";
import { INCOME_COLUMNS } from "~/utils/spreadsheet";

import type { Income, ProgrammedIncome } from "~/types/income";
import { Frequency } from "~/types/frequency";

type FormMode = "edit" | "insert";
type FormKind = "actual" | "programmed";
type IncomesTab = "manage" | "frequent" | "reports" | "import-export";

const route = useRoute();
const router = useRouter();

// Sub-view is persisted in the query string (?tab=reports), so it
// survives reloads and can be shared. Defaults to "manage".
const activeTab = computed<IncomesTab>({
  get: () =>
    route.query.tab === "reports"
      ? "reports"
      : route.query.tab === "frequent"
        ? "frequent"
        : route.query.tab === "import-export"
          ? "import-export"
          : "manage",
  set: (tab: IncomesTab) => {
    const query = { ...route.query };

    if (tab === "manage") {
      delete query.tab;
    } else {
      query.tab = tab;
    }

    router.replace({ query });
  },
});

const incomes = ref<Income[]>([]);
const programmedIncomes = ref<ProgrammedIncome[]>([]);
const isLoading = ref(true);

const { inScope, activeGroupId } = useGroups();

const scopedIncomes = computed(() => inScope(incomes.value));
const scopedProgrammedIncomes = computed(() =>
  inScope(programmedIncomes.value),
);

async function loadIncomes() {
  isLoading.value = true;
  incomes.value = await fetchIncomes();
  isLoading.value = false;
}

async function loadProgrammedIncomes() {
  isLoading.value = true;
  programmedIncomes.value = await fetchProgrammedIncomes();
  isLoading.value = false;
}

const formRef = useTemplateRef("formRef");
const programmedFormRef = useTemplateRef("programmedFormRef");

const activeFormRef = computed(() =>
  formKind.value === "programmed" ? programmedFormRef.value : formRef.value,
);

const appToaster = inject<Ref>("appToaster");

const EMPTY_INCOME: Income = {
  name: "",
  amount: 0,
  incomeDate: "",
  description: "",
  groupId: null,
};

const EMPTY_PROGRAMMED_INCOME: ProgrammedIncome = {
  name: "",
  amount: 0,
  frequency: Frequency.MONTHLY,
  description: "",
  chargeDay: null,
  chargeMonth: null,
  groupId: null,
};

const incomeForm = ref<Income>({ ...EMPTY_INCOME });
const programmedIncomeForm = ref<ProgrammedIncome>({
  ...EMPTY_PROGRAMMED_INCOME,
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

async function submitForm(form: Income | ProgrammedIncome) {
  const isProgrammed = formKind.value === "programmed";
  const url = isProgrammed ? "/api/programmed-incomes" : "/api/incomes";

  if (formMode.value === "insert") {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("New income added!");
  } else {
    await fetch(`${url}/${selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("Income edited");
  }

  if (isProgrammed) {
    loadProgrammedIncomes();
  } else {
    loadIncomes();
  }
}

async function openForm(mode: FormMode, income?: Income | ProgrammedIncome) {
  formMode.value = mode;
  formKind.value = activeTab.value === "frequent" ? "programmed" : "actual";

  if (mode === "insert") {
    if (formKind.value === "programmed") {
      programmedIncomeForm.value = {
        ...EMPTY_PROGRAMMED_INCOME,
        groupId: activeGroupId.value,
      };
    } else {
      incomeForm.value = { ...EMPTY_INCOME, groupId: activeGroupId.value };
    }

    await nextTick();
    activeFormRef.value?.resetForm();
  } else {
    if (!income) throw new Error("You need to pass an income for the edit");

    selectedId = income.id;

    if (formKind.value === "programmed") {
      programmedIncomeForm.value = { ...(income as ProgrammedIncome) };
    } else {
      incomeForm.value = { ...(income as Income) };
    }
  }

  isOpen.value = true;
}

function openDeleteConfirmationDialog(id: string | number, kind: FormKind) {
  selectedId = id;
  deleteKind.value = kind;
  isConfirmationDialogOpen.value = true;
}

async function deleteIncome() {
  const isProgrammed = deleteKind.value === "programmed";
  const url = isProgrammed ? "/api/programmed-incomes" : "/api/incomes";

  await fetch(`${url}/${selectedId}`, { method: "DELETE" });
  isConfirmationDialogOpen.value = false;

  if (isProgrammed) {
    loadProgrammedIncomes();
  } else {
    loadIncomes();
  }
}

onBeforeMount(() => {
  loadIncomes();
  loadProgrammedIncomes();
});
</script>

<template>
  <div>
    <div class="flex items-center mb-5">
      <BaseButtonGroup
        aria-label="Incomes view"
        data-testid="incomes-view-toggle"
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
        <BaseButton
          :variant="activeTab === 'import-export' ? 'regular' : 'outlined'"
          @click="activeTab = 'import-export'"
        >
          Import / Export
        </BaseButton>
      </BaseButtonGroup>
    </div>

    <IncomeManageTab
      v-if="activeTab === 'manage'"
      :incomes="scopedIncomes"
      :is-loading="isLoading"
      @add="openForm('insert')"
      @edit="(income) => openForm('edit', income)"
      @delete="(id) => openDeleteConfirmationDialog(id, 'actual')"
    />

    <IncomeFrequentTab
      v-else-if="activeTab === 'frequent'"
      :incomes="scopedProgrammedIncomes"
      :is-loading="isLoading"
      @add="openForm('insert')"
      @edit="(income) => openForm('edit', income)"
      @delete="(id) => openDeleteConfirmationDialog(id, 'programmed')"
    />

    <div v-else-if="activeTab === 'import-export'">
      <ImportExportTab
        :records="scopedIncomes"
        :columns="INCOME_COLUMNS"
        import-url="/api/incomes/import"
        entity-name="income"
        date-key="incomeDate"
        @imported="loadIncomes"
      />
    </div>

    <IncomeReportsTab v-else :incomes="scopedIncomes" />

    <DialogConfirmDelete
      v-model="isConfirmationDialogOpen"
      @click:delete="deleteIncome"
    ></DialogConfirmDelete>

    <AppDialog v-model="isOpen">
      <IncomeForm
        v-if="formKind === 'actual'"
        ref="formRef"
        v-model="incomeForm"
        :form-mode="formMode"
        @submit="submitForm"
      ></IncomeForm>
      <IncomeProgrammedForm
        v-else
        ref="programmedFormRef"
        v-model="programmedIncomeForm"
        :form-mode="formMode"
        @submit="submitForm"
      ></IncomeProgrammedForm>
    </AppDialog>
  </div>
</template>
