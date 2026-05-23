import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const expense = await readBody(event);
  await db.insert(expensesTable).values(expense);

  return { msg: "Success" };
});
