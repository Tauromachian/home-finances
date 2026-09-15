import type { Frequency } from "./frequency";

export type Income = {
  id?: string | number;
  name: string;
  amount: number;
  incomeDate: string;
  description: string;
};

export type ProgrammedIncome = {
  id?: string | number;
  name: string;
  amount: number;
  frequency: Frequency;
  description: string;
  chargeDay: number | null;
  chargeMonth: number | null;
};
