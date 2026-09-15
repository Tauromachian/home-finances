import { pgEnum } from "drizzle-orm/pg-core";

import { Frequency } from "../../../app/types/frequency";

export const frequencyValues = [...Object.values(Frequency)] as [
  string,
  ...string[],
];

export const frequencyEnum = pgEnum("frequency", frequencyValues);
