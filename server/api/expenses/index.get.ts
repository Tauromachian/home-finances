import { eq } from "drizzle-orm";
import { serverSupabaseUser } from "#supabase/server";

import { db } from "../../orm";

import { expensesTable } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) throw createError({ status: 401 });

  const expenses = await db
    .select()
    .from(expensesTable)
    .where(eq(expensesTable.userId, user.sub));
  return { data: expenses };
});
