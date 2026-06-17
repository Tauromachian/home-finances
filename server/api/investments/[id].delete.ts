import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  await db
    .delete(investmentsTable)
    .where(eq(investmentsTable.id, query.id as number));

  return { msg: "Success" };
});
