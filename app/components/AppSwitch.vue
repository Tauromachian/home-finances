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
    class="relative rounded-full bg-neutral-1 w-12 h-6 cursor-pointer"
    @click="model = !model"
  >
    <span
      class="absolute left-1 rounded-full h-4 w-4 top-1 transition duration-200 ease-in-out"
      :class="classes"
    ></span>
  </button>
</template>
