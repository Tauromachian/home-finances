<script setup lang="ts">
const appToaster = useTemplateRef("appToaster");

provide("appToaster", appToaster);
</script>

<template>
  <main class="font-sans min-h-screen bg-neutral-0">
    <header class="max-w-7xl mx-4 lg:mx-auto pt-5">
      <h1 class="font-serif text-4xl font-bold">
        Home
        <span class="text-accent-0 italic"> Finances </span>
      </h1>
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
