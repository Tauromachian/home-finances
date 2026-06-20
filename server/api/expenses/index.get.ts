import { eq } from "drizzle-orm";

import { db } from "../../orm";

import { expensesTable } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const expenses = await db
    .select()
    .from(expensesTable)
    .where(eq(expensesTable.userId, user.id));
  return { data: expenses };
});
