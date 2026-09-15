import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { incomesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const income = await readBody(event);
  income.userId = user.id;

  await db.update(incomesTable).set(income).where(eq(incomesTable.id, id));

  return { msg: "Success" };
});
