<script setup>
const emit = defineEmits(["close"]);
defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <AppCard class="cursor-pointer" @click="emit('close')">
    <AppCardBody class="flex">
      <div class="absolute left-6 top-6 text-green-500 h-fit">
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>
      <p class="ms-3 font-normal">
        {{ message }}
      </p>
    </AppCardBody>
  </AppCard>
</template>
