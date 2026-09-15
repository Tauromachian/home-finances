import { integer, numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { usersTable } from "./users";

export const investmentsTable = pgTable("investments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  amount: numeric({ mode: "number" }).notNull(),
  currentValue: numeric("current_value", { mode: "number" }).notNull(),
  description: varchar({ length: 255 }),
});
