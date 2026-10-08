<script setup lang="ts">
import type { ProgrammedIncome } from "~/types/income";

const props = defineProps<{
  incomes: ProgrammedIncome[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  add: [];
  edit: [income: ProgrammedIncome];
  delete: [id: number | string];
}>();
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppCard>
      <AppCardBody>
        <div class="flex">
          <BaseButton class="mb-5 ml-auto" @click="emit('add')">
            <span class="text-xl">+</span> Program Income
          </BaseButton>
        </div>
        <div class="flex flex-col gap-3" data-testid="frequent-incomes-items">
          <IncomeProgrammedItem
            v-for="income in props.incomes"
            :key="income.id"
            :income="income"
            variant="outlined"
            @delete="(id) => emit('delete', id)"
            @edit="emit('edit', income)"
          ></IncomeProgrammedItem>
        </div>

        <AppLoader v-if="props.isLoading" size="70" class="my-10"></AppLoader>

        <EmptyState v-else-if="!props.incomes?.length">
          <p>No frequent incomes! Add one</p>
        </EmptyState>
      </AppCardBody>
    </AppCard>
  </div>
</template>
