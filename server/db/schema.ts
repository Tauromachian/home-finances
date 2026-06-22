import {
  integer,
  pgTable,
  varchar,
  numeric,
  text,
  pgSchema,
  uuid,
} from "drizzle-orm/pg-core";

const auth = pgSchema("auth");

export const usersTable = auth.table("users", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

export const expensesTable = pgTable("expenses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  amount: numeric({ mode: "number" }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  frequency: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 255 }),
});

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

export const incomeTable = pgTable("income", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 255 }).notNull(),
  amount: numeric({ mode: "number" }).notNull(),
  frequency: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
});
