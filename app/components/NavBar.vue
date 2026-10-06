<script setup lang="ts">
import type { ThemeName } from "~/types/theme";

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
    name: "Groups",
    to: "/groups",
    icon: "material-symbols-light:group",
  },
  //  {
  //    name: "Investments",
  //    to: "/investments",
  //    icon: "material-symbols-light:trending-up",
  //  },
  {
    name: "Compound Calculator",
    to: "/compound-calculator",
    icon: "material-symbols-light:calculate",
  },
];

const theme = inject<Ref<ThemeName>>("theme", ref("system"));
const supabase = useSupabaseClient();

const isCollapsed = ref(false);

const isMenuOpen = ref(false);
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

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
    <aside
      class="hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-neutral-1 transition-all duration-300 overflow-visible"
      :class="isCollapsed ? 'w-0 p-0 border-0' : 'w-64 p-4 gap-4'"
    >
      <div
        class="flex flex-col gap-4 overflow-hidden whitespace-nowrap transition-opacity duration-200"
        :class="isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'"
      >
        <NuxtLink
          to="/"
          class="px-2 pt-2 font-serif text-2xl font-bold text-text-1"
        >
          Home
          <span class="text-accent-0 italic"> Finances </span>
        </NuxtLink>

        <ul class="font-medium text-sm flex flex-col gap-1">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="flex items-center gap-3 px-4 py-2 rounded-lg text-text-0 hover:bg-neutral-2"
              active-class="bg-neutral-2 text-text-1"
            >
              <Icon :name="link.icon" size="20" />
              <span>
                {{ link.name }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <button
        type="button"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="!isCollapsed"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        class="absolute top-8 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-neutral-2 bg-neutral-1 text-text-1 shadow-md transition-all duration-300 hover:bg-neutral-2"
        :class="isCollapsed ? 'left-2' : '-right-5'"
        @click="toggleSidebar"
      >
        <Icon
          :name="
            isCollapsed
              ? 'material-symbols-light:chevron-right'
              : 'material-symbols-light:chevron-left'
          "
          size="24"
        />
      </button>
    </aside>

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
