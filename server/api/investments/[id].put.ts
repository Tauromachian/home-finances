import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const investment = await readBody(event);
  investment.userId = user.id;

  await db
    .update(investmentsTable)
    .set(investment)
    .where(eq(investmentsTable.id, investment.id));

  return { msg: "Success" };
});
