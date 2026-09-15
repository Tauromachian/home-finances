<script setup lang="ts">
import { Form } from "vee-validate";

import { required, positiveNumber } from "@/utils/rules";

import type { Income } from "~/types/income";

type FormMode = "edit" | "insert";

defineProps<{ formMode: FormMode }>();

const modelValue = defineModel<Income>();

const emit = defineEmits<{
  submit: [income: Income];
}>();

const formRef = useTemplateRef<typeof Form>("formRef");

const dateError = ref("");

// The date travels outside vee-validate state,
// through the date picker bound below.
const actualDate = computed({
  get: () => modelValue.value?.incomeDate ?? "",
  set: (value: string) => {
    if (modelValue.value) modelValue.value.incomeDate = value;
  },
});

watch(actualDate, (date) => {
  if (date) dateError.value = "";
});

function onSubmit(values: Income) {
  if (!actualDate.value) {
    dateError.value = "Date is required";
    return;
  }

  dateError.value = "";
  emit("submit", { ...values, incomeDate: actualDate.value });

  formRef.value.resetForm();
}

function resetForm() {
  dateError.value = "";
  formRef.value?.resetForm();
}

defineExpose({ internalRef: formRef, resetForm });
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="font-serif text-2xl font-bold text-text-1">
        {{ formMode === "insert" ? "New Income" : "Edit Income" }}
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
        :error="errors.income"
      >
        <template #prepend>
          <Icon name="material-symbols-light:euro" class="text-xl"></Icon>
        </template>
      </AppInput>

      <div class="mt-1 mb-5">
        <p class="text-text-0">Date</p>
        <AppDatePicker v-model="actualDate" class="mt-1"></AppDatePicker>
        <ErrorText v-if="dateError">{{ dateError }}</ErrorText>
      </div>

      <AppInput
        :model-value="modelValue.description"
        label="Description (optional)"
        as="textarea"
        type="text"
        name="description"
        :error="errors.description"
      ></AppInput>

      <div class="flex justify-end pt-2 pb-2">
        <BaseButton> Add Income </BaseButton>
      </div>
    </Form>
  </AppCard>
</template>
