<script setup lang="ts">
import { Form } from "vee-validate";

import { required, positiveNumber } from "@/utils/rules";
import { expensesCategories } from "@/utils/categories";
import type { Expense } from "~/types/expense";

const emit = defineEmits<{ submit: [expense: Expense] }>();
const types = ref(["One time", "Monthly", "Annual"]);

const formRef = useTemplateRef<typeof Form>("formRef");

const formattedFrequencies = computed(() => {
  return types.value.map((item) => ({
    title: item,
    value: item,
  }));
});

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

function onSubmit(expense: Expense) {
  emit("submit", expense);
  formRef.value.resetForm();
}

defineExpose({ internalRef: formRef });
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="font-serif text-2xl font-bold text-text-1">New Expense</p>
    </AppCardBody>
    <Form
      v-slot="{ errors }"
      ref="formRef"
      class="px-7 pb-4"
      @submit="onSubmit"
    >
      <AppInput
        label="Name"
        name="name"
        :error="errors.name"
        :rules="required"
        type="text"
      ></AppInput>

      <AppInput
        label="Amount"
        type="number"
        name="amount"
        input-class="pl-12"
        :min="0"
        :rules="positiveNumber"
        :error="errors.expense"
      >
        <template #prepend>
          <Icon
            name="material-symbols-light:paid-outline"
            class="text-xl"
          ></Icon>
        </template>
      </AppInput>

      <AppAutocomplete
        :error="errors.frequency"
        :items="formattedFrequencies"
        :rules="required"
        label="Frequency"
        name="frequency"
      ></AppAutocomplete>

      <AppAutocomplete
        :error="errors.categories"
        :items="formattedCategories"
        :rules="required"
        label="Category"
        name="category"
      ></AppAutocomplete>

      <AppInput
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
