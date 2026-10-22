import type { z } from "zod";

import type { Investment as InvestmentSchema } from "../../server/dtos/investment";

/**
 * Rows as returned by the API — inferred from the Zod DTO in
 * `server/dtos`, which is the single source of truth shared with the
 * server. The hand-written duplicate that used to live here has been
 * removed so the two can't drift.
 */
export type Investment = z.infer<typeof InvestmentSchema>;
export type FormInvestment = Omit<Investment, "id" | "userId">;
