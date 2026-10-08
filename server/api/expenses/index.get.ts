import { and, eq, inArray, isNull, like, or, gte, lte } from "drizzle-orm";

import { db } from "../../orm";

import { expensesTable } from "../../db/schema";
import { listMyGroupIds } from "../../utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const groupIds = await listMyGroupIds(user.id);

  const query = getQuery(event);

  const isUserIdEqual = eq(expensesTable.userId, user.id);
  const isGroupIdNull = isNull(expensesTable.groupId);

  const andBuilder = and(
    isUserIdEqual,
    isGroupIdNull,
    query.search ? like(expensesTable.name, `%${query.search}%`) : undefined,
    query.startDate
      ? gte(expensesTable.expenseDate, query.startDate as string)
      : undefined,
    query.endDate
      ? lte(expensesTable.expenseDate, query.endDate as string)
      : undefined,
  );

  const expenses = await db
    .select()
    .from(expensesTable)
    .where(or(andBuilder, inArray(expensesTable.groupId, groupIds)));
  return { data: expenses };
});
