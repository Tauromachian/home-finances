import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith("/api")) return;

  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  user.id = user.sub;
  event.context.user = user;
});
