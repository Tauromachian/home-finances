import type { Frequency } from "./frequency";

export type Expense = {
  id: string | number;
  userId: string;
  name: string;
  amount: number;
  category: string;
  expenseDate: string;
  description: string;
  groupId?: number;
};

export type ProgrammedExpense = {
  id?: string | number;
  name: string;
  amount: number;
  category: string;
  frequency: Frequency;
  description: string;
  chargeDay: number | null;
  chargeMonth: number | null;
  groupId?: number;
};
