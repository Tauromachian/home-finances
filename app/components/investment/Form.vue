<script setup lang="ts">
import { Form } from "vee-validate";

import { required, positiveNumber } from "@/utils/rules";
import { assetsCategories } from "@/utils/categories";
import type { Investment } from "~/types/investment";

const emit = defineEmits<{ submit: [investment: Investment] }>();
const formattedCategories = assetsCategories.map((item) => ({
  title: item.name,
  value: item.name,
  icon: {
    name: item.icon,
    color: item.color,
  },
}));

const formRef = useTemplateRef<typeof Form>("formRef");

function onSubmit(investment: Investment) {
  emit("submit", investment);
  formRef.value.resetForm();
}
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="font-serif text-2xl font-bold text-text-1">New Investment</p>
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
        name="amountInvested"
        input-class="pl-12"
        :rules="positiveNumber"
        :error="errors.amountInvested"
      >
        <template #prepend>
          <Icon
            name="material-symbols-light:paid-outline"
            class="text-xl"
          ></Icon>
        </template>
      </AppInput>

      <AppInput
        label="Current Value"
        type="number"
        name="currentValue"
        input-class="pl-12"
        :rules="positiveNumber"
        :error="errors.currentValue"
      >
        <template #prepend>
          <Icon
            name="material-symbols-light:paid-outline"
            class="text-xl"
          ></Icon>
        </template>
      </AppInput>

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
        <BaseButton> Add Investment </BaseButton>
      </div>
    </Form>
  </AppCard>
</template>
