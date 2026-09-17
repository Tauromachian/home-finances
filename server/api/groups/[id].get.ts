import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { groupsTable } from "@@/server/db/schema";
import { assertGroupMember } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const groupId = Number(event.context.params?.id);
  const user = event.context.user;

  await assertGroupMember(user.id, groupId);

  const [group] = await db
    .select({ id: groupsTable.id, name: groupsTable.name })
    .from(groupsTable)
    .where(eq(groupsTable.id, groupId))
    .limit(1);

  if (!group)
    throw createError({ statusCode: 404, message: "Group not found" });

  return { data: group };
});
