export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number = 10,
) {
  const amount = principal * Math.pow(1 + rate, time);
  const interest = amount - principal;
  return {
    finalAmount: amount.toFixed(2),
    interestEarned: interest.toFixed(2),
  };
}
