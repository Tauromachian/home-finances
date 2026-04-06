<script setup lang="ts">
import type { Income } from "~/types/income";

type FormMode = "edit" | "insert";

const appToaster = inject<Ref>("appToaster");

const incomeStreams = ref<Income[]>([]);
const isConfirmationDialogOpen = ref(false);

const formRef = useTemplateRef("formRef");

const EMPTY_INCOME: Income = {
  name: "",
  amount: 0,
  frequency: "",
  description: "",
};
const incomeForm = ref<Income>({ ...EMPTY_INCOME });

const isOpen = ref(false);
let formMode: FormMode = "insert";
let selectedId: number | string = "";

function deleteIncome() {
  const index = incomeStreams.value.findIndex(
    (stream: Income) => stream.id === selectedId,
  );

  incomeStreams.value.splice(index, 1);
  isConfirmationDialogOpen.value = false;
}

function openDeleteConfirmationDialog(id: string | number) {
  selectedId = id;
  isConfirmationDialogOpen.value = true;
}

function openForm(mode: FormMode, id?: string | number) {
  formMode = mode;

  if (mode === "insert") {
    incomeForm.value = { ...EMPTY_INCOME };
    formRef.value.internalRef.resetForm();
  } else {
    const expenseToEdit: Income = incomeStreams.value.find(
      (expense: Income) => expense.id === id,
    );

    selectedId = expenseToEdit.id;
    incomeForm.value = { ...expenseToEdit };
  }

  isOpen.value = true;
}

function showMessage(message: string) {
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast(message);
}

function submitForm(form: Income) {
  if (formMode === "insert") {
    incomeStreams.value.push(form);
    showMessage("New expense added!");
  } else {
    const indexOfIncome = incomeStreams.value.findIndex(
      (stream: Income) => stream?.id === selectedId,
    );

    incomeStreams.value[indexOfIncome] = form;
    showMessage("Expense edited");
  }
}

const totalIncome = computed<number>(() => {
  const total = incomeStreams.value.reduce((sum: number, current: Income) => {
    return (sum += current.amount);
  }, 0);

  return total;
});
</script>

<template>
  <div>
    <BaseButton class="mb-5" @click="openForm('insert')">
      <span class="text-xl">+</span> Add Income
    </BaseButton>

    <div class="grid md:grid-cols-3 gap-5">
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Total Income</p>
          <p class="text-3xl font-serif text-accent-0 mt-2">
            €{{ totalIncome }}
          </p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Monthly Cash Flow</p>
          <p class="text-3xl font-serif text-accent-0 mt-2">
            €{{ (totalIncome / 12).toFixed(2) }}
          </p>
        </AppCardBody>
      </AppCard>
    </div>

    <AppCard class="mt-5">
      <AppCardBody>
        <p class="text-sm">Income Streams</p>
        <template v-if="incomeStreams.length">
          <IncomeItem
            v-for="(stream, index) in incomeStreams"
            :key="`${index}-income-item`"
            :income="stream"
            variant="outlined"
            @delete="openDeleteConfirmationDialog"
            @edit="(id: string | number) => openForm('edit', id)"
          ></IncomeItem>
        </template>
        <div
          v-else
          class="flex flex-col items-center gap-5 justify-center my-6"
        >
          <Icon size="48" name="material-symbols-light:note-outline"></Icon>
          <p>No income! Add one</p>
        </div>
      </AppCardBody>
    </AppCard>

    <DialogConfirmDelete
      v-model="isConfirmationDialogOpen"
      @click:delete="deleteIncome"
    ></DialogConfirmDelete>

    <AppDialog v-model="isOpen">
      <IncomeForm
        ref="formRef"
        v-model="incomeForm"
        @submit="submitForm"
      ></IncomeForm>
    </AppDialog>
  </div>
</template>
