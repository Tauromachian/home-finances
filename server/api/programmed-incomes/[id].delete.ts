import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { programmedIncomesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) throw createError({ status: 400, statusText: "ID needed" });

  await db
    .delete(programmedIncomesTable)
    .where(eq(programmedIncomesTable.id, Number(id)));

  return { msg: "Success" };
});
