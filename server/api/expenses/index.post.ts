import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";
import { Expense } from "@@/server/dtos/expense";
import { resolveGroupId } from "@@/server/utils/groupAccess";
import { created, parseOr400 } from "@@/server/utils/http";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const data = await readBody(event);
  data.userId = user.id;

  const expense = parseOr400(Expense.omit({ id: true }), data);
  expense.groupId = await resolveGroupId(user.id, expense);

  const [inserted] = await db.insert(expensesTable).values(expense).returning();

  return created(event, inserted);
});
