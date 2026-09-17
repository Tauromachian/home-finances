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

function onSelectScope(item: Item) {
  activeGroupId.value = item.value === "" ? null : Number(item.value);
}

onBeforeMount(() => {
  if (!groups.value.length) loadGroups();
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
    @selected="onSelectScope"
  />
</template>
