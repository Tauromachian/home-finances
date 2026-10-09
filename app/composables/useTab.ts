export function useTab(defaultTab: string, tabs: readonly string[]) {
  const route = useRoute();
  const router = useRouter();

  const activeTab = computed({
    get: () => {
      const found = tabs.find((tab: string) => tab === route.query.tab);

      if (found) return found;

      return defaultTab;
    },
    set: (tab: string) => {
      const query = { ...route.query };

      if (tab === defaultTab) {
        delete query.tab;
      } else {
        query.tab = tab;
      }

      router.replace({ query });
    },
  });

  return { activeTab };
}
