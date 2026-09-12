<script setup lang="ts">
import { Form } from "vee-validate";

import { required, positiveNumber, chargeDay } from "@/utils/rules";
import { expensesCategories } from "@/utils/categories";
import { frequencies } from "@/utils/frequencies";
import { monthItems, getMonthTitle, parseMonthValue } from "@/utils/months";

import type { Item } from "@/types/item";
import type { Frequency } from "~/types/frequency";
import { Frequency as FrequencyValues } from "~/types/frequency";
import type { ProgrammedExpense } from "~/types/expense";

type FormMode = "edit" | "insert";

defineProps<{ formMode: FormMode }>();

const modelValue = defineModel<ProgrammedExpense>();

const emit = defineEmits<{
  submit: [expense: ProgrammedExpense];
}>();

const formRef = useTemplateRef<typeof Form>("formRef");

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

// The frequency autocomplete only flows one-way into vee-validate state,
// so track the selection locally to drive the conditional charge fields.
const selectedFrequency = ref<Frequency>(
  modelValue.value?.frequency ?? FrequencyValues.MONTHLY,
);

watch(
  () => modelValue.value?.frequency,
  (frequency) => {
    if (frequency) selectedFrequency.value = frequency;
  },
);

const showChargeMonth = computed(
  () => selectedFrequency.value === FrequencyValues.YEARLY,
);

const chargeMonthLabel = computed(() =>
  getMonthTitle(modelValue.value?.chargeMonth),
);

function onSelectFrequency(item: Item) {
  selectedFrequency.value = item.value as Frequency;

  // A month only applies to yearly expenses. Drop any previously picked
  // month as soon as another frequency is chosen so the hidden field can
  // never carry a stale value into the submitted payload.
  if (selectedFrequency.value !== FrequencyValues.YEARLY) {
    formRef.value?.setFieldValue("chargeMonth", null);

    if (modelValue.value) modelValue.value.chargeMonth = null;
  }
}

function onSubmit(values: ProgrammedExpense) {
  const normalized = { ...values };

  const day = Number(normalized.chargeDay);
  normalized.chargeDay =
    Number.isInteger(day) && day >= 1 && day <= 31 ? day : null;
  normalized.chargeMonth =
    normalized.frequency === FrequencyValues.YEARLY
      ? parseMonthValue(normalized.chargeMonth)
      : null;

  emit("submit", normalized);

  formRef.value.resetForm();
}

function resetForm() {
  if (modelValue.value?.frequency) {
    selectedFrequency.value = modelValue.value.frequency;
  }

  formRef.value?.resetForm();
}

defineExpose({ internalRef: formRef, resetForm });
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="font-serif text-2xl font-bold text-text-1">
        {{
          formMode === "insert"
            ? "New Programmed Expense"
            : "Edit Programmed Expense"
        }}
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

      <AppAutocomplete
        :model-value="modelValue.frequency"
        :error="errors.frequency"
        :items="frequencies"
        :rules="required"
        label="Frequency"
        name="frequency"
        @selected="onSelectFrequency"
      ></AppAutocomplete>

      <AppInput
        :model-value="modelValue.chargeDay"
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
