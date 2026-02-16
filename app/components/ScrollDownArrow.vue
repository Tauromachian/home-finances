<script setup>
const emit = defineEmits(["scrollToStats"]);

function handleClick() {
  emit("scrollToStats");
}
</script>

<template>
  <button
    class="p-3 shadow-lg bg-teal-50 text-teal-700 rounded-full focus:bg-teal-700 focus:text-white hover:bg-teal-700 hover:text-white transition ease-in-out duration-100 fixed bottom-2 right-auto"
    @click="handleClick"
  >
    <Icon name="material-symbols:arrow-cool-down" class="w-7 h-7"></Icon>
  </button>
</template>
