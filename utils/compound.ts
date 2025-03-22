export function calculateCompoundInterest(
  principal: number,
  annualPercent: number,
  time: number = 10,
) {
  const rate = annualPercent / 100;

  const amount = principal * Math.pow(1 + rate, time);

  return amount.toFixed(2);
}
