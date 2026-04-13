export function getPayableAmount(payableLineItems, headCode) {
  if (!Array.isArray(payableLineItems)) return 0;
  const item = payableLineItems.find(
    (p) => p?.type === "PAYABLE" && p?.headCode === headCode
  );
  return Number(item?.amount) || 0;
}

export function hasPayableHead(payableLineItems, headCode) {
  return (
    Array.isArray(payableLineItems) &&
    payableLineItems.some(
      (p) => p?.type === "PAYABLE" && p?.headCode === headCode
    )
  );
}

export function perDayFromPayable(amount, attendance) {
  const d = Number(attendance);
  if (!d || d <= 0) return 0;
  return Math.round((Number(amount || 0) / d) * 100) / 100;
}

export function sumPayableAmounts(payableLineItems) {
  if (!Array.isArray(payableLineItems)) return 0;
  return payableLineItems
    .filter((p) => p?.type === "PAYABLE")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);
}

const HEADS_WITH_RATES = ["PER_DAY", "FOOD", "TRAVEL", "MISC"];

export function applyPerDayToPayables(originalPayables, rates, days) {
  const d = Number(days) || 0;
  if (!Array.isArray(originalPayables)) return [];
  const rateByHead = {
    PER_DAY: Number(rates.PER_DAY) || 0,
    FOOD: Number(rates.FOOD) || 0,
    TRAVEL: Number(rates.TRAVEL) || 0,
    MISC: Number(rates.MISC) || 0,
  };
  return originalPayables.map((item) => {
    if (
      item?.type !== "PAYABLE" ||
      !HEADS_WITH_RATES.includes(item.headCode)
    ) {
      return item;
    }
    const perDay = rateByHead[item.headCode] ?? 0;
    return { ...item, amount: Math.round(perDay * d) };
  });
}
