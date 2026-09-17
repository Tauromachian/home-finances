import { and, eq, inArray, isNull, or } from "drizzle-orm";

import { db } from "../../orm";

import { expensesTable } from "../../db/schema";
import { listMyGroupIds } from "../../utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const groupIds = await listMyGroupIds(user.id);

  const expenses = await db
    .select()
    .from(expensesTable)
    .where(
      or(
        and(eq(expensesTable.userId, user.id), isNull(expensesTable.groupId)),
        inArray(expensesTable.groupId, groupIds),
      ),
    );
  return { data: expenses };
});
