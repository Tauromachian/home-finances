import type { Group, GroupMember } from "../types/group";
import { FetchNotOkError } from "../utils/errors";

export async function getGroups(): Promise<Group[]> {
  const res = await fetch("/api/groups");

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new FetchNotOkError(
      data?.message ?? "Could not load groups",
      res.status,
    );
  }

  const data = await res.json();
  return data.data as Group[];
}

export async function createGroup(name: string): Promise<Group> {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new FetchNotOkError(
      data?.message ?? "Could not create group",
      res.status,
    );
  }

  const data = await res.json();
  return data.data as Group;
}

export async function deleteGroup(id: number): Promise<void> {
  const res = await fetch(`/api/groups/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new FetchNotOkError(
      data?.message ?? "Could not delete group",
      res.status,
    );
  }
}

export async function getGroupMembers(groupId: number): Promise<GroupMember[]> {
  const res = await fetch(`/api/groups/${groupId}/members`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new FetchNotOkError(
      data?.message ?? "Could not load members",
      res.status,
    );
  }

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

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new FetchNotOkError(
      data?.message ?? "Could not add member",
      res.status,
    );
  }
}

export async function removeGroupMember(
  groupId: number,
  userId: string,
): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new FetchNotOkError(
      data?.message ?? "Could not remove member",
      res.status,
    );
  }
}
