<script setup lang="ts">
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-display";

const appToaster = useTemplateRef("appToaster");
const route = useRoute();

useTheme();

const isAuthRoute = computed(() => route.name === "login");
const layoutName = computed(() => (isAuthRoute.value ? "auth" : "default"));

provide("appToaster", appToaster);
</script>

<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage />
    <AppToaster ref="appToaster"></AppToaster>
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.15s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
