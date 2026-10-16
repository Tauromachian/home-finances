import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { treeifyError } from "zod";

import { expensesTable } from "@@/server/db/schema";
import {
  assertRecordAccess,
  resolveGroupId,
} from "@@/server/utils/groupAccess";
import { Expense } from "@@/server/dtos/expense";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const data = await readBody(event);

  const res = Expense.omit({ id: true, userId: true }).safeParse(data);
  if (!res.success) {
    throw createError({
      statusCode: 400,
      message: "Bad Request",
      data: treeifyError(res.error),
    });
  }

  const [existing] = await db
    .select({ userId: expensesTable.userId, groupId: expensesTable.groupId })
    .from(expensesTable)
    .where(eq(expensesTable.id, id))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Expense not found" });
  }

  await assertRecordAccess(user.id, existing);

  const expense = res.data;
  expense.groupId = await resolveGroupId(user.id, expense);

  await db
    .update(expensesTable)
    .set(expense)
    .where(eq(expensesTable.id, id))
    .returning();

  setResponseStatus(event, 204);
});
