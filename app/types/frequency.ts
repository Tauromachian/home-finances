export const Frequency = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
  ONE_TIME: "one_time",
  WEEKLY: "weekly",
} as const;
export type Frequency = (typeof Frequency)[keyof typeof Frequency];
