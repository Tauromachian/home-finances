<script setup lang="ts">
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-display";

type Theme = "light" | "system" | "dark";

const appToaster = useTemplateRef("appToaster");
const route = useRoute();

const theme = ref<Theme>("system");
const textColor = ref();

let darkMode: MediaQueryList;

function getSystemTheme(): "dark" | "light" {
  const isDark = darkMode.matches;

  return isDark ? "dark" : "light";
}

function changeTheme(theme: "dark" | "light") {
  const html = document.querySelector("html");
  html.setAttribute("data-theme", theme);

  textColor.value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text-1");

  localStorage.setItem("theme", theme);
}

watch(theme, (enterTheme: Theme) => {
  let appliableTheme: "light" | "dark";

  if (enterTheme === "system") appliableTheme = getSystemTheme();
  else appliableTheme = enterTheme;

  changeTheme(appliableTheme);
});

const isAuthRoute = computed(() => route.name === "login");
const layoutName = computed(() => (isAuthRoute.value ? "auth" : "default"));

provide("donutChartTextColor", textColor);
provide("appToaster", appToaster);
provide("theme", theme);

onMounted(() => {
  darkMode = window.matchMedia("(prefers-color-scheme: dark)");

  darkMode.addEventListener("change", () => {
    if (theme.value !== "system") return;

    const systemTheme = getSystemTheme();
    changeTheme(systemTheme);
  });

  let enterTheme = localStorage.getItem("theme");
  enterTheme ??= "system";

  theme.value = enterTheme as Theme;
});
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
