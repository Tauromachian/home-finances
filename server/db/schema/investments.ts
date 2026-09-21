import {
  index,
  integer,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersTable } from "./users";

export const investmentsTable = pgTable(
  "investments",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    name: varchar({ length: 255 }).notNull(),
    category: varchar({ length: 255 }).notNull(),
    amount: numeric({ mode: "number" }).notNull(),
    currentValue: numeric("current_value", { mode: "number" }).notNull(),
    description: varchar({ length: 255 }),
    // Link to a market quote: qualified SYM/EXCH (e.g. "AAPL", "SAP/XFRA").
    // Nullable (manual holdings stay NULL), deliberately non-unique so several
    // lots — and several users — can track the same symbol.
    // NOTE: code-only change; run `drizzle-kit generate + migrate` before deploy.
    marketSymbol: varchar("market_symbol", { length: 32 }),
  },
  (t) => [index("investments_user_market_idx").on(t.userId, t.marketSymbol)],
);
