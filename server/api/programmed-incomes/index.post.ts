import { db } from "@@/server/orm";

import { programmedIncomesTable } from "@@/server/db/schema";

import { validateChargeSchedule } from "@@/server/utils/programmedIncome";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const programmedIncome = await readBody(event);
  programmedIncome.userId = user.id;

  const schedule = validateChargeSchedule(programmedIncome);

  // NOTE: explicit `=== false` comparison. The repo tsconfig is not
  // strict, and `!schedule.ok` does not narrow the union there.
  if (schedule.ok === false) {
    throw createError({ statusCode: 400, message: schedule.message });
  }

  Object.assign(programmedIncome, schedule.value);

  await db.insert(programmedIncomesTable).values(programmedIncome);

  return { msg: "Success" };
});
