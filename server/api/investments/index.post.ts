import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";
import { Investment } from "@@/server/dtos/investment";
import { created, parseOr400 } from "@@/server/utils/http";
import { normalizeMarketSymbol } from "@@/server/utils/marketSymbol";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const data = await readBody(event);
  data.userId = user.id;

  const investment = parseOr400(Investment.omit({ id: true }), data);
  investment.marketSymbol = normalizeMarketSymbol(investment.marketSymbol);

  const [inserted] = await db
    .insert(investmentsTable)
    .values(investment)
    .returning();

  return created(event, inserted);
});
