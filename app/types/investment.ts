export type Investment = {
  id?: number | string;
  name: string;
  category: string;
  amount: number;
  currentValue: number;
  description: string;
  /** Qualified market link SYM/EXCH (e.g. "AAPL", "SAP/XFRA"). Null = manual. */
  marketSymbol?: string | null;
};
