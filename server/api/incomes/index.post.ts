import { db } from "@@/server/orm";

import { incomesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const income = await readBody(event);
  income.userId = user.id;

  await db.insert(incomesTable).values(income);

  return { msg: "Success" };
});
