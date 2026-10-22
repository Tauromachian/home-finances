import type { z } from "zod";

import type { Income as IncomeSchema } from "../../server/dtos/income";
import type { ProgrammedIncome as ProgrammedIncomeSchema } from "../../server/dtos/programmed-income";

/**
 * Rows as returned by the API — inferred from the Zod DTOs in
 * `server/dtos`, which are the single source of truth shared with the
 * server. The hand-written duplicates that used to live here have been
 * removed so the two can't drift.
 */
export type Income = z.infer<typeof IncomeSchema>;
export type FormIncome = Omit<Income, "id" | "userId">;

export type ProgrammedIncome = z.infer<typeof ProgrammedIncomeSchema>;
export type FormProgrammedIncome = Omit<ProgrammedIncome, "id" | "userId">;
