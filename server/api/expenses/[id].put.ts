import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";
import {
  assertRecordAccess,
  resolveGroupId,
} from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const [existing] = await db
    .select({ userId: expensesTable.userId, groupId: expensesTable.groupId })
    .from(expensesTable)
    .where(eq(expensesTable.id, id))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Expense not found" });
  }

  await assertRecordAccess(user.id, existing);

  const expense = await readBody(event);
  expense.groupId = await resolveGroupId(user.id, expense);

  await db.update(expensesTable).set(expense).where(eq(expensesTable.id, id));

  return { msg: "Success" };
});
