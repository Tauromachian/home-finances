import { loadGroups as fetchGroups } from "../services/groups";

import type { Group } from "../types/group";

// Pure scope check, unit-tested: personal scope (null) only matches
// personal records; a group scope only matches that group's records.
export function isInScope(
  recordGroupId: number | null | undefined,
  activeGroupId: number | null,
): boolean {
  if (activeGroupId === null)
    return recordGroupId === null || recordGroupId === undefined;
  return recordGroupId === activeGroupId;
}

export const useGroups = () => {
  // Shared across pages so the selected scope survives navigation.
  const groups = useState<Group[]>("groups", () => []);
  const activeGroupId = useState<number | null>("active-group-id", () => null);

  const activeGroup = computed(
    () =>
      groups.value.find((group) => group.id === activeGroupId.value) ?? null,
  );

  async function loadGroups() {
    groups.value = await fetchGroups();

    // The selected group may have been deleted elsewhere.
    if (
      activeGroupId.value !== null &&
      !groups.value.some((group) => group.id === activeGroupId.value)
    ) {
      activeGroupId.value = null;
    }
  }

  function inScope<T extends { groupId?: number | null }>(records: T[]): T[] {
    return (records ?? []).filter((record) =>
      isInScope(record.groupId, activeGroupId.value),
    );
  }

  return { groups, activeGroupId, activeGroup, loadGroups, inScope };
};
