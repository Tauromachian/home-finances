import type { Frequency } from "./frequency";

export type Expense = {
  id?: string | number;
  name: string;
  amount: number;
  category: string;
  date: string;
  description: string;
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
};
