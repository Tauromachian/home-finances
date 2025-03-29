<script setup>
import { initTooltips } from "flowbite";

onMounted(() => {
  initTooltips();
});

defineProps({
  expense: {
    type: Object,
    required: true,
  },
  category: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["removeExpense"]);

function remove() {
  emit("remove");
}
</script>

<template>
  <div class="flex items-center py-2">
    <Icon
      :name="category.icon"
      :style="{ color: category.color }"
      class="w-8 h-8 p-2 mr-3 rounded-full"
    />

    <div class="w-full flex">
      <div class="flex flex-col text-gray-800">
        <span class="font-bold">{{ expense.name }}</span>
        <p class="text-sm mt-2">{{ expense.description }}</p>
      </div>
      <div class="flex flex-col ml-auto items-end">
        <span class="text-sm">$ {{ expense.expense }}</span>
        <BaseButton variant="text" @click="remove">
          <Icon
            name="material-symbols:delete-outline"
            class="w-5 h-5 text-red-700 hover:text-red-800 transition-all duration-100 ease-in-out"
          />
        </BaseButton>
      </div>
    </div>
  </div>
</template>
