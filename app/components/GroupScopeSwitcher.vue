<script setup lang="ts">
import type { Item } from "~/types/item";

const { groups, activeGroupId, activeGroup, loadGroups } = useGroups();

const scopeItems = computed<Item[]>(() => [
  { title: "Personal", value: "" },
  ...groups.value.map((group) => ({
    title: group.name,
    value: String(group.id),
  })),
]);

const displayValue = computed(() => activeGroup.value?.name ?? "Personal");
watch(displayValue, (value) => {
  if (!window?.localStorage) return;

  localStorage.setItem("scope", value);
});

function selectScope(item: { value: string }) {
  console.log(item);
  activeGroupId.value = item.value === "" ? null : Number(item.value);
}

onBeforeMount(() => {
  if (!groups.value.length) loadGroups();
});

onMounted(() => {
  if (!window?.localStorage) return;

  const scope = localStorage.getItem("scope");

  if (!scope) return;

  selectScope({ value: scope === "Family" ? "1" : "" });
});
</script>

<template>
  <AppAutocomplete
    :model-value="displayValue"
    :items="scopeItems"
    name="scope"
    label="Scope"
    horizontal
    show-title
    @selected="selectScope"
  />
</template>
