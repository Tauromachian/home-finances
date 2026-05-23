import { integer, pgTable, varchar, numeric } from "drizzle-orm/pg-core";

export const expensesTable = pgTable("expenses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  amount: numeric().notNull(),
  name: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  frequency: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 255 }),
});
