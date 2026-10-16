import * as z from "zod";

export const Income = z.object({
  id: z.number().positive(),
  userId: z.uuid(),
  groupId: z.number().positive().nullish(),
  amount: z.number().positive(),
  name: z.string(),
  incomeDate: z.string(),
  description: z.string().optional(),
});
