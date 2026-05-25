import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  await db
    .delete(expensesTable)
    .where(eq(expensesTable.id, query.id as number));

  return { msg: "Success" };
});
