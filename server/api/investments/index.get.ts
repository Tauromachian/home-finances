import { db } from "../../orm";

import { investmentsTable } from "../../db/schema";

export default defineEventHandler(async () => {
  const investments = await db.select().from(investmentsTable);
  return { data: investments };
});
