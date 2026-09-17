import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { incomesTable } from "@@/server/db/schema";
import {
  assertRecordAccess,
  resolveGroupId,
} from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const [existing] = await db
    .select({ userId: incomesTable.userId, groupId: incomesTable.groupId })
    .from(incomesTable)
    .where(eq(incomesTable.id, id))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Income not found" });
  }

  await assertRecordAccess(user.id, existing);

  const income = await readBody(event);
  income.groupId = await resolveGroupId(user.id, income);

  await db.update(incomesTable).set(income).where(eq(incomesTable.id, id));

  return { msg: "Success" };
});
