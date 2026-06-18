import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) throw createError({ status: 400, statusText: "ID needed" });

  await db.delete(investmentsTable).where(eq(investmentsTable.id, Number(id)));

  return { msg: "Success" };
});
