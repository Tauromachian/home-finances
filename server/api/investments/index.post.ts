import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";
import { Investment } from "@@/server/dtos/investment";
import { normalizeMarketSymbol } from "@@/server/utils/marketSymbol";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const data = await readBody(event);
  data.userId = user.id;

  const res = Investment.omit({ id: true }).safeParse(data);

  if (!res.success) {
    throw createError({
      statusCode: 400,
      message: "Bad Request",
      data: res.error,
    });
  }

  const investment = res.data;
  investment.marketSymbol = normalizeMarketSymbol(investment.marketSymbol);

  const [inserted] = await db
    .insert(investmentsTable)
    .values(investment)
    .returning();

  setResponseStatus(event, 201);

  return { message: "Success", data: inserted };
});
