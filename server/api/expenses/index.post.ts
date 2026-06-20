import { serverSupabaseUser } from "#supabase/server";

import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  const expense = await readBody(event);

  if (!user) throw createError({ status: 401 });
  expense.userId = user.sub;

  await db.insert(expensesTable).values(expense);

  return { msg: "Success" };
});
