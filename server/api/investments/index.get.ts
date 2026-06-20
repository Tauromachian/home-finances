import { serverSupabaseUser } from "#supabase/server";

import { db } from "../../orm";

import { investmentsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async () => {
  const user = await serverSupabaseUser(event);

  if (!user) throw createError({ status: 401 });

  const investments = await db
    .select()
    .from(investmentsTable)
    .where(eq(investmentsTable.userId, user.sub));
  return { data: investments };
});
