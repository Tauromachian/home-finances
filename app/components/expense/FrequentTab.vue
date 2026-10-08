<script setup lang="ts">
import { expensesCategories } from "~/utils/categories";

import type { ProgrammedExpense } from "~/types/expense";

const props = defineProps<{
  expenses: ProgrammedExpense[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  add: [];
  edit: [expense: ProgrammedExpense];
  delete: [id: number | string];
}>();
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppCard>
      <AppCardBody>
        <div class="flex">
          <BaseButton class="mb-5 ml-auto" @click="emit('add')">
            <span class="text-xl">+</span> Program Expense
          </BaseButton>
        </div>
        <div class="flex flex-col gap-3" data-testid="frequent-expenses-items">
          <ExpenseProgrammedItem
            v-for="expense in props.expenses"
            :key="expense.id"
            :expense="expense"
            variant="outlined"
            :category="getCategoryByName(expense.category, expensesCategories)"
            @delete="(id) => emit('delete', id)"
            @edit="emit('edit', expense)"
          ></ExpenseProgrammedItem>
        </div>

        <AppLoader v-if="props.isLoading" size="70" class="my-10"></AppLoader>

        <EmptyState v-else-if="!props.expenses?.length">
          <p>No frequent expenses! Add one</p>
        </EmptyState>
      </AppCardBody>
    </AppCard>
  </div>
</template>
