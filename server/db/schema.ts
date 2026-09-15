// Barrel: each table lives in its own file under ./schema/.
// Existing imports of `@@/server/db/schema` keep working unchanged,
// and drizzle.config.ts still points at this file (drizzle-kit follows
// the re-exports).
export * from "./schema/frequency";
export * from "./schema/users";
export * from "./schema/expenses";
export * from "./schema/programmed-expenses";
export * from "./schema/incomes";
export * from "./schema/programmed-incomes";
export * from "./schema/investments";
export * from "./schema/groups";
export * from "./schema/users-groups";
