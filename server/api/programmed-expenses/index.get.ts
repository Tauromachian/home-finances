import { eq } from "drizzle-orm";

import { db } from "../../orm";

import { programmedExpensesTable } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const programmedExpenses = await db
    .select()
    .from(programmedExpensesTable)
    .where(eq(programmedExpensesTable.userId, user.id));
  return { data: programmedExpenses };
});
