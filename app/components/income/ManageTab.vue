<script setup lang="ts">
import type { Income } from "~/types/income";

const props = defineProps<{
  incomes: Income[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  add: [];
  edit: [income: Income];
  delete: [id: number | string];
}>();
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppCard>
      <AppCardBody>
        <div class="flex">
          <BaseButton class="mb-5 ml-auto" @click="emit('add')">
            <span class="text-xl">+</span> Add Income
          </BaseButton>
        </div>
        <div class="flex flex-col gap-3" data-testid="incomes-items">
          <IncomeItem
            v-for="income in props.incomes"
            :key="income.id"
            :income="income"
            variant="outlined"
            @delete="(id) => emit('delete', id)"
            @edit="emit('edit', income)"
          ></IncomeItem>
        </div>

        <AppLoader v-if="props.isLoading" size="70" class="my-10"></AppLoader>

        <EmptyState v-else-if="!props.incomes?.length">
          <p>No incomes! Add one</p>
        </EmptyState>
      </AppCardBody>
    </AppCard>
  </div>
</template>
