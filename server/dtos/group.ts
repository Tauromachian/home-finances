import * as z from "zod";

export const Group = z.object({
  id: z.number(),
  name: z.string(),
});
