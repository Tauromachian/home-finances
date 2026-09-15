import { eq } from "drizzle-orm";

import { db } from "../../orm";

import { incomesTable } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const incomes = await db
    .select()
    .from(incomesTable)
    .where(eq(incomesTable.userId, user.id));
  return { data: incomes };
});
