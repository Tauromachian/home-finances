<script setup lang="ts">
import { Form } from "vee-validate";

import { required } from "@/utils/rules";
import { frequencies } from "@/utils/frequencies";

import type { Income } from "~/types/income";

defineModel<Partial<Income>>();

const emit = defineEmits<{ submit: [income: Income] }>();

const formRef = useTemplateRef<typeof Form>("formRef");

function onSubmit(income: Income) {
  emit("submit", income);
  formRef.value.resetForm();
}

defineExpose({ internalRef: formRef });
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="font-serif text-2xl font-bold text-text-1">New Income</p>
    </AppCardBody>
    <Form
      v-slot="{ errors }"
      ref="formRef"
      class="px-7 pb-4"
      @submit="onSubmit"
    >
      <AppInput
        :model-value="modelValue?.name ?? ''"
        name="name"
        label="Name"
        :error="errors.name"
      ></AppInput>

      <AppInput
        :model-value="modelValue.amount"
        type="number"
        label="Amount"
        min="0"
        name="amount"
        :error="errors.income"
      ></AppInput>

      <AppAutocomplete
        :model-value="modelValue.frequency"
        :items="frequencies"
        :rules="required"
        label="Frequency"
        name="frequency"
        :error="errors.frequency"
      ></AppAutocomplete>

      <AppInput
        :model-value="modelValue.description"
        type="number"
        as="textarea"
        name="description"
        label="Description"
        min="0"
        :error="errors.description"
      ></AppInput>

      <div class="flex justify-end pt-2 pb-2">
        <BaseButton> Add Income</BaseButton>
      </div>
    </Form>
  </AppCard>
</template>
