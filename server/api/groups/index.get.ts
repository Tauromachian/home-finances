import { eq } from "drizzle-orm";

import { db } from "../../orm";

import { groupsTable, usersGroupsTable } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const groups = await db
    .select({ id: groupsTable.id, name: groupsTable.name })
    .from(groupsTable)
    .innerJoin(usersGroupsTable, eq(usersGroupsTable.groupId, groupsTable.id))
    .where(eq(usersGroupsTable.userId, user.id));

  return { data: groups };
});
