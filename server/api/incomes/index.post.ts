import { db } from "@@/server/orm";

import { incomesTable } from "@@/server/db/schema";
import { resolveGroupId } from "@@/server/utils/groupAccess";
import { Income } from "@@/server/dtos/income";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const data = await readBody(event);
  data.userId = user.id;

  const res = Income.omit({ id: true }).safeParse(data);

  if (!res.success) {
    throw createError({
      statusCode: 400,
      message: "Bad Request",
      data: res.error,
    });
  }

  data.groupId = await resolveGroupId(user.id, data);
  const [insertedIncome] = await db
    .insert(incomesTable)
    .values(data)
    .returning();

  setResponseStatus(event, 201);

  return { data: insertedIncome, message: "Success" };
});
