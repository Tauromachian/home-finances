import { Frequency } from "~/types/frequency";

export const frequencies = [
  {
    title: "Monthly",
    value: Frequency.MONTHLY,
  },
  {
    title: "Yearly",
    value: Frequency.YEARLY,
  },
] as const;
