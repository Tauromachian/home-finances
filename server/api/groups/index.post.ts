import { db } from "@@/server/orm";

import { groupsTable, usersGroupsTable } from "@@/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const body = await readBody(event);

  if (!body?.name || typeof body.name !== "string") {
    throw createError({ statusCode: 400, message: "name is required" });
  }

  const [group] = await db
    .insert(groupsTable)
    .values({ name: body.name })
    .returning({ id: groupsTable.id, name: groupsTable.name });

  // Purely defensive should never happen unless there is a DB error
  if (!group?.id) throw new Error("Issue inserting group");

  await db.insert(usersGroupsTable).values({
    userId: user.id,
    groupId: group.id,
  });

  return { msg: "Success", data: group };
});
