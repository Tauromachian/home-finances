<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isOpen = ref(false);

const escapeEvent = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  if (event.key === "Escape") {
    closeModal();
  }
};

watchEffect(() => (isOpen.value = props.modelValue));
function closeModal() {
  isOpen.value = false;
  emit("update:modelValue", false);
}

onMounted(() => {
  document.addEventListener("keydown", escapeEvent);
});

onUnmounted(() => {
  document.removeEventListener("keydown", escapeEvent);
});
</script>

<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="fixed inset-0 bg-black opacity-40" @click="closeModal"></div>
      <div
        class="flex bg-white rounded-lg shadow-lg relative min-w-[300px] max-w-[500px]"
      >
        <button
          class="absolute z-10 top-2 cursor-pointer right-4 text-gray-600 hover:text-red-500 text-lg font-bold"
          type="button"
          @click="closeModal"
        >
          ✕
        </button>
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>
