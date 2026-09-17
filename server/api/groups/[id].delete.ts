import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import {
  expensesTable,
  groupsTable,
  incomesTable,
  programmedExpensesTable,
  programmedIncomesTable,
  usersGroupsTable,
} from "@@/server/db/schema";
import { assertGroupMember } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const groupId = Number(event.context.params?.id);
  const user = event.context.user;

  await assertGroupMember(user.id, groupId);

  const referencing = await Promise.all([
    db
      .select({ id: expensesTable.id })
      .from(expensesTable)
      .where(eq(expensesTable.groupId, groupId))
      .limit(1),
    db
      .select({ id: incomesTable.id })
      .from(incomesTable)
      .where(eq(incomesTable.groupId, groupId))
      .limit(1),
    db
      .select({ id: programmedExpensesTable.id })
      .from(programmedExpensesTable)
      .where(eq(programmedExpensesTable.groupId, groupId))
      .limit(1),
    db
      .select({ id: programmedIncomesTable.id })
      .from(programmedIncomesTable)
      .where(eq(programmedIncomesTable.groupId, groupId))
      .limit(1),
  ]);

  if (referencing.some((rows) => rows.length > 0)) {
    throw createError({
      statusCode: 400,
      message: "Group still has shared records",
    });
  }

  await db
    .delete(usersGroupsTable)
    .where(eq(usersGroupsTable.groupId, groupId));
  await db.delete(groupsTable).where(eq(groupsTable.id, groupId));

  return { msg: "Success" };
});
