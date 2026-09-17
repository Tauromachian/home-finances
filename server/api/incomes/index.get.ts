import { and, eq, inArray, isNull, or } from "drizzle-orm";

import { db } from "../../orm";

import { incomesTable } from "../../db/schema";
import { listMyGroupIds } from "../../utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const groupIds = await listMyGroupIds(user.id);

  const incomes = await db
    .select()
    .from(incomesTable)
    .where(
      or(
        and(eq(incomesTable.userId, user.id), isNull(incomesTable.groupId)),
        inArray(incomesTable.groupId, groupIds),
      ),
    );
  return { data: incomes };
});
