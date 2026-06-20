import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const expense = await readBody(event);
  expense.userId = user.id;

  await db.insert(expensesTable).values(expense);

  return { msg: "Success" };
});
