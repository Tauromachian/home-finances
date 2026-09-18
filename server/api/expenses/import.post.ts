import { parseIsoDate } from "@@/app/utils/period";
import { db } from "@@/server/orm";

import { expensesTable } from "@@/server/db/schema";
import { resolveGroupId } from "@@/server/utils/groupAccess";

interface ImportRow {
  name?: unknown;
  amount?: unknown;
  category?: unknown;
  expenseDate?: unknown;
}

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const body = await readBody(event);
  const groupId = await resolveGroupId(user.id, body ?? {});
  const rawRows = Array.isArray(body?.rows) ? (body.rows as ImportRow[]) : [];

  const valid: {
    userId: string;
    groupId: number | null;
    name: string;
    amount: number;
    category: string;
    expenseDate: string;
    description: string;
  }[] = [];
  const errors: string[] = [];

  rawRows.forEach((row, index) => {
    const line = index + 1;
    const rowErrors: string[] = [];

    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) rowErrors.push(`Row ${line}: name is required`);

    const amount = Number(row.amount);
    if (!Number.isFinite(amount)) {
      rowErrors.push(`Row ${line}: amount must be a number`);
    } else if (amount <= 0) {
      rowErrors.push(`Row ${line}: amount must be positive`);
    }

    const category =
      typeof row.category === "string" ? row.category.trim() : "";
    if (!category) rowErrors.push(`Row ${line}: category is required`);

    const expenseDate =
      typeof row.expenseDate === "string" ? row.expenseDate.trim() : "";
    if (!parseIsoDate(expenseDate)) {
      rowErrors.push(`Row ${line}: expenseDate must be a date (YYYY-MM-DD)`);
    }

    if (rowErrors.length) {
      errors.push(...rowErrors);
      return;
    }

    valid.push({
      userId: user.id,
      groupId,
      name,
      amount,
      category,
      expenseDate,
      description:
        typeof (row as { description?: unknown }).description === "string"
          ? ((row as { description?: unknown }).description as string).trim()
          : "",
    });
  });

  if (valid.length) {
    await db.insert(expensesTable).values(valid);
  }

  return { inserted: valid.length, errors };
});
