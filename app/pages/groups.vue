<script setup lang="ts">
import {
  addGroupMember as apiAddMember,
  createGroup as apiCreateGroup,
  deleteGroup as apiDeleteGroup,
  loadGroupMembers as apiLoadMembers,
  loadGroups as apiLoadGroups,
  removeGroupMember as apiRemoveMember,
} from "~/services/groups";

import type { Group, GroupMember } from "~/types/group";

const user = useSupabaseUser();
const appToaster = inject<Ref>("appToaster");

const groups = ref<Group[]>([]);
const newGroupName = ref("");
const selectedGroupId = ref<number | null>(null);
const members = ref<GroupMember[]>([]);
const newMemberEmail = ref("");
const isConfirmDeleteOpen = ref(false);

const selectedGroup = computed(
  () =>
    groups.value.find((group) => group.id === selectedGroupId.value) ?? null,
);

function showMessage(message: string) {
  if (!appToaster?.value) return;
  appToaster.value.openToast(message);
}

async function loadGroups() {
  groups.value = await apiLoadGroups();

  if (
    selectedGroupId.value !== null &&
    !groups.value.some((group) => group.id === selectedGroupId.value)
  ) {
    selectedGroupId.value = null;
    members.value = [];
  }
}

async function selectGroup(id: number) {
  selectedGroupId.value = id;
  newMemberEmail.value = "";
  members.value = await apiLoadMembers(id);
}

async function createGroup() {
  const name = newGroupName.value.trim();
  if (!name) return;

  const group = await apiCreateGroup(name);
  newGroupName.value = "";
  await loadGroups();
  await selectGroup(group.id);
  showMessage("Group created!");
}

async function addMember() {
  if (selectedGroupId.value === null) return;

  const email = newMemberEmail.value.trim();
  if (!email) return;

  try {
    await apiAddMember(selectedGroupId.value, email);
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Could not add member",
    );
    return;
  }

  newMemberEmail.value = "";
  members.value = await apiLoadMembers(selectedGroupId.value);
  showMessage("Member added!");
}

async function removeMember(memberId: string) {
  if (selectedGroupId.value === null) return;

  await apiRemoveMember(selectedGroupId.value, memberId);
  members.value = await apiLoadMembers(selectedGroupId.value);
  showMessage("Member removed");
}

async function deleteGroup() {
  if (selectedGroupId.value === null) return;

  try {
    await apiDeleteGroup(selectedGroupId.value);
  } catch {
    showMessage("Could not delete group");
    isConfirmDeleteOpen.value = false;
    return;
  }

  isConfirmDeleteOpen.value = false;
  selectedGroupId.value = null;
  members.value = [];
  await loadGroups();
  showMessage("Group deleted");
}

onBeforeMount(() => {
  loadGroups();
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppCard>
      <AppCardBody>
        <p class="text-md font-bold">My Groups</p>
        <p class="text-sm text-text-0 mt-1">
          Share expenses and incomes with the members of a group.
        </p>

        <div class="flex gap-2 mt-4">
          <input
            v-model="newGroupName"
            type="text"
            placeholder="New group name"
            class="text-field"
            @keydown.enter="createGroup"
          />
          <BaseButton @click="createGroup">Create</BaseButton>
        </div>

        <div v-if="groups.length" class="flex flex-col gap-3 mt-5">
          <button
            v-for="group in groups"
            :key="group.id"
            class="text-left px-4 py-3 rounded-xl border cursor-pointer"
            :class="
              group.id === selectedGroupId
                ? 'border-accent-0 text-text-1'
                : 'border-neutral-1 text-text-0'
            "
            @click="selectGroup(group.id)"
          >
            {{ group.name }}
          </button>
        </div>

        <p v-else class="text-sm text-text-0 mt-4">
          No groups yet. Create one above.
        </p>
      </AppCardBody>
    </AppCard>

    <AppCard v-if="selectedGroup">
      <AppCardBody>
        <p class="text-md font-bold">{{ selectedGroup.name }} members</p>

        <div class="flex gap-2 mt-4">
          <input
            v-model="newMemberEmail"
            type="email"
            placeholder="Member email"
            class="text-field"
            @keydown.enter="addMember"
          />
          <BaseButton @click="addMember">Add</BaseButton>
        </div>

        <div v-if="members.length" class="flex flex-col gap-2 mt-4">
          <div
            v-for="member in members"
            :key="member.userId"
            class="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-1"
          >
            <span class="text-sm text-text-1">
              {{ member.email ?? member.userId }}
            </span>
            <span v-if="member.userId === user?.id" class="text-xs text-text-0">
              (you)
            </span>
            <button
              class="ml-auto text-sm text-red-600 cursor-pointer"
              @click="removeMember(member.userId)"
            >
              Remove
            </button>
          </div>
        </div>

        <p v-else class="text-sm text-text-0 mt-4">No members yet.</p>

        <BaseButton
          variant="outlined"
          class="mt-5"
          @click="isConfirmDeleteOpen = true"
        >
          Delete group
        </BaseButton>
      </AppCardBody>
    </AppCard>

    <DialogConfirmDelete
      v-model="isConfirmDeleteOpen"
      @click:delete="deleteGroup"
    ></DialogConfirmDelete>
  </div>
</template>
