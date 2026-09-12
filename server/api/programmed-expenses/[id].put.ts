import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { programmedExpensesTable } from "@@/server/db/schema";

import { validateChargeSchedule } from "@@/server/utils/programmedExpense";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const programmedExpense = await readBody(event);
  programmedExpense.userId = user.id;

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
