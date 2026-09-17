import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { programmedIncomesTable } from "@@/server/db/schema";

import {
  assertRecordAccess,
  resolveGroupId,
} from "@@/server/utils/groupAccess";
import { validateChargeSchedule } from "@@/server/utils/programmedIncome";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const user = event.context.user;

  const [existing] = await db
    .select({
      userId: programmedIncomesTable.userId,
      groupId: programmedIncomesTable.groupId,
    })
    .from(programmedIncomesTable)
    .where(eq(programmedIncomesTable.id, id))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, message: "Income not found" });
  }

  await assertRecordAccess(user.id, existing);

  const programmedIncome = await readBody(event);
  programmedIncome.groupId = await resolveGroupId(user.id, programmedIncome);

  const schedule = validateChargeSchedule(programmedIncome);

  // NOTE: explicit `=== false` comparison. The repo tsconfig is not
  // strict, and `!schedule.ok` does not narrow the union there.
  if (schedule.ok === false) {
    throw createError({ statusCode: 400, message: schedule.message });
  }

  Object.assign(programmedIncome, schedule.value);

  await db
    .update(programmedIncomesTable)
    .set(programmedIncome)
    .where(eq(programmedIncomesTable.id, id));

  return { msg: "Success" };
});
