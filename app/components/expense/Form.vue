<script setup lang="ts">
import { Form } from "vee-validate";

import { required, positiveNumber, chargeDay } from "@/utils/rules";
import { expensesCategories } from "@/utils/categories";
import { frequentFrequencies } from "@/utils/frequencies";
import { monthItems, getMonthTitle, parseMonthValue } from "@/utils/months";

import type { Item } from "@/types/item";
import type { Frequency } from "~/types/frequency";
import { Frequency as FrequencyValues } from "~/types/frequency";
import type { Expense, ProgrammedExpense } from "~/types/expense";

type FormMode = "edit" | "insert";
type FormKind = "actual" | "programmed";

const props = defineProps<{
  formMode: FormMode;
  kind: FormKind;
}>();

const modelValue = defineModel<Expense | ProgrammedExpense>();

const emit = defineEmits<{
  submit: [expense: Expense | ProgrammedExpense];
}>();

const formRef = useTemplateRef<typeof Form>("formRef");

const dateError = ref("");

const formattedCategories = computed(() => {
  return expensesCategories.map((item) => ({
    title: item.name,
    value: item.name,
    icon: {
      name: item.icon,
      color: item.color,
    },
  }));
});

// Actual expenses carry their date outside vee-validate state,
// through the date picker bound below.
const actualDate = computed({
  get: () => (modelValue.value as Expense)?.date ?? "",
  set: (value: string) => {
    if (modelValue.value) (modelValue.value as Expense).date = value;
  },
});

watch(actualDate, (date) => {
  if (date) dateError.value = "";
});

const programmedModel = computed(() => modelValue.value as ProgrammedExpense);

// The frequency autocomplete only flows one-way into vee-validate state,
// so track the selection locally to drive the conditional charge fields.
const selectedFrequency = ref<Frequency>(
  modelValue.value && "frequency" in modelValue.value
    ? modelValue.value.frequency
    : FrequencyValues.MONTHLY,
);

watch(
  () => modelValue.value && "frequency" in modelValue.value,
  (hasFrequency) => {
    if (hasFrequency && modelValue.value && "frequency" in modelValue.value) {
      selectedFrequency.value = modelValue.value.frequency;
    }
  },
);

const showChargeMonth = computed(
  () => selectedFrequency.value === FrequencyValues.YEARLY,
);

const chargeMonthLabel = computed(() =>
  getMonthTitle(
    modelValue.value && "chargeMonth" in modelValue.value
      ? modelValue.value.chargeMonth
      : null,
  ),
);

function onSelectFrequency(item: Item) {
  selectedFrequency.value = item.value as Frequency;
}

function onSubmit(values: Expense | ProgrammedExpense) {
  if (props.kind === "actual") {
    if (!actualDate.value) {
      dateError.value = "Date is required";
      return;
    }

    dateError.value = "";
    emit("submit", { ...values, date: actualDate.value } as Expense);
  } else {
    const normalized = { ...values } as ProgrammedExpense;

    if (normalized.frequency === FrequencyValues.YEARLY) {
      const day = Number(normalized.chargeDay);
      normalized.chargeDay =
        Number.isInteger(day) && day >= 1 && day <= 31 ? day : null;
      normalized.chargeMonth = parseMonthValue(normalized.chargeMonth);
    } else {
      const day = Number(normalized.chargeDay);
      normalized.chargeDay =
        Number.isInteger(day) && day >= 1 && day <= 31 ? day : null;
      normalized.chargeMonth = null;
    }

    emit("submit", normalized);
  }

  formRef.value.resetForm();
}

function resetForm() {
  if (
    props.kind === "programmed" &&
    modelValue.value &&
    "frequency" in modelValue.value
  ) {
    selectedFrequency.value = modelValue.value.frequency;
  }

  dateError.value = "";
  formRef.value?.resetForm();
}

defineExpose({ internalRef: formRef, resetForm });
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="font-serif text-2xl font-bold text-text-1">
        {{ formMode === "insert" ? "New Expense" : "Edit Expense" }}
      </p>
    </AppCardBody>
    <Form
      v-slot="{ errors }"
      ref="formRef"
      class="px-7 pb-4"
      @submit="onSubmit"
    >
      <AppInput
        :model-value="modelValue.name"
        label="Name"
        name="name"
        :error="errors.name"
        :rules="required"
        type="text"
      ></AppInput>

      <AppInput
        :model-value="modelValue.amount"
        label="Amount"
        type="number"
        name="amount"
        input-class="pl-12"
        :min="0"
        step="10"
        :rules="positiveNumber"
        :error="errors.expense"
      >
        <template #prepend>
          <Icon name="material-symbols-light:euro" class="text-xl"></Icon>
        </template>
      </AppInput>

      <div v-if="kind === 'actual'" class="mt-1 mb-5">
        <p class="text-text-0">Date</p>
        <AppDatePicker v-model="actualDate" class="mt-1"></AppDatePicker>
        <ErrorText v-if="dateError">{{ dateError }}</ErrorText>
      </div>

      <template v-else>
        <AppAutocomplete
          :model-value="programmedModel.frequency"
          :error="errors.frequency"
          :items="frequentFrequencies"
          :rules="required"
          label="Frequency"
          name="frequency"
          @selected="onSelectFrequency"
        ></AppAutocomplete>

        <AppInput
          :model-value="programmedModel.chargeDay"
          label="Charge day (1-31)"
          type="number"
          name="chargeDay"
          :min="1"
          :max="31"
          step="1"
          :rules="chargeDay"
          :error="errors.chargeDay"
        ></AppInput>

        <AppAutocomplete
          v-if="showChargeMonth"
          :model-value="chargeMonthLabel"
          :error="errors.chargeMonth"
          :items="monthItems"
          :rules="required"
          label="Charge month"
          name="chargeMonth"
        ></AppAutocomplete>
      </template>

      <AppAutocomplete
        :model-value="modelValue.category"
        :error="errors.categories"
        :items="formattedCategories"
        :rules="required"
        label="Category"
        name="category"
      ></AppAutocomplete>

      <AppInput
        :model-value="modelValue.description"
        label="Description (optional)"
        as="textarea"
        type="text"
        name="description"
        :error="errors.description"
      ></AppInput>

      <div class="flex justify-end pt-2 pb-2">
        <BaseButton> Add Expense </BaseButton>
      </div>
    </Form>
  </AppCard>
</template>
