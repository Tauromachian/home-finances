import { db } from "../../orm";

import { investmentsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const investments = await db
    .select()
    .from(investmentsTable)
    .where(eq(investmentsTable.userId, user.id));
  return { data: investments };
});
