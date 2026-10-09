export function useTab<T extends string>(defaultTab: T, tabs: readonly T[]) {
  const route = useRoute();
  const router = useRouter();

  const activeTab = computed<T>({
    get: () => {
      const found = tabs.find((tab: string) => tab === route.query.tab);

      if (found) return found;

      return defaultTab;
    },
    set: (tab: T) => {
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
