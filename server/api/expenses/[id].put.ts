import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const expense = await readBody(event);
  await db
    .update(expensesTable)
    .set(expense)
    .where(eq(expensesTable.id, expense.id));

  return { msg: "Success" };
});
