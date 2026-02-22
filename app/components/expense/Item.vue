<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Expense } from "~/types/expense";

defineProps<{ expense: Expense; category: Category }>();
defineEmits(["remove"]);

const isConfirmationDialogOpen = ref(false);
</script>

<template>
  <AppCard class="rounded-xl">
    <AppCardBody class="flex items-center py-2">
      <div
        class="min-w-12 w-12 h-12 mr-3 flex justify-center items-center rounded-md"
        :style="{ background: category.bgColor }"
      >
        <Icon :name="category.icon" :style="{ color: category.color }" />
      </div>

      <div class="w-full flex items-center">
        <div class="flex flex-col text-text-1 justify-center">
          <span class="font-bold">{{ expense.name }}</span>
          <p
            v-if="expense.description && expense.description !== ''"
            class="text-sm mt-2"
          >
            {{ expense.description }}
          </p>
        </div>

        <p
          class="ml-auto rounded-full bg-green-800 text-white px-2 text-sm uppercase mr-2"
        >
          {{ expense.frequency }}
        </p>

        <p class="font-serif text-text-1 mr-2">$ {{ expense.amount }}</p>

        <BaseButton
          variant="text"
          class="flex items-center"
          @click="isConfirmationDialogOpen = true"
        >
          <Icon
            name="material-symbols:delete-outline"
            class="w-5 h-5 text-red-700 hover:text-red-800 transition-all duration-100 ease-in-out"
          />
        </BaseButton>
      </div>
    </AppCardBody>

    <DialogConfirmDelete
      v-model="isConfirmationDialogOpen"
      @click:delete="$emit('remove')"
    ></DialogConfirmDelete>
  </AppCard>
</template>
