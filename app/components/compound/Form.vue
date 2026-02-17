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
        label="Percent(%)"
        name="percent"
        v-model="form.percent"
        :rules="positiveNumber"
        type="number"
      ></AppInput>

      <AppInput
        label="Years Amount"
        v-model="form.years"
        name="yearsAmount"
        type="number"
      ></AppInput>

      <AppInput
        label="Initial Amount"
        type="number"
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
        label="Monthly Contribution"
        type="number"
        input-class="pl-12"
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
