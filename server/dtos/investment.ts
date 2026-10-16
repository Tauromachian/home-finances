import * as z from "zod";

export const Investment = z.object({
  id: z.number().positive(),
  userId: z.uuid(),
  name: z.string(),
  category: z.string(),
  amount: z.number().positive(),
  currentValue: z.number().nonnegative(),
  description: z.string().optional(),
  marketSymbol: z.string().max(32).nullish(),
});
