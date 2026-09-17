import type { Group, GroupMember } from "../types/group";

async function handleResponse(res: Response, fallback: string) {
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message ?? fallback);

  return data;
}

export async function loadGroups(): Promise<Group[]> {
  const res = await fetch("/api/groups");
  const data = await res.json();
  return data.data as Group[];
}

export async function createGroup(name: string): Promise<Group> {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await handleResponse(res, "Could not create group");
  return data.data as Group;
}

export async function deleteGroup(id: number): Promise<void> {
  const res = await fetch(`/api/groups/${id}`, { method: "DELETE" });
  await handleResponse(res, "Could not delete group");
}

export async function loadGroupMembers(
  groupId: number,
): Promise<GroupMember[]> {
  const res = await fetch(`/api/groups/${groupId}/members`);
  const data = await res.json();
  return data.data as GroupMember[];
}

export async function addGroupMember(
  groupId: number,
  email: string,
): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  await handleResponse(res, "Could not add member");
}

export async function removeGroupMember(
  groupId: number,
  userId: string,
): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });
  await handleResponse(res, "Could not remove member");
}
