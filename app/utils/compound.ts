export function compoundInterest(
  principal: number,
  annualPercent: number,
  time: number = 10,
): number {
  const rate = annualPercent / 100;

  const amount = principal * Math.pow(1 + rate, time);
  return +amount.toFixed(2);
}

export function compoundInterestWithMonthlyReinvestment(
  principal: number,
  monthlyContribution: number,
  annualPercent: number,
  time: number = 10,
): number {
  const rate = annualPercent / 100;
  const monthlyRate = rate / 12;
  const periods = 12 * time;

  const amountFromPrincipal = principal * Math.pow(1 + monthlyRate, periods);
  const amountFromMonthly =
    monthlyContribution *
    ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate);

  return +(amountFromPrincipal + amountFromMonthly).toFixed(2);
}
