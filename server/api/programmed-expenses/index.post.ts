import { db } from "@@/server/orm";

import { programmedExpensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const programmedExpense = await readBody(event);
  programmedExpense.userId = user.id;

  await db.insert(programmedExpensesTable).values(programmedExpense);

  return { msg: "Success" };
});
