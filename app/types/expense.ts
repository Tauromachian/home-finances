import type { Frequency } from "./frequency";

export type Expense = {
  id?: string | number;
  name: string;
  amount: number;
  category: string;
  frequency: Frequency;
  description: string;
};
