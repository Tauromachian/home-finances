import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { incomesTable } from "@@/server/db/schema";
import { assertRecordAccess } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) throw createError({ status: 400, statusText: "ID needed" });

  const user = event.context.user;

  const [existing] = await db
    .select({ userId: incomesTable.userId, groupId: incomesTable.groupId })
    .from(incomesTable)
    .where(eq(incomesTable.id, Number(id)))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Income not found" });
  }

  await assertRecordAccess(user.id, existing);

  await db.delete(incomesTable).where(eq(incomesTable.id, Number(id)));

  return { msg: "Success" };
});
