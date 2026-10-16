import * as z from "zod";

export const Expense = z.object({
  id: z.number().positive(),
  userId: z.uuid(),
  groupId: z.number().positive().nullish(),
  name: z.string(),
  amount: z.number().positive(),
  category: z.string(),
  expenseDate: z.string(),
  description: z.string().optional(),
});
