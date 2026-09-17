import { and, eq, inArray, isNull, or } from "drizzle-orm";

import { db } from "../../orm";

import { programmedIncomesTable } from "../../db/schema";
import { listMyGroupIds } from "../../utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const groupIds = await listMyGroupIds(user.id);

  const programmedIncomes = await db
    .select()
    .from(programmedIncomesTable)
    .where(
      or(
        and(
          eq(programmedIncomesTable.userId, user.id),
          isNull(programmedIncomesTable.groupId),
        ),
        inArray(programmedIncomesTable.groupId, groupIds),
      ),
    );
  return { data: programmedIncomes };
});
