<script setup lang="ts">
import { getMonthTitle } from "~/utils/months";
import type { ProgrammedIncome } from "~/types/income";
import { Frequency } from "~/types/frequency";

const { income } = defineProps<{
  income: ProgrammedIncome;
}>();
const emit = defineEmits<{
  delete: [id: number | string];
  edit: [id: number | string];
}>();

const buttonRef = useTemplateRef("buttonRef");

const isActionsMenuOpen = ref(false);

const chargeSchedule = computed(() => {
  if (income.chargeDay == null) return "";

  if (income.frequency === Frequency.YEARLY && income.chargeMonth != null) {
    const month = getMonthTitle(income.chargeMonth);

    if (month) return `Charged yearly on ${month} ${income.chargeDay}`;

    return `Charged yearly on day ${income.chargeDay}`;
  }

  if (income.frequency === Frequency.MONTHLY) {
    return `Charged monthly on day ${income.chargeDay}`;
  }

  return `Charged on day ${income.chargeDay}`;
});

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
          <p v-if="chargeSchedule" class="text-sm mt-2 text-text-0">
            {{ chargeSchedule }}
          </p>
        </div>

        <p
          class="ml-auto rounded-full bg-green-800 text-white px-2 text-sm uppercase mr-3"
        >
          {{ income.frequency }}
        </p>

        <p class="font-serif text-text-1 mr-4 text-lg">€{{ income.amount }}</p>

        <BaseButton
          ref="buttonRef"
          variant="outlined"
          class="flex items-center"
          icon
          @click="isActionsMenuOpen = true"
        >
          <Icon
            name="material-symbols-light:more-vert"
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
