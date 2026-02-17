<script setup lang="ts">
import { required, positiveNumber } from "@/utils/rules";
import { categories } from "@/utils/categories";

const emit = defineEmits(["submit"]);
const types = ref(["One time", "Monthly", "Annual"]);

const formRef = ref(null);

const formattedFrequencies = computed(() => {
  return types.value.map((item) => ({
    title: item,
    value: item,
  }));
});

const formattedCategories = computed(() => {
  return categories.map((item) => ({
    title: item.name,
    value: item.name,
    icon: {
      name: item.icon,
      color: item.color,
    },
  }));
});

function onSubmit(values) {
  emit("submit", values);
  formRef.value.resetForm();
}
</script>

<template>
  <AppCard>
    <div class="bg-teal-50 flex gap-4 mobile:rounded-t-md py-5 px-7">
      <div
        class="w-10 h-10 my-auto shadow-md bg-white flex justify-center items-center rounded-xl"
      >
        <Icon
          name="material-symbols-light:chart-data-outline-rounded"
          class="text-3xl text-primary-700 rotate-90"
        />
      </div>
      <div class="my-auto ml-2">
        <span class="font-bold block text-lg">Add new expense</span>
        <span class="text-xs">
          Fill in the form with the details of the expense
        </span>
      </div>
    </div>
    <Form
      v-slot="{ errors }"
      ref="formRef"
      class="mx-7 my-4 pt-3"
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

      <div class="flex justify-end pt-5 pb-2">
        <BaseButton> Add Expense </BaseButton>
      </div>
    </Form>
  </AppCard>
</template>
