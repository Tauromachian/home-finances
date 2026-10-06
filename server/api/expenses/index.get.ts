import { and, eq, inArray, isNull, like, or } from "drizzle-orm";

import { db } from "../../orm";

import { expensesTable } from "../../db/schema";
import { listMyGroupIds } from "../../utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const groupIds = await listMyGroupIds(user.id);

  const query = getQuery(event);

  let andBuilder;

  if (query.search) {
    andBuilder = and(
      eq(expensesTable.userId, user.id),
      isNull(expensesTable.groupId),
      like(expensesTable.name, `%${query.search}%`),
    );
  } else {
    andBuilder = and(
      eq(expensesTable.userId, user.id),
      isNull(expensesTable.groupId),
    );
  }

  const expenses = await db
    .select()
    .from(expensesTable)
    .where(or(andBuilder, inArray(expensesTable.groupId, groupIds)));
  return { data: expenses };
});
