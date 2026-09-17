<script setup lang="ts">
import type { Item } from "~/types/item";

const groupId = defineModel<number | null>({ default: null });

const { groups, loadGroups } = useGroups();

const shareItems = computed<Item[]>(() => [
  { title: "Personal (only me)", value: "" },
  ...groups.value.map((group) => ({
    title: group.name,
    value: String(group.id),
  })),
]);

const displayValue = computed(() => {
  if (groupId.value === null) return "Personal (only me)";
  return groups.value.find((group) => group.id === groupId.value)?.name ?? "";
});

function onSelectShare(item: Item) {
  groupId.value = item.value === "" ? null : Number(item.value);
}

onBeforeMount(() => {
  if (!groups.value.length) loadGroups();
});
</script>

<template>
  <AppAutocomplete
    :model-value="displayValue"
    :items="shareItems"
    name="groupId"
    label="Shared with"
    show-title
    @selected="onSelectShare"
  />
</template>
