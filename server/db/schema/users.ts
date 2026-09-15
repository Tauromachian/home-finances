import { pgSchema, text, uuid, varchar } from "drizzle-orm/pg-core";

const auth = pgSchema("auth");

export const usersTable = auth.table("users", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});
