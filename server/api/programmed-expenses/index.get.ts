import { and, eq, inArray, isNull, or } from "drizzle-orm";

import { db } from "../../orm";

import { programmedExpensesTable } from "../../db/schema";
import { listMyGroupIds } from "../../utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const groupIds = await listMyGroupIds(user.id);

  const programmedExpenses = await db
    .select()
    .from(programmedExpensesTable)
    .where(
      or(
        and(
          eq(programmedExpensesTable.userId, user.id),
          isNull(programmedExpensesTable.groupId),
        ),
        inArray(programmedExpensesTable.groupId, groupIds),
      ),
    );
  return { data: programmedExpenses };
});
