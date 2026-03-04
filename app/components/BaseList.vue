<script setup lang="ts">
defineProps<{ items: { name: string; id: string | number }[] }>();
defineEmits<{ click: [id: number | string] }>();
</script>

<template>
  <ul class="py-3 bg-neutral-2 rounded-2xl">
    <li
      v-for="(item, index) in items"
      :key="`${index}-${item.id}`"
      role="button"
      class="px-3 py-2 cursor-pointer hover:bg-neutral-1 text-text-0"
      @click="$emit('click', item.id)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
