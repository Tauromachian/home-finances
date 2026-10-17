import type { H3Event } from "h3";
import type * as z from "zod";

/**
 * Validates `body` against a Zod schema, throwing 400 on failure.
 * Use in POST/PUT handlers instead of repeating the safeParse boilerplate.
 * Always validate first and insert the returned (parsed) value — never the
 * raw body — so unknown or uncoerced fields can't reach the database.
 */
export function parseOr400<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown,
  message = "Bad Request",
): z.infer<T> {
  const res = schema.safeParse(body);

  if (!res.success) {
    throw createError({
      statusCode: 400,
      message,
      data: res.error,
    });
  }

  return res.data;
}

/**
 * 201 + `{ message, data }` success envelope for create endpoints.
 */
export function created<T>(event: H3Event, data: T) {
  setResponseStatus(event, 201);

  return { message: "Success", data };
}
