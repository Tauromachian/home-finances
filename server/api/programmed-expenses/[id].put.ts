import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { programmedExpensesTable } from "@@/server/db/schema";

import {
  assertRecordAccess,
  resolveGroupId,
} from "@@/server/utils/groupAccess";
import { validateChargeSchedule } from "@@/server/utils/programmedExpense";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const [existing] = await db
    .select({
      userId: programmedExpensesTable.userId,
      groupId: programmedExpensesTable.groupId,
    })
    .from(programmedExpensesTable)
    .where(eq(programmedExpensesTable.id, id))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Expense not found" });
  }

  await assertRecordAccess(user.id, existing);

  const programmedExpense = await readBody(event);
  programmedExpense.groupId = await resolveGroupId(user.id, programmedExpense);

  const schedule = validateChargeSchedule(programmedExpense);

  // NOTE: explicit `=== false` comparison. The repo tsconfig is not
  // strict, and `!schedule.ok` does not narrow the union there.
  if (schedule.ok === false) {
    throw createError({ statusCode: 400, message: schedule.message });
  }

  Object.assign(programmedExpense, schedule.value);

  await db
    .update(programmedExpensesTable)
    .set(programmedExpense)
    .where(eq(programmedExpensesTable.id, id));

  return { msg: "Success" };
});
