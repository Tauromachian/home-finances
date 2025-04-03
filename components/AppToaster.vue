<script setup lang="ts">
const messages = ref([]);
const showToast = ref(false);

const props = defineProps({
  message: {
    type: String,
    default: "",
  },
});

watch(
  () => props.message,
  (newValue) => {
    if (!newValue) return;

    openToast();
  },
);

const openToast = (message) => {
  messages.value.push(message);
  showToast.value = true;
  closeToast();
};

const closeToast = () => {
  setTimeout(() => {
    messages.value.shift();
  }, 6000);
};

defineExpose({ openToast });
</script>

<template>
  <div class="flex items-center w-full max-w-xs p-4 mb-4 right-4 top-2 fixed">
    <AppToast
      v-for="(oneMessage, index) in messages"
      :key="index + oneMessage"
      :message="oneMessage"
      @close="messages.shift()"
    ></AppToast>
  </div>
</template>
