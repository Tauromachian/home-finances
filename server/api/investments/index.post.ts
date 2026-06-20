import { serverSupabaseUser } from "#supabase/server";

import { db } from "@@/server/orm";

import { investmentsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  const investment = await readBody(event);

  if (!user) throw createError({ status: 401 });
  investment.userId = user.sub;

  await db.insert(investmentsTable).values(investment);

  return { msg: "Success" };
});
