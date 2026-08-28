import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const expense = await readBody(event);
  expense.userId = user.id;

  await db.update(expensesTable).set(expense).where(eq(expensesTable.id, id));

  return { msg: "Success" };
});
