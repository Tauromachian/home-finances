<script setup lang="ts">
const { size = "18" } = defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <div class="flex items-center justify-center">
    <Icon
      name="material-symbols-light:progress-activity"
      class="animate-spin size-24"
      :size
    />
  </div>
</template>
