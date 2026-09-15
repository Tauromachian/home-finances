import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const groupsTable = pgTable("groups", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 150 }).notNull(),
});
