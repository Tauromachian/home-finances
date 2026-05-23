import { db } from "../../orm";

import { expensesTable } from "../../db/schema";

export default defineEventHandler(async () => {
  const expenses = await db.select().from(expensesTable);
  return { data: expenses };
});
