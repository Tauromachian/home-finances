import { sql } from "drizzle-orm";
import {
  check,
  integer,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { frequencyEnum } from "./frequency";
import { usersTable } from "./users";

export const programmedIncomesTable = pgTable(
  "programmed_incomes",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    amount: numeric({ mode: "number" }).notNull(),
    name: varchar({ length: 150 }).notNull(),
    frequency: frequencyEnum().notNull(),
    description: varchar({ length: 255 }),
    chargeDay: integer("charge_day").notNull(),
    // NULL means "not applicable": only yearly incomes carry a month.
    chargeMonth: integer("charge_month"),
  },
  (table) => [
    check(
      "programmed_incomes_charge_month_check",
      // Note: the explicit IS NOT NULL is required. WITHOUT it a yearly
      // row with charge_month = NULL evaluates to UNKNOWN, which CHECK
      // treats as a pass (verified against Postgres).
      sql`(${table.frequency} != 'yearly' AND ${table.chargeMonth} IS NULL) OR (${table.frequency} = 'yearly' AND ${table.chargeMonth} IS NOT NULL AND ${table.chargeMonth} BETWEEN 1 AND 12)`,
    ),
    check(
      "programmed_incomes_charge_day_check",
      sql`${table.chargeDay} BETWEEN 1 AND 31`,
    ),
  ],
);
