import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { usersGroupsTable, usersTable } from "@@/server/db/schema";
import { assertGroupMember } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const groupId = Number(event.context.params?.id);
  const user = event.context.user;

  await assertGroupMember(user.id, groupId);

  const members = await db
    .select({ userId: usersGroupsTable.userId, email: usersTable.email })
    .from(usersGroupsTable)
    .innerJoin(usersTable, eq(usersTable.id, usersGroupsTable.userId))
    .where(eq(usersGroupsTable.groupId, groupId));

  return { data: members };
});
