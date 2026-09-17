import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";

import { groupsTable } from "./groups";
import { usersTable } from "./users";

export const usersGroupsTable = pgTable(
  "users_groups",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => groupsTable.id),
  },
  (table) => [
    unique("users_groups_user_group_unique").on(table.userId, table.groupId),
  ],
);
