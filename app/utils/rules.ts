export function required(value: string) {
  if (!value) return "This field is required";

  return true;
}

export function positiveNumber(value: string) {
  if (!value) return "This field is required";

  if (/^[0-9]+$/.test(value) && parseFloat(value) > 0) return true;
  return "This field needs to be positive number";
}
