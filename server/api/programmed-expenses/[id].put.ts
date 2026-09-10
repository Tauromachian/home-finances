import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { programmedExpensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const programmedExpense = await readBody(event);
  programmedExpense.userId = user.id;

  await db
    .update(programmedExpensesTable)
    .set(programmedExpense)
    .where(eq(programmedExpensesTable.id, id));

  return { msg: "Success" };
});
