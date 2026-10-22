import * as z from "zod";

import { Frequency } from "../../app/types/frequency";

// Derived from the shared Frequency const so client/util/server can't drift.
const FrequencyValues = Object.values(Frequency) as [Frequency, ...Frequency[]];

/**
 * Row-and-body shape for programmed incomes. Shared source of truth for
 * the client types (inferred via `z.infer`) and, eventually, the
 * programmed-incomes endpoints (same `.omit({ id: true, userId: true })`
 * pattern as expenses/incomes).
 */
export const ProgrammedIncome = z.object({
  id: z.number().positive().optional(),
  userId: z.uuid(),
  // NULL means personal; set means shared with the group.
  groupId: z.number().positive().nullish(),
  name: z.string(),
  amount: z.number().positive(),
  frequency: z.enum(FrequencyValues),
  description: z.string(),
  // Nullable in the form state (day picked later); rows always carry a day.
  chargeDay: z.number().int().min(1).max(31).nullish(),
  // Only yearly rows carry a month; it is forced to null otherwise.
  chargeMonth: z.number().int().min(1).max(12).nullish(),
});
