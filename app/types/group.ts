import type { z } from "zod";

import type { Group as GroupSchema } from "../../server/dtos/group";

/**
 * Inferred from the Zod DTO in `server/dtos` — the single source of truth
 * shared with the server.
 */
export type Group = z.infer<typeof GroupSchema>;

export type GroupMember = {
  userId: string;
  email: string | null;
};
