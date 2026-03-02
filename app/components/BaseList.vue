<script setup lang="ts">
defineProps<{ items: { name: string; id: string | number }[] }>();
</script>

<template>
  <ul class="py-3">
    <li
      v-for="(item, index) in items"
      :key="`${index}-${item.id}`"
      class="px-3 py-2 cursor-pointer hover:bg-neutral-1"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
