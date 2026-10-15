import * as z from "zod";

export const Expense = z.object({
  id: z.number(),
  userId: z.uuid(),
  groupId: z.number().optional(),
  name: z.string(),
  amount: z.number(),
  category: z.string(),
  expenseDate: z.string(),
  description: z.string().optional(),
});
