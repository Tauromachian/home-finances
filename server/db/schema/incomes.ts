import {
  date,
  integer,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersTable } from "./users";

export const incomesTable = pgTable("incomes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  amount: numeric({ mode: "number" }).notNull(),
  name: varchar({ length: 150 }).notNull(),
  incomeDate: date("income_date").notNull(),
  description: varchar({ length: 255 }),
});
