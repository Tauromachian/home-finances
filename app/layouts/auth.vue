<script setup lang="ts">
import type { ThemeName } from "~/types/theme";

const theme = inject<Ref<ThemeName>>("theme", ref("system"));

const themeName = computed(() => {
  return theme.value[0].toUpperCase() + theme.value.slice(1);
});
</script>

<template>
  <div class="flex flex-col h-screen bg-neutral-0 text-text-0">
    <AppSwitch
      v-model="theme"
      class="mt-auto mx-auto mb-7"
      :label="themeName"
      :steps-values="{ start: 'light', middle: 'system', end: 'dark' }"
    ></AppSwitch>

    <slot></slot>
  </div>
</template>

<style scoped lang="scss"></style>
