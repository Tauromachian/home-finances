import { describe, expect, it } from "vitest";

import {
  EXPENSE_COLUMNS,
  normalizeImportRows,
  parseCsv,
  toCsv,
} from "../../app/utils/spreadsheet";

describe("toCsv", () => {
  it("Serializes records with a label header row", () => {
    const csv = toCsv(
      [
        {
          name: "Rent",
          amount: 800,
          category: "Home",
          expenseDate: "2026-01-05",
          description: "",
        },
      ],
      EXPENSE_COLUMNS,
    );

    expect(csv).toBe(
      "Name,Amount,Category,Date,Description\nRent,800,Home,2026-01-05,",
    );
  });

  it("Quotes cells containing commas, quotes or newlines", () => {
    const csv = toCsv(
      [
        {
          name: 'Dinner, "fancy"',
          amount: 42.5,
          category: "Food",
          expenseDate: "2026-02-01",
          description: "line one\nline two",
        },
      ],
      EXPENSE_COLUMNS,
    );

    expect(csv).toContain('"Dinner, ""fancy"""');
    expect(csv).toContain('"line one\nline two"');
  });
});

describe("parseCsv", () => {
  it("Round-trips toCsv output", () => {
    const records = [
      {
        name: 'Dinner, "fancy"',
        amount: 42.5,
        category: "Food",
        expenseDate: "2026-02-01",
        description: "yum",
      },
    ];

    const parsed = parseCsv(toCsv(records, EXPENSE_COLUMNS));

    expect(parsed).toEqual([
      {
        Name: 'Dinner, "fancy"',
        Amount: "42.5",
        Category: "Food",
        Date: "2026-02-01",
        Description: "yum",
      },
    ]);
  });

  it("Returns no rows for empty input", () => {
    expect(parseCsv("")).toEqual([]);
    expect(parseCsv("Name,Amount\n\n")).toEqual([]);
  });
});

describe("normalizeImportRows", () => {
  it("Accepts valid rows matched by label", () => {
    const { rows, errors } = normalizeImportRows(
      [
        {
          Name: "Rent",
          Amount: "800",
          Category: "Home",
          Date: "2026-01-05",
          Description: "jan",
        },
      ],
      EXPENSE_COLUMNS,
    );

    expect(errors).toEqual([]);
    expect(rows).toEqual([
      {
        name: "Rent",
        amount: 800,
        category: "Home",
        expenseDate: "2026-01-05",
        description: "jan",
      },
    ]);
  });

  it("Matches headers by key and trims values", () => {
    const { rows, errors } = normalizeImportRows(
      [
        {
          name: "  Rent  ",
          amount: 800,
          category: "Home",
          expenseDate: "2026-01-05",
          description: "",
        },
      ],
      EXPENSE_COLUMNS,
    );

    expect(errors).toEqual([]);
    expect(rows[0].name).toBe("Rent");
  });

  it("Collects per-row errors and skips blank rows", () => {
    const { rows, errors } = normalizeImportRows(
      [
        { Name: "", Amount: "", Category: "", Date: "", Description: "" },
        { Name: "", Amount: "abc", Category: "Home", Date: "05/01/2026" },
        { Name: "Rent", Amount: -5, Category: "Home", Date: "2026-01-05" },
      ],
      EXPENSE_COLUMNS,
    );

    expect(rows).toEqual([]);
    expect(errors).toContain("Row 3: Name is required");
    expect(errors).toContain("Row 3: Amount must be a number");
    expect(errors).toContain("Row 3: Date must be a date (YYYY-MM-DD)");
    expect(errors).toContain("Row 4: Amount must be positive");
  });

  it("Normalizes Excel Date objects to ISO dates", () => {
    const { rows, errors } = normalizeImportRows(
      [
        {
          Name: "Rent",
          Amount: 800,
          Category: "Home",
          Date: new Date(2026, 0, 5),
          Description: "",
        },
      ],
      EXPENSE_COLUMNS,
    );

    expect(errors).toEqual([]);
    expect(rows[0].expenseDate).toBe("2026-01-05");
  });
});
