<script lang="ts" setup>
const model = defineModel<boolean>();

const classes = computed(() => {
  const inactiveClasses = ["bg-text-0"];
  const activeClasses = ["translate-x-6", "bg-accent-0"];

  return model.value ? activeClasses : inactiveClasses;
});
</script>

<template>
  <button
    type="button"
    class="rounded-full bg-neutral-1 w-12 h-6 cursor-pointer"
    @click="model = !model"
  >
    <div
      class="rounded-full h-4 w-4 transition duration-200 ease-in-out cursor-pointer ml-1"
      :class="classes"
    >
      <input v-model="model" type="checkbox" class="opacity-0" />
    </div>
  </button>
</template>
