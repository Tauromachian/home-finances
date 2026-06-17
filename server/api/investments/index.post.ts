import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const investment = await readBody(event);
  await db.insert(investmentsTable).values(investment);

  return { msg: "Success" };
});
