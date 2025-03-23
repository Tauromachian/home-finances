<script setup>
import { initModals } from "flowbite";

import { required, positiveNumber } from "@/utils/rules";
import { categories } from "@/utils/categories";

onMounted(() => {
  initModals();
});

const emit = defineEmits(["submit"]);
const types = ref(["One time", "Monthly", "Annual"]);

const inputCategory = ref("");
const savedCategory = ref("");
const inputType = ref("");
const savedType = ref("");
const visibleCategories = ref(false);
const visibleTypes = ref(false);
const fadingInOutTypes = ref(false);
const fadingInOutCategories = ref(false);
const formRef = ref(null);

const filteredCategories = computed(() => {
  return categories.filter((item) => {
    return item.name.toLowerCase().includes(inputCategory.value.toLowerCase());
  });
});

const filteredTypes = computed(() => {
  return types.value.filter((item) => {
    return item.toLowerCase().includes(inputType.value.toLowerCase());
  });
});

function onSubmit(values) {
  emit("submit", values);
  formRef.value.resetForm();
}

function handleBlurCategory() {
  setTimeout(() => {
    fadingInOutCategories.value = false;
    inputCategory.value = savedCategory.value;
    visibleCategories.value = false;
  }, 300);
}

function handleBlurType() {
  setTimeout(() => {
    fadingInOutTypes.value = false;
    inputType.value = savedType.value;
    visibleTypes.value = false;
  }, 300);
}

function handleFocusType() {
  visibleTypes.value = true;
  setTimeout(() => {
    fadingInOutTypes.value = true;
  }, 10);
}

function handleFocusCategory() {
  visibleCategories.value = true;
  setTimeout(() => {
    fadingInOutCategories.value = true;
  }, 10);
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
      class="mx-7 my-4 pt-3"
      @submit="onSubmit"
      ref="formRef"
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
        type="text"
        name="expense"
        input-class="pl-12"
        :rules="positiveNumber"
        :error="errors.expense"
      >
        <template #prepend>
          <div
            class="bg-teal-50 text-teal-700 absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none rounded-s-lg border peer-focus:border-teal-800"
          >
            <Icon
              name="material-symbols-light:paid-outline"
              class="text-xl"
            ></Icon>
          </div>
        </template>
      </AppInput>

      <div>
        <label>Type</label>
        <div class="block mt-1 mb-5 text-gray-800 relative">
          <Field
            v-model="inputType"
            type="text"
            name="types"
            class="relative text-field peer"
            :rules="required"
            @focus="handleFocusType"
            @blur="handleBlurType"
          />

          <ErrorText>{{ errors.types }}</ErrorText>
          <div
            v-if="visibleTypes"
            class="bg-white w-full mt-1 p-2 rounded-lg border border-gray-300 absolute z-10 transition-opacity"
            :class="{
              'opacity-100': fadingInOutTypes,
              'opacity-0': !fadingInOutTypes,
            }"
          >
            <div v-if="!filteredTypes.length" class="text-center">
              No types match your search
            </div>
            <div
              v-for="type in filteredTypes"
              v-else
              :key="type"
              class="pl-2 flex h-7 items-center cursor-pointer hover:bg-gray-200 rounded-full transition"
              @click="savedType = type"
            >
              <span>{{ type }}</span>
            </div>
          </div>
        </div>

        <label>Category</label>
        <div class="block mt-1 mb-3 text-gray-800 relative">
          <Field
            v-model="inputCategory"
            type="text"
            name="categories"
            class="relative text-field peer"
            :rules="required"
            @focus="handleFocusCategory"
            @blur="handleBlurCategory"
          />
          <ErrorText>{{ errors.categories }}</ErrorText>

          <div
            v-if="visibleCategories"
            class="bg-white w-full mt-1 p-2 rounded-lg border border-gray-300 absolute z-10 transition-opacity max-h-32 overflow-scroll scrollbar-none"
            :class="{
              'opacity-100': fadingInOutCategories,
              'opacity-0': !fadingInOutCategories,
            }"
          >
            <div v-if="!filteredCategories.length" class="text-center">
              No categories match your search
            </div>
            <div
              v-for="category in filteredCategories"
              v-else
              :key="category.id"
              class="flex h-7 items-center cursor-pointer hover:bg-gray-200 rounded-full transition"
              @click="savedCategory = category.name"
            >
              <Icon
                :name="category.icon"
                class="w-5 h-5 pl-2 mr-4"
                :style="{ color: category.color }"
              />
              <span>{{ category.name }}</span>
            </div>
          </div>
        </div>

        <AppInput
          label="Description"
          as="textarea"
          type="text"
          name="description"
          :error="errors.description"
        ></AppInput>

        <div class="flex justify-end pt-5 pb-2">
          <BaseButton> Add Expense </BaseButton>
        </div>
      </div>
    </Form>
  </AppCard>
</template>
