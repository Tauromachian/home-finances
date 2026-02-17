<template>
  <main class="font-nunito min-h-screen bg-neutral">
    <div class="max-w-7xl mx-4 lg:mx-auto pt-5">
      <NavBar class="mb-8"></NavBar>

      <NuxtPage />
    </div>
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
