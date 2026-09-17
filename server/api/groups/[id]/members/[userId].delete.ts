import { and, eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { usersGroupsTable } from "@@/server/db/schema";
import { assertGroupMember } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const groupId = Number(event.context.params?.id);
  const memberId = event.context.params?.userId;
  const user = event.context.user;

  if (!memberId) throw createError({ status: 400, statusText: "ID needed" });

  await assertGroupMember(user.id, groupId);

  await db
    .delete(usersGroupsTable)
    .where(
      and(
        eq(usersGroupsTable.groupId, groupId),
        eq(usersGroupsTable.userId, memberId),
      ),
    );

  return { msg: "Success" };
});
