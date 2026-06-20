import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const investment = await readBody(event);
  investment.userId = user.id;

  await db.insert(investmentsTable).values(investment);

  return { msg: "Success" };
});
