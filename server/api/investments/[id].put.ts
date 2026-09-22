import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";
import { normalizeMarketSymbol } from "@@/server/utils/marketSymbol";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const investment = await readBody(event);
  investment.userId = user.id;
  investment.marketSymbol = normalizeMarketSymbol(investment.marketSymbol);

  await db
    .update(investmentsTable)
    .set(investment)
    .where(eq(investmentsTable.id, investment.id));

  return { msg: "Success" };
});
