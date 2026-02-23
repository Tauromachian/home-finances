<script setup lang="ts">
const model = defineModel<boolean>();

const dialogEl = useTemplateRef("dialog");

watch(model, async (val) => {
  if (val) {
    dialogEl.value.showModal();
  } else {
    dialogEl.value.close();
  }
});

const escapeEvent = (event: KeyboardEvent) => {
  if (!model.value) return;

  if (event.key === "Escape") closeModal();
};

function closeModal() {
  model.value = false;
}

onMounted(() => {
  document.addEventListener("keydown", escapeEvent);
});

onUnmounted(() => {
  document.removeEventListener("keydown", escapeEvent);
});
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="backdrop:opacity-40 backdrop:bg-black w-sm rounded-2xl left-1/2 top-1/2 -translate-1/2"
      @click="closeModal"
    >
      <div @click.stop>
        <button
          class="absolute z-10 top-2 cursor-pointer right-4 text-gray-600 hover:text-red-500 text-lg font-bold"
          type="button"
          @click="closeModal"
        >
          ✕
        </button>

        <slot></slot>
      </div>
    </dialog>
  </Teleport>
</template>
