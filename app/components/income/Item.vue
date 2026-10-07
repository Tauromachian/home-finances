<script setup lang="ts">
import type { Income } from "~/types/income";

const { income } = defineProps<{ income: Income }>();
const emit = defineEmits<{
  delete: [id: number | string];
  edit: [id: number | string];
}>();

function executeAction(action: "delete" | "edit") {
  if (action === "delete") {
    emit("delete", income.id);
  } else {
    emit("edit", income.id);
  }
}
</script>

<template>
  <AppCard class="rounded-xl">
    <AppCardBody class="flex items-center py-2">
      <div class="w-full flex items-center">
        <div class="flex flex-col text-text-1 justify-center">
          <span class="font-bold">{{ income.name }}</span>
          <p
            v-if="income.description && income.description !== ''"
            class="text-sm mt-2"
          >
            {{ income.description }}
          </p>
        </div>

        <p class="ml-auto text-sm text-text-0 mr-3">
          {{ income.incomeDate }}
        </p>

        <p class="font-serif text-text-1 mr-4 text-lg">€{{ income.amount }}</p>

        <AppMenu>
          <template #activator>
            <BaseButton variant="outlined" class="flex items-center" icon>
              <Icon
                name="material-symbols-light:more-vert"
                size="20"
                class="w-10 h-10 text-accent-0 hover:text-accent-1 transition-all duration-100 ease-in-out"
              />
            </BaseButton>
          </template>

          <BaseList
            :items="[
              { name: 'Edit', id: 'edit' },
              { name: 'Delete', id: 'delete' },
            ]"
            @click="executeAction"
          ></BaseList>
        </AppMenu>
      </div>
    </AppCardBody>
  </AppCard>
</template>
