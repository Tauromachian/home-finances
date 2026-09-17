import { eq } from "drizzle-orm";

import { db } from "@@/server/orm";

import { usersGroupsTable, usersTable } from "@@/server/db/schema";
import { assertGroupMember } from "@@/server/utils/groupAccess";

export default defineEventHandler(async (event) => {
  const groupId = Number(event.context.params?.id);
  const user = event.context.user;

  await assertGroupMember(user.id, groupId);

  const body = await readBody(event);
  const email = body?.email;

  if (!email || typeof email !== "string") {
    throw createError({ statusCode: 400, message: "email is required" });
  }

  const [invited] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email.trim().toLowerCase()))
    .limit(1);

  if (!invited) {
    throw createError({ statusCode: 404, message: "No user with this email" });
  }

  try {
    await db.insert(usersGroupsTable).values({
      userId: invited.id,
      groupId,
    });
  } catch {
    throw createError({
      statusCode: 409,
      message: "User is already a member of this group",
    });
  }

  return { msg: "Success" };
});
