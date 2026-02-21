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
    <AppCardBody>
      <p class="font-serif text-text-1 text-2xl font-bold">Compound interest</p>
    </AppCardBody>
    <form class="mx-7 mb-2 pt-3">
      <AppInput
        v-model.number="form.percent"
        label="Percent(%)"
        name="percent"
        min="1"
        :rules="positiveNumber"
        type="number"
      ></AppInput>

      <AppInput
        v-model.number="form.years"
        label="Years"
        min="1"
        name="yearsAmount"
        type="number"
      ></AppInput>

      <AppInput
        v-model.number="form.initialAmount"
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
        v-model.number="form.monthlyContribution"
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
