import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";
import { resolveGroupId } from "@@/server/utils/groupAccess";
import { Expense } from "@@/server/dtos/expense";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const data = await readBody(event);
  data.userId = user.id;

  const res = Expense.omit({ id: true }).safeParse(data);

  if (!res.success) {
    throw createError({
      statusCode: 400,
      message: "Bad Request",
      data: res.error,
    });
  }

  const expense = res.data;
  expense.groupId = await resolveGroupId(user.id, expense);

  const [inserted] = await db.insert(expensesTable).values(expense).returning();

  setResponseStatus(event, 201);

  return { message: "Success", data: inserted };
});
