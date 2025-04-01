<script setup lang="ts">
import { initTooltips } from "flowbite";
import type { PropType } from "vue";

onMounted(() => {
  initTooltips();
});

defineProps({
  expense: {
    type: Object,
    required: true,
  },
  category: {
    type: Object as PropType<Category>,
    required: true,
  },
});
const emit = defineEmits(["remove"]);

function remove() {
  emit("remove");
}
</script>

<template>
  <div class="flex items-center py-2">
    <div
      class="min-w-8 w-8 h-8 mr-3 flex justify-center items-center rounded-full"
      :style="{ background: category.bgColor }"
    >
      <Icon :name="category.icon" :style="{ color: category.color }" />
    </div>

    <div class="w-full flex">
      <div class="flex flex-col text-gray-800">
        <span class="font-bold">{{ expense.name }}</span>
        <p class="text-sm mt-2">{{ expense.description }}</p>
      </div>
      <div class="flex flex-col ml-auto items-end">
        <span class="text-sm pr-3">$ {{ expense.expense }}</span>
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
