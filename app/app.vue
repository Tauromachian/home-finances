<script setup lang="ts">
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-display";

type Theme = "light" | "system" | "dark";

const appToaster = useTemplateRef("appToaster");
const route = useRoute();

const theme = ref<Theme>("system");
const textColor = ref();

function getSystemTheme(): "dark" | "light" {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return isDark ? "dark" : "light";
}

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
provide("theme", theme);

onMounted(() => {
  let enterTheme = localStorage.getItem("theme");
  enterTheme ??= "system";

  theme.value = enterTheme as Theme;
});

const isAuthRoute = computed(() => {
  if (route.name === "login") return true;

  return false;
});
const layoutName = computed(() => (isAuthRoute.value ? "auth" : "default"));
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
