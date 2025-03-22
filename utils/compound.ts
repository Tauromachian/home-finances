export function calculateCompoundInterest(
  principal: number,
  annualPercent: number,
  time: number = 10,
) {
  const rate = annualPercent / 100;

  const amount = principal * Math.pow(1 + rate, time);
  const interest = amount - principal;
  return {
    finalAmount: amount.toFixed(2),
    interestEarned: interest.toFixed(2),
  };
}
