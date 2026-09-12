import {
  integer,
  pgTable,
  varchar,
  numeric,
  text,
  pgSchema,
  uuid,
  pgEnum,
  date,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { Frequency } from "../../app/types/frequency";

const auth = pgSchema("auth");

export const frequencyValues = [...Object.values(Frequency)] as [
  string,
  ...string[],
];

export const frequencyEnum = pgEnum("frequency", frequencyValues);

export const usersTable = auth.table("users", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

export const programmedExpensesTable = pgTable(
  "programmed_expenses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    amount: numeric({ mode: "number" }).notNull(),
    name: varchar({ length: 150 }).notNull(),
    category: varchar({ length: 20 }).notNull(),
    frequency: frequencyEnum().notNull(),
    description: varchar({ length: 255 }),
    chargeDay: integer("charge_day").notNull(),
    // NULL means "not applicable": only yearly expenses carry a month.
    chargeMonth: integer("charge_month"),
  },
  (table) => [
    check(
      "programmed_expenses_charge_month_check",
      // Note: the explicit IS NOT NULL is required. WITHOUT it a yearly
      // row with charge_month = NULL evaluates to UNKNOWN, which CHECK
      // treats as a pass (verified against Postgres).
      sql`(${table.frequency} != 'yearly' AND ${table.chargeMonth} IS NULL) OR (${table.frequency} = 'yearly' AND ${table.chargeMonth} IS NOT NULL AND ${table.chargeMonth} BETWEEN 1 AND 12)`,
    ),
    check(
      "programmed_expenses_charge_day_check",
      sql`${table.chargeDay} BETWEEN 1 AND 31`,
    ),
  ],
);

export const expensesTable = pgTable("expenses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  amount: numeric({ mode: "number" }).notNull(),
  name: varchar({ length: 150 }).notNull(),
  category: varchar({ length: 20 }).notNull(),
  expenseDate: date("expense_date").notNull(),
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
