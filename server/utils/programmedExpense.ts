import { Frequency } from "../../app/types/frequency";

export interface ProgrammedExpenseInput {
  frequency?: unknown;
  chargeDay?: unknown;
  chargeMonth?: unknown;
  [key: string]: unknown;
}

export interface NormalizedSchedule {
  frequency: Frequency;
  chargeDay: number;
  chargeMonth: number | null;
}

export type ScheduleValidation =
  | { ok: true; value: NormalizedSchedule }
  | { ok: false; message: string };

const VALID_FREQUENCIES: readonly string[] = Object.values(Frequency);

function toInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);

  return Number.isInteger(parsed) ? parsed : null;
}

// Mirrors the programmed_expenses CHECK constraints so invalid charge
// schedules fail with a 400 instead of a 500 from Postgres. A month only
// applies to yearly expenses and is forced to null otherwise.
export function validateChargeSchedule(
  body: ProgrammedExpenseInput,
): ScheduleValidation {
  if (!VALID_FREQUENCIES.includes(body.frequency as string)) {
    return {
      ok: false,
      message: "frequency must be one of: monthly, yearly, one_time, weekly",
    };
  }

  const frequency = body.frequency as Frequency;
  const day = toInteger(body.chargeDay);

  if (day === null || day < 1 || day > 31) {
    return {
      ok: false,
      message: "chargeDay must be an integer between 1 and 31",
    };
  }

  if (frequency === Frequency.YEARLY) {
    const month = toInteger(body.chargeMonth);

    if (month === null || month < 1 || month > 12) {
      return {
        ok: false,
        message:
          "chargeMonth must be an integer between 1 and 12 for yearly expenses",
      };
    }

    return {
      ok: true,
      value: { frequency, chargeDay: day, chargeMonth: month },
    };
  }

  return { ok: true, value: { frequency, chargeDay: day, chargeMonth: null } };
}
