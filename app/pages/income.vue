<script setup lang="ts">
import {
  createIncome,
  deleteIncome as removeIncome,
  getIncomes as fetchIncomes,
  updateIncome,
} from "~/services/incomes";
import {
  createProgrammedIncome,
  deleteProgrammedIncome as removeProgrammedIncome,
  getProgrammedIncomes as fetchProgrammedIncomes,
  updateProgrammedIncome,
} from "~/services/programmedIncomes";
import { INCOME_COLUMNS } from "~/utils/spreadsheet";

import type { FormIncome, Income, ProgrammedIncome } from "~/types/income";
import { Frequency } from "~/types/frequency";

type FormMode = "edit" | "insert";
type FormKind = "actual" | "programmed";

const INCOME_TABS = ["manage", "frequent", "reports", "import-export"] as const;

// Sub-view is persisted in the query string (?tab=reports), so it
// survives reloads and can be shared. Defaults to "manage".
const { activeTab } = useTab("manage", INCOME_TABS);

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

const EMPTY_INCOME: FormIncome = {
  name: "",
  amount: 0,
  incomeDate: "",
  description: "",
};

const EMPTY_PROGRAMMED_INCOME: ProgrammedIncome = {
  name: "",
  amount: 0,
  frequency: Frequency.MONTHLY,
  description: "",
  chargeDay: null,
  chargeMonth: null,
};

const incomeForm = ref<FormIncome>({ ...EMPTY_INCOME });
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

async function submitForm(form: Income | ProgrammedIncome | FormIncome) {
  const isProgrammed = formKind.value === "programmed";

  if (formMode.value === "insert") {
    if (isProgrammed) {
      await createProgrammedIncome(form as ProgrammedIncome);
    } else {
      const newIncome = await createIncome(form as FormIncome);
      incomes.value.push(newIncome);
    }

    showMessage("New income added!");
  } else {
    if (isProgrammed) {
      await updateProgrammedIncome(selectedId, form as ProgrammedIncome);
    } else {
      await updateIncome(selectedId, form as FormIncome);
      loadIncomes();
    }

    showMessage("Income edited");
  }

  if (isProgrammed) {
    loadProgrammedIncomes();
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

  if (isProgrammed) {
    await removeProgrammedIncome(selectedId);
  } else {
    await removeIncome(selectedId);
  }

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
        v-model="activeTab"
        aria-label="Incomes view"
        data-testid="incomes-view-toggle"
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
