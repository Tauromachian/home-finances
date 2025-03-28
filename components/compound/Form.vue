<script setup lang="ts">
import { positiveNumber } from "@/utils/rules";

type CompoundForm = {
  percent: number;
  initialAmount: number;
  monthlyContribution: number;
};

const formRef = ref(null);

const emit = defineEmits(["submit"]);

function onSubmit(values: CompoundForm) {
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
          class="text-3xl text-primary-700"
        />
      </div>
      <div class="my-auto ml-2">
        <span class="font-bold block text-lg">
          Calculate compounding interest
        </span>
        <span class="text-xs">
          Fill in the form with the details of the compounding
        </span>
      </div>
    </div>
    <Form
      v-slot="{ errors }"
      class="mx-7 my-4 pt-3"
      @submit="onSubmit"
      ref="formRef"
    >
      <div>
        <AppInput
          label="Percent"
          name="percent"
          :error="errors.name"
          :rules="positiveNumber"
          type="text"
        ></AppInput>

        <AppInput
          label="Initial Amount"
          type="text"
          input-class="pl-12"
          name="initialAmount"
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

        <AppInput
          label="Monthly Contribution"
          type="text"
          input-class="pl-12"
          name="monthlyContribution"
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

        <div class="flex justify-end pt-5 pb-2">
          <BaseButton type="submit"> Compound it baby! </BaseButton>
        </div>
      </div>
    </Form>
  </AppCard>
</template>
