import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { programmedExpensesTable } from "@@/server/db/schema";
import { assertRecordAccess } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) throw createError({ status: 400, statusText: "ID needed" });

  const user = event.context.user;

  const [existing] = await db
    .select({
      userId: programmedExpensesTable.userId,
      groupId: programmedExpensesTable.groupId,
    })
    .from(programmedExpensesTable)
    .where(eq(programmedExpensesTable.id, Number(id)))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Expense not found" });
  }

  await assertRecordAccess(user.id, existing);

  await db
    .delete(programmedExpensesTable)
    .where(eq(programmedExpensesTable.id, Number(id)));

  return { msg: "Success" };
});
