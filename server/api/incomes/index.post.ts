import { db } from "@@/server/orm";

import { incomesTable } from "@@/server/db/schema";
import { resolveGroupId } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const income = await readBody(event);
  income.userId = user.id;
  income.groupId = await resolveGroupId(user.id, income);

  await db.insert(incomesTable).values(income);

  return { msg: "Success" };
});
