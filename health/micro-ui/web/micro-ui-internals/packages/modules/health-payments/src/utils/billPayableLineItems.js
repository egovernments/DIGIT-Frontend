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

export function applyPerDayToPayables(originalPayables, rates, days) {
  const d = Number(days) || 0;
  if (!Array.isArray(originalPayables)) return [];
  const rateByHead = rates || {};
  return originalPayables.map((item) => {
    if (item?.type !== "PAYABLE") {
      return item;
    }
    if (!Object.prototype.hasOwnProperty.call(rateByHead, item?.headCode)) {
      return item;
    }
    const perDay = Number(rateByHead[item.headCode]) || 0;
    return { ...item, amount: Math.round(perDay * d) };
  });
}
