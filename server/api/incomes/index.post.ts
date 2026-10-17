import { db } from "@@/server/orm";

import { incomesTable } from "@@/server/db/schema";
import { Income } from "@@/server/dtos/income";
import { resolveGroupId } from "@@/server/utils/groupAccess";
import { created, parseOr400 } from "@@/server/utils/http";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const data = await readBody(event);
  data.userId = user.id;

  const income = parseOr400(Income.omit({ id: true }), data);
  income.groupId = await resolveGroupId(user.id, income);

  const [inserted] = await db.insert(incomesTable).values(income).returning();

  return created(event, inserted);
});
