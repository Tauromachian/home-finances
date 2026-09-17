import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { programmedIncomesTable } from "@@/server/db/schema";
import { assertRecordAccess } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) throw createError({ status: 400, statusText: "ID needed" });

  const user = event.context.user;

  const [existing] = await db
    .select({
      userId: programmedIncomesTable.userId,
      groupId: programmedIncomesTable.groupId,
    })
    .from(programmedIncomesTable)
    .where(eq(programmedIncomesTable.id, Number(id)))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Income not found" });
  }

  await assertRecordAccess(user.id, existing);

  await db
    .delete(programmedIncomesTable)
    .where(eq(programmedIncomesTable.id, Number(id)));

  return { msg: "Success" };
});
