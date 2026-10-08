<script setup lang="ts">
import { expensesCategories } from "~/utils/categories";
import { makeDebounce } from "~/utils/debounce";

import type { Expense } from "~/types/expense";
import type { Filter } from "~/types/filter";

const props = defineProps<{
  expenses: Expense[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  add: [];
  edit: [expense: Expense];
  delete: [id: number | string];
  "filter-change": [filters: Filter];
}>();

const filters = reactive<Filter>({});

const isMenuOpen = ref(false);

const debounce = makeDebounce();

watch(
  () => filters.search,
  () => {
    debounce(() => emit("filter-change", { ...filters }));
  },
);

function applyFilters() {
  emit("filter-change", { ...filters });
  isMenuOpen.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppCard>
      <AppCardBody>
        <div class="flex">
          <AppInput
            v-model="filters.search"
            no-error
            class="min-w-100"
            placeholder="Search expenses"
          >
            <template #append>
              <Icon size="24" name="material-symbols-light:search"></Icon>
            </template>
          </AppInput>

          <AppMenu v-model="isMenuOpen" min-width="300px">
            <template #activator>
              <BaseButton icon class="ml-5 h-fit">
                <Icon
                  size="24"
                  name="material-symbols-light:filter-list"
                ></Icon>
              </BaseButton>
            </template>

            <AppCard>
              <AppCardBody>
                <AppDatePicker
                  v-model="filters.startDate"
                  label="Start Date"
                ></AppDatePicker>
                <AppDatePicker
                  v-model="filters.endDate"
                  label="End Date"
                ></AppDatePicker>

                <div class="flex">
                  <BaseButton class="ml-auto" @click="applyFilters">
                    Apply
                  </BaseButton>
                </div>
              </AppCardBody>
            </AppCard>
          </AppMenu>

          <BaseButton class="mb-5 ml-auto" @click="emit('add')">
            <span class="text-xl">+</span> Add Expense
          </BaseButton>
        </div>
        <div class="flex flex-col gap-3" data-testid="expenses-items">
          <ExpenseItem
            v-for="expense in props.expenses"
            :key="expense.id"
            :expense="expense"
            variant="outlined"
            :category="getCategoryByName(expense.category, expensesCategories)"
            @delete="(id) => emit('delete', id)"
            @edit="emit('edit', expense)"
          ></ExpenseItem>
        </div>

        <AppLoader v-if="props.isLoading" size="70" class="my-10"></AppLoader>

        <EmptyState v-else-if="!props.expenses?.length">
          <p>No expenses! Add one</p>
        </EmptyState>
      </AppCardBody>
    </AppCard>
  </div>
</template>
