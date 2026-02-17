<script setup lang="ts">
import type { CompoundForm } from "~/types/compound";

import { positiveNumber } from "@/utils/rules";

const form = defineModel({
  type: Object as PropType<CompoundForm>,
  required: true,
});
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
        <span class="font-bold block text-lg"> Compound interest </span>
        <span class="text-xs"> Fill the form to compound </span>
      </div>
    </div>
    <form class="mx-7 my-4 pt-3">
      <AppInput
        v-model="form.percent"
        label="Percent(%)"
        name="percent"
        min="1"
        :rules="positiveNumber"
        type="number"
      ></AppInput>

      <AppInput
        v-model="form.years"
        label="Years Amount"
        min="1"
        name="yearsAmount"
        type="number"
      ></AppInput>

      <AppInput
        v-model="form.initialAmount"
        label="Initial Amount"
        type="number"
        min="1"
        input-class="pl-12"
        name="initialAmount"
        :rules="positiveNumber"
      >
        <template #prepend>
          <Icon
            name="material-symbols-light:paid-outline"
            class="text-xl"
          ></Icon>
        </template>
      </AppInput>

      <AppInput
        v-model="form.monthlyContribution"
        label="Monthly Contribution"
        type="number"
        input-class="pl-12"
        min="1"
        name="monthlyContribution"
        :rules="positiveNumber"
      >
        <template #prepend>
          <Icon
            name="material-symbols-light:paid-outline"
            class="text-xl"
          ></Icon>
        </template>
      </AppInput>
    </form>
  </AppCard>
</template>
