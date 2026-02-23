<script setup lang="ts">
const appToaster = useTemplateRef("appToaster");

const theme = ref(false);

const themeName = computed(() => {
  return theme.value ? "Dark" : "Light";
});

watch(theme, (value) => {
  const html = document.querySelector("html");
  html.setAttribute("data-theme", value ? "dark" : "light");
});

provide("appToaster", appToaster);
</script>

<template>
  <main class="font-sans min-h-screen bg-neutral-0 text-text-0">
    <header class="flex items-center max-w-7xl mx-4 lg:mx-auto pt-5">
      <h1 class="font-serif text-4xl font-bold text-text-1">
        Home
        <span class="text-accent-0 italic"> Finances </span>
      </h1>

      <AppSwitch v-model="theme" class="ml-auto" :label="themeName"></AppSwitch>
    </header>

    <div class="max-w-7xl mx-4 lg:mx-auto pt-5">
      <NavBar class="mb-8"></NavBar>

      <NuxtPage />
    </div>

    <AppToaster ref="appToaster"></AppToaster>
  </main>
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
