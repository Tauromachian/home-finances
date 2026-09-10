export function required(value: string) {
  if (!value) return "This field is required";

  return true;
}

export function positiveNumber(value: string | number | unknown) {
  if (value === undefined || value === null || value === "")
    return "This field is required";

  if (typeof value === "number") {
    if (Number.isFinite(value) && value > 0) return true;
    return "This field needs to be positive number";
  }

  const normalized = String(value).trim().replace(",", ".");

  if (!/^(\d+(\.\d+)?|\.\d+)$/.test(normalized)) {
    return "This field needs to be positive number";
  }

  if (parseFloat(normalized) > 0) return true;
  return "This field needs to be positive number";
}

export function chargeDay(value: string | number | unknown) {
  if (value === undefined || value === null || value === "")
    return "This field is required";

  const day = typeof value === "number" ? value : Number(String(value).trim());

  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return "This field needs to be a day between 1 and 31";
  }

  return true;
}
