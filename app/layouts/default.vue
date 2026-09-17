<script setup lang="ts">
import type { ThemeName } from "~/types/theme";

const theme = inject<Ref<ThemeName>>("theme", ref("system"));

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const avatarButtonRef = useTemplateRef("avatar-button");

const isUserMenuOpen = ref(false);

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
    <NavBar />

    <div class="lg:pl-64">
      <header class="flex items-center max-w-6xl mx-4 lg:mx-8 xl:mx-auto pt-5">
        <h1 class="font-serif text-4xl font-bold text-text-1 lg:hidden">
          Home
          <span class="text-accent-0 italic"> Finances </span>
        </h1>

        <GroupScopeSwitcher />

        <button
          ref="avatar-button"
          class="rounded-full cursor-pointer h-14 w-14 border border-accent-0 flex justify-center items-center ml-auto"
          @click="isUserMenuOpen = true"
        >
          <Icon name="material-symbols-light:person" :size="26"></Icon>
        </button>
      </header>

      <div class="max-w-6xl mx-4 lg:mx-8 xl:mx-auto pt-5 pb-64 lg:pb-8">
        <slot />
      </div>
    </div>

    <AppMenu
      v-model="isUserMenuOpen"
      :target="avatarButtonRef"
      location="bottom right"
    >
      <AppCardBody>
        <p v-if="user?.email" class="text-sm text-text-1">
          {{ user.email }}
        </p>

        <hr class="border-neutral-1 my-2" />

        <AppSwitch
          v-model="theme"
          class="ml-auto hidden lg:flex"
          :label="themeName"
          :steps-values="{ start: 'light', middle: 'system', end: 'dark' }"
        ></AppSwitch>

        <BaseButton class="hidden lg:inline-flex mt-4" @click="signOut">
          Logout
        </BaseButton>
      </AppCardBody>
    </AppMenu>

    <AppToaster ref="appToaster"></AppToaster>
  </main>
</template>
