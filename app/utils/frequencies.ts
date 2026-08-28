import type { Frequency } from "~/types/frequency";

export const frequencies: { title: string; value: Frequency }[] = [
  { title: "One Time", value: "one_time" },
  {
    title: "Monthly",
    value: "monthly",
  },
  {
    title: "Yearly",
    value: "yearly",
  },
];
