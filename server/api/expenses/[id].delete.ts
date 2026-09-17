import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";
import { assertRecordAccess } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) throw createError({ status: 400, statusText: "ID needed" });

  const user = event.context.user;

  const [existing] = await db
    .select({ userId: expensesTable.userId, groupId: expensesTable.groupId })
    .from(expensesTable)
    .where(eq(expensesTable.id, Number(id)))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Expense not found" });
  }

  await assertRecordAccess(user.id, existing);

  await db.delete(expensesTable).where(eq(expensesTable.id, Number(id)));

  return { msg: "Success" };
});
