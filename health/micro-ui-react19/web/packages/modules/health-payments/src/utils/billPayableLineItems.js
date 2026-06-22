export const FEES_HEAD_CODE = "FEES";

const truncateToDecimals = (num, decimals = 2) => {
  if (!Number.isFinite(Number(num))) return 0;
  const factor = 10 ** decimals;
  return Math.trunc(Number(num) * factor) / factor;
};

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

// ---------------------------------------------------------------------------
// FEES (PERCENTAGE-type head) helpers
// ---------------------------------------------------------------------------

// Locate the fieldConfig entry that drives FEES. Per current contract the
// FEES entry has both fieldKey and headCode === "FEES".
export function getFeesFieldConfig(workerRatesData) {
  const fieldConfig = workerRatesData?.fieldConfig;
  if (!Array.isArray(fieldConfig)) return null;
  return (
    fieldConfig.find((f) => f?.headCode === FEES_HEAD_CODE) ||
    fieldConfig.find((f) => f?.percentageKey === FEES_HEAD_CODE) ||
    fieldConfig.find((f) => f?.fieldKey === FEES_HEAD_CODE) ||
    null
  );
}

// Resolve the headCodes that constitute the FEES base, by mapping each
// fieldKey in `percentageOf` through `headCodeMapping` (identity fallback).
export function getBaseHeadCodes(workerRatesData) {
  const feesCfg = getFeesFieldConfig(workerRatesData);
  if (!feesCfg) return [];
  const baseFields = Array.isArray(feesCfg.components)
    ? feesCfg.components
    : [];
  if (baseFields.length === 0) return [];
  const mapping = workerRatesData?.headCodeMapping || {};
  return baseFields
    .map((fieldKey) => mapping?.[fieldKey] || fieldKey)
    .filter(Boolean);
}

export function getFeesAmount(payableLineItems) {
  return getPayableAmount(payableLineItems, FEES_HEAD_CODE);
}

export function sumPayableForHeads(payableLineItems, headCodes) {
  if (!Array.isArray(payableLineItems) || !Array.isArray(headCodes) || headCodes.length === 0) {
    return 0;
  }
  const heads = new Set(headCodes);
  return payableLineItems
    .filter((p) => p?.type === "PAYABLE" && heads.has(p?.headCode))
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);
}

// Returns fees percent (1 decimal) or null when the base is 0
// or no FEES PAYABLE item is present.
export function computeFeePercent(payableLineItems, baseHeadCodes) {
  if (!Array.isArray(payableLineItems)) return null;
  if (!hasPayableHead(payableLineItems, FEES_HEAD_CODE)) return null;
  const base = sumPayableForHeads(payableLineItems, baseHeadCodes);
  if (!base) return null;
  const fees = getFeesAmount(payableLineItems);
  return Math.round(((fees / base) * 100) * 10) / 10;
}

// Returns a new payableLineItems array with the FEES PAYABLE entry's amount
// updated to base * percent / 100. If FEES is missing it is appended.
export function upsertFeesInPayables(payableLineItems, baseHeadCodes, percent) {
  const list = Array.isArray(payableLineItems) ? payableLineItems : [];
  const pct = Number(percent);
  if (!Number.isFinite(pct)) return list.slice();
  const base = sumPayableForHeads(list, baseHeadCodes);
  const feesAmount = truncateToDecimals((base * pct) / 100, 2);
  let found = false;
  const next = list.map((item) => {
    if (item?.type === "PAYABLE" && item?.headCode === FEES_HEAD_CODE) {
      found = true;
      return { ...item, amount: feesAmount };
    }
    return item;
  });
  if (!found) {
    next.push({ type: "PAYABLE", headCode: FEES_HEAD_CODE, amount: feesAmount });
  }
  return next;
}
