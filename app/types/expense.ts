import type { z } from "zod";

import type { Expense as ExpenseSchema } from "../../server/dtos/expense";
import type { ProgrammedExpense as ProgrammedExpenseSchema } from "../../server/dtos/programmed-expense";

/**
 * Rows as returned by the API — inferred from the Zod DTOs in
 * `server/dtos`, which are the single source of truth shared with the
 * server. The hand-written duplicates that used to live here have been
 * removed so the two can't drift.
 */
export type Expense = z.infer<typeof ExpenseSchema>;
export type FormExpense = Omit<Expense, "id" | "userId">;

export type ProgrammedExpense = z.infer<typeof ProgrammedExpenseSchema>;
export type FormProgrammedExpense = Omit<ProgrammedExpense, "id" | "userId">;
