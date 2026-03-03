<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Expense } from "~/types/expense";

const { expense } = defineProps<{ expense: Expense; category: Category }>();
const emit = defineEmits<{
  delete: [id: number | string];
  edit: [id: number | string];
}>();

const buttonRef = useTemplateRef("buttonRef");

const isActionsMenuOpen = ref(false);

function executeAction(action: "delete" | "edit") {
  if (action === "delete") {
    emit("delete", expense.id);
  } else {
    emit("edit", expense.id);
  }
}
</script>

<template>
  <AppCard class="rounded-xl">
    <AppCardBody class="flex items-center py-2">
      <div
        class="min-w-12 w-12 h-12 mr-3 flex justify-center items-center rounded-md"
        :style="{ background: category.color + '12' }"
      >
        <Icon
          :size="22"
          :name="category.icon"
          :style="{ color: category.color }"
        />
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
          class="ml-auto rounded-full bg-green-800 text-white px-2 text-sm uppercase mr-3"
        >
          {{ expense.frequency }}
        </p>

        <p class="font-serif text-text-1 mr-4 text-lg">€{{ expense.amount }}</p>

        <BaseButton
          ref="buttonRef"
          variant="outlined"
          class="flex items-center"
          icon
          @click="isActionsMenuOpen = true"
        >
          <Icon
            name="material-symbols:more-vert"
            size="20"
            class="w-10 h-10 text-accent-0 hover:text-accent-1 transition-all duration-100 ease-in-out"
          />
        </BaseButton>
      </div>
    </AppCardBody>

    <AppMenu
      v-model="isActionsMenuOpen"
      location="bottom right"
      :target="buttonRef"
    >
      <BaseList
        :items="[
          { name: 'Edit', id: 'edit' },
          { name: 'Delete', id: 'delete' },
        ]"
        @click="executeAction"
      ></BaseList>
    </AppMenu>
  </AppCard>
</template>
