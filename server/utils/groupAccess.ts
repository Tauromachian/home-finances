import { and, eq } from "drizzle-orm";

import { usersGroupsTable } from "../db/schema";
import { db } from "../orm";

export async function listMyGroupIds(userId: string): Promise<number[]> {
  const rows = await db
    .select({ groupId: usersGroupsTable.groupId })
    .from(usersGroupsTable)
    .where(eq(usersGroupsTable.userId, userId));

  return rows.map((row) => row.groupId);
}

export async function isGroupMember(
  userId: string,
  groupId: number,
): Promise<boolean> {
  const rows = await db
    .select({ id: usersGroupsTable.id })
    .from(usersGroupsTable)
    .where(
      and(
        eq(usersGroupsTable.userId, userId),
        eq(usersGroupsTable.groupId, groupId),
      ),
    )
    .limit(1);

  return rows.length > 0;
}

export async function assertGroupMember(
  userId: string,
  groupId: number,
): Promise<void> {
  if (!(await isGroupMember(userId, groupId))) {
    throw createError({
      statusCode: 403,
      message: "Not a member of this group",
    });
  }
}

// A personal record (groupId NULL) is only writable by its owner; a shared
// record is writable by any member of its group (all members are equal).
export async function assertRecordAccess(
  userId: string,
  record: { userId: string; groupId: number | null },
): Promise<void> {
  if (record.groupId === null || record.groupId === undefined) {
    if (record.userId !== userId) {
      throw createError({ statusCode: 403, message: "Not your record" });
    }
    return;
  }

  await assertGroupMember(userId, record.groupId);
}

// Normalizes the optional groupId from a record body: missing/empty means
// a personal record (NULL); a number must belong to one of the user's
// groups, otherwise the request fails.
export async function resolveGroupId(
  userId: string,
  body: { groupId?: unknown },
): Promise<number | null> {
  const { groupId } = body;

  if (groupId === undefined || groupId === null || groupId === "") return null;

  const parsed = Number(groupId);

  if (!Number.isInteger(parsed)) {
    throw createError({
      statusCode: 400,
      message: "groupId must be an integer",
    });
  }

  await assertGroupMember(userId, parsed);

  return parsed;
}
