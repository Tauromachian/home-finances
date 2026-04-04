<script setup lang="ts">
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-display";

const appToaster = useTemplateRef("appToaster");

type Theme = "light" | "system" | "dark";

const theme = ref<Theme>("system");
const textColor = ref();

function getSystemTheme(): "dark" | "light" {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return isDark ? "dark" : "light";
}

const themeName = computed(() => {
  return theme.value[0].toUpperCase() + theme.value.slice(1);
});

provide("donutChartTextColor", textColor);

watch(theme, (value) => {
  let enterTheme = value;
  if (value === "system") enterTheme = getSystemTheme();

  const html = document.querySelector("html");
  html.setAttribute("data-theme", enterTheme);

  textColor.value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text-1");

  localStorage.setItem("theme", theme.value);
});

provide("appToaster", appToaster);

onMounted(() => {
  let enterTheme = localStorage.getItem("theme");
  enterTheme ??= "system";

  theme.value = enterTheme as Theme;
});
</script>

<template>
  <main class="font-sans min-h-screen bg-neutral-0 text-text-0">
    <header class="flex items-center max-w-6xl mx-4 lg:mx-auto pt-5">
      <h1 class="font-serif text-4xl font-bold text-text-1">
        Home
        <span class="text-accent-0 italic"> Finances </span>
      </h1>

      <AppSwitch
        v-model="theme"
        class="ml-auto"
        :label="themeName"
        :steps-values="{ start: 'light', middle: 'system', end: 'dark' }"
      ></AppSwitch>
    </header>

    <div class="max-w-6xl mx-4 lg:mx-auto pt-5">
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
