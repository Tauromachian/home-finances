import { parseIsoDate, toISODate } from "./period";

export type SheetCellType = "string" | "number" | "date";

export interface SheetColumn {
  key: string;
  label: string;
  type: SheetCellType;
  required?: boolean;
  // Numbers must be > 0 (e.g. amounts).
  positive?: boolean;
}

export type SheetRow = Record<string, string | number | null>;

export const EXPENSE_COLUMNS: SheetColumn[] = [
  { key: "name", label: "Name", type: "string", required: true },
  {
    key: "amount",
    label: "Amount",
    type: "number",
    required: true,
    positive: true,
  },
  { key: "category", label: "Category", type: "string", required: true },
  { key: "expenseDate", label: "Date", type: "date", required: true },
  { key: "description", label: "Description", type: "string" },
];

export const INCOME_COLUMNS: SheetColumn[] = [
  { key: "name", label: "Name", type: "string", required: true },
  {
    key: "amount",
    label: "Amount",
    type: "number",
    required: true,
    positive: true,
  },
  { key: "incomeDate", label: "Date", type: "date", required: true },
  { key: "description", label: "Description", type: "string" },
];

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";

  const text = String(value);

  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(
  records: Record<string, unknown>[],
  columns: SheetColumn[],
): string {
  const header = columns.map((column) => escapeCsvCell(column.label)).join(",");
  const lines = (records ?? []).map((record) =>
    columns
      .map((column) =>
        escapeCsvCell(record[column.key] as string | number | null),
      )
      .join(","),
  );

  return [header, ...lines].join("\n");
}

// Minimal RFC-4180 parser: quoted cells, escaped quotes, commas and
// newlines inside quotes. Returns one object per row keyed by header.
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuotes = false;

  const pushCell = () => {
    current.push(cell);
    cell = "";
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      pushCell();
    } else if (char === "\n") {
      pushCell();
      rows.push(current);
      current = [];
    } else if (char === "\r") {
      // Ignore; \n handles the break.
    } else {
      cell += char;
    }
  }

  pushCell();
  rows.push(current);

  const nonEmpty = rows.filter((row) =>
    row.some((value) => value.trim() !== ""),
  );

  if (!nonEmpty.length) return [];

  const [header, ...data] = nonEmpty;

  return data.map((row) =>
    Object.fromEntries(header.map((name, index) => [name, row[index] ?? ""])),
  );
}

// Reads a .csv or .xlsx/.xls file into raw row objects keyed by header.
// The xlsx library is dynamically imported so it only lands in the
// client bundle when an Excel file is actually parsed.
export async function parseSpreadsheetFile(
  file: File,
): Promise<Record<string, unknown>[]> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) {
    return parseCsv(await file.text());
  }

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(await file.arrayBuffer(), {
      type: "array",
      cellDates: true,
    });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) return [];

    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });
  }

  throw new Error("Unsupported file type. Use .csv, .xlsx or .xls");
}

function normalizeDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toISODate(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    );
  }

  if (typeof value === "string") {
    const parsed = parseIsoDate(value.trim());
    if (parsed) return toISODate(parsed.year, parsed.month, parsed.day);
  }

  return null;
}

export interface NormalizedImport {
  rows: SheetRow[];
  errors: string[];
}

// Maps raw rows (headers matched by label or key, case-insensitive) to
// typed rows, collecting per-row errors. Blank rows are skipped.
export function normalizeImportRows(
  raw: Record<string, unknown>[],
  columns: SheetColumn[],
): NormalizedImport {
  const rows: SheetRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < (raw ?? []).length; i++) {
    const rawRow = raw[i];
    const line = i + 2;
    const rowErrors: string[] = [];
    const row: SheetRow = {};

    const isBlank = Object.values(rawRow).every(
      (value) => value === "" || value === null || value === undefined,
    );

    if (isBlank) continue;

    const lookup: Record<string, unknown> = {};
    for (const [header, value] of Object.entries(rawRow)) {
      lookup[header.trim().toLowerCase()] = value;
    }

    for (const column of columns) {
      const rawValue =
        lookup[column.label.toLowerCase()] ?? lookup[column.key.toLowerCase()];

      if (rawValue === "" || rawValue === null || rawValue === undefined) {
        if (column.required) {
          rowErrors.push(`Row ${line}: ${column.label} is required`);
        }
        row[column.key] = null;
        continue;
      }

      if (column.type === "number") {
        const amount = Number(rawValue);

        if (!Number.isFinite(amount)) {
          rowErrors.push(`Row ${line}: ${column.label} must be a number`);
          row[column.key] = null;
        } else if (column.positive && amount <= 0) {
          rowErrors.push(`Row ${line}: ${column.label} must be positive`);
          row[column.key] = null;
        } else {
          row[column.key] = amount;
        }
        continue;
      }

      if (column.type === "date") {
        const date = normalizeDate(rawValue);

        if (!date) {
          rowErrors.push(
            `Row ${line}: ${column.label} must be a date (YYYY-MM-DD)`,
          );
          row[column.key] = null;
        } else {
          row[column.key] = date;
        }
        continue;
      }

      row[column.key] = String(rawValue).trim();

      if (column.required && row[column.key] === "") {
        rowErrors.push(`Row ${line}: ${column.label} is required`);
      }
    }

    if (rowErrors.length) {
      errors.push(...rowErrors);
    } else {
      rows.push(row);
    }
  }

  return { rows, errors };
}

export function downloadTextFile(
  filename: string,
  text: string,
  mime: string,
): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function downloadXlsxFile(
  filename: string,
  records: Record<string, unknown>[],
  columns: SheetColumn[],
): Promise<void> {
  const XLSX = await import("xlsx");
  const data = (records ?? []).map((record) =>
    Object.fromEntries(
      columns.map((column) => [column.label, record[column.key] ?? ""]),
    ),
  );
  const sheet = XLSX.utils.json_to_sheet(data, {
    header: columns.map((column) => column.label),
  });
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, sheet, "Data");
  XLSX.writeFile(workbook, filename);
}

export function exportFilename(prefix: string, extension: string): string {
  const now = new Date();
  return `${prefix}-${toISODate(now.getFullYear(), now.getMonth() + 1, now.getDate())}.${extension}`;
}
