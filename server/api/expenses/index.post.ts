import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";
import { resolveGroupId } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const expense = await readBody(event);
  expense.userId = user.id;
  expense.groupId = await resolveGroupId(user.id, expense);

  await db.insert(expensesTable).values(expense);

  return { msg: "Success" };
});
