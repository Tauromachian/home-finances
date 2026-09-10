<script setup lang="ts">
import { Form } from "vee-validate";

import { required, positiveNumber } from "@/utils/rules";
import { expensesCategories } from "@/utils/categories";

import type { Expense } from "~/types/expense";

type FormMode = "edit" | "insert";

defineProps<{ formMode: FormMode }>();

const modelValue = defineModel<Expense>();

const emit = defineEmits<{
  submit: [expense: Expense];
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

// The date travels outside vee-validate state,
// through the date picker bound below.
const actualDate = computed({
  get: () => modelValue.value?.expenseDate ?? "",
  set: (value: string) => {
    if (modelValue.value) modelValue.value.expenseDate = value;
  },
});

watch(actualDate, (date) => {
  if (date) dateError.value = "";
});

function onSubmit(values: Expense) {
  if (!actualDate.value) {
    dateError.value = "Date is required";
    return;
  }

  dateError.value = "";
  emit("submit", { ...values, expenseDate: actualDate.value });

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

      <div class="mt-1 mb-5">
        <p class="text-text-0">Date</p>
        <AppDatePicker v-model="actualDate" class="mt-1"></AppDatePicker>
        <ErrorText v-if="dateError">{{ dateError }}</ErrorText>
      </div>

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
