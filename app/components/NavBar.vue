<script setup lang="ts">
type Theme = "light" | "system" | "dark";

const links = [
  {
    name: "Dashboard",
    to: "/",
    icon: "material-symbols-light:home",
  },
  {
    name: "Expenses Tracker",
    to: "/expenses",
    icon: "material-symbols-light:account-balance-wallet",
  },
  {
    name: "Income",
    to: "/income",
    icon: "material-symbols-light:attach-money",
  },
  {
    name: "Investments",
    to: "/investments",
    icon: "material-symbols-light:trending-up",
  },
  {
    name: "Compound Calculator",
    to: "/compound-calculator",
    icon: "material-symbols-light:calculate",
  },
];

const theme = inject<Ref<Theme>>("theme", ref("system"));
const supabase = useSupabaseClient();

const isMenuOpen = ref(false);

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
  <div>
    <nav class="bg-neutral-1 rounded-xl p-1 hidden lg:block">
      <ul class="font-medium text-sm flex justify-evenly gap-5">
        <li v-for="link in links" :key="link.to" class="w-full text-center">
          <NuxtLink
            :to="link.to"
            class="block me-2 py-2 px-8 w-full rounded-lg"
            active-class="bg-neutral-2 text-text-1"
          >
            <span>
              {{ link.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div
      class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-1 rounded-t-2xl p-3"
    >
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="isMenuOpen">
          <ul class="flex flex-col mb-2">
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-2 text-text-0"
                active-class="bg-neutral-2 text-text-1"
                @click="isMenuOpen = false"
              >
                <Icon :name="link.icon" size="20" />
                <span class="text-sm font-medium">
                  {{ link.name }}
                </span>
              </NuxtLink>
            </li>
          </ul>

          <hr class="border-neutral-2 mb-2" />
        </div>
      </Transition>

      <div class="flex items-center justify-between gap-2">
        <BaseButton variant="outlined" @click="signOut">Logout</BaseButton>
        <div class="flex items-center gap-2">
          <AppSwitch
            v-model="theme"
            :label="themeName"
            :steps-values="{ start: 'light', middle: 'system', end: 'dark' }"
          />
          <BaseButton
            icon
            variant="text"
            aria-label="Toggle menu"
            class="flex items-center"
            @click="isMenuOpen = !isMenuOpen"
          >
            <Icon
              :name="
                isMenuOpen
                  ? 'material-symbols-light:close'
                  : 'material-symbols-light:menu'
              "
              size="24"
              class="text-text-1"
            />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
