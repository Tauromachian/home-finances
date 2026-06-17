<script setup lang="ts">
type Theme = "light" | "system" | "dark";

const theme = inject<Ref<Theme>>("theme", ref("system"));

const supabase = useSupabaseClient();

const themeName = computed(() => {
  return theme.value[0].toUpperCase() + theme.value.slice(1);
});

async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  await navigateTo("/login");
}
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

      <BaseButton class="ml-6" @click="signOut">Logout</BaseButton>
    </header>

    <div class="max-w-6xl mx-4 lg:mx-auto pt-5">
      <NavBar class="mb-8"></NavBar>

      <slot />
    </div>

    <AppToaster ref="appToaster"></AppToaster>
  </main>
</template>
