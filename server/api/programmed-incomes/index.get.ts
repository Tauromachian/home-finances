import { eq } from "drizzle-orm";

import { db } from "../../orm";

import { programmedIncomesTable } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const programmedIncomes = await db
    .select()
    .from(programmedIncomesTable)
    .where(eq(programmedIncomesTable.userId, user.id));
  return { data: programmedIncomes };
});
