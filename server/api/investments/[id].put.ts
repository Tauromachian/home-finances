import { eq } from "drizzle-orm";
import { serverSupabaseUser } from "#supabase/server";

import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) throw createError({ status: 401 });

  const investment = await readBody(event);

  investment.userId = user.sub;

  await db
    .update(investmentsTable)
    .set(investment)
    .where(eq(investmentsTable.id, investment.id));

  return { msg: "Success" };
});
