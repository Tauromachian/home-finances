import { db } from "@@/server/orm";

import { groupsTable, usersGroupsTable } from "@@/server/db/schema";
import { Group } from "@@/server/dtos/group";
import { created, parseOr400 } from "@@/server/utils/http";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const body = await readBody(event);

  const groupData = parseOr400(
    Group.omit({ id: true }),
    body,
    "name is required",
  );

  const [group] = await db
    .insert(groupsTable)
    .values(groupData)
    .returning({ id: groupsTable.id, name: groupsTable.name });

  // Purely defensive should never happen unless there is a DB error
  if (!group?.id) throw new Error("Issue inserting group");

  await db.insert(usersGroupsTable).values({
    userId: user.id,
    groupId: group.id,
  });

  return created(event, group);
});
