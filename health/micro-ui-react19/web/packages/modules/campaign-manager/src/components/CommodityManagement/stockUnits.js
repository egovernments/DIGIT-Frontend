// Stock quantities are recorded in pieces; each bale holds UNITS_PER_BALE pieces.
// The bale equivalent is display-only on the dashboard tables (never in Excel exports)
// and is sent as the `balesQuantity` additional field on stock create.
export const UNITS_PER_BALE = 50;

export const QUANTITY_IN_BALES_KEY = "quantityInBales";

// Pieces → bales, rounded to 2 decimals (e.g. 15 → 0.3)
export const toBales = (pieces) => Number(((Number(pieces) || 0) / UNITS_PER_BALE).toFixed(2));

export const formatBales = (pieces) =>
  toBales(pieces).toLocaleString(undefined, { maximumFractionDigits: 2 });

// Table column shown next to Quantity; render it with formatBales(row.quantity)
export const getQuantityInBalesColumn = (t) => ({
  label: t("HCM_QUANTITY_IN_BALES"),
  key: QUANTITY_IN_BALES_KEY,
  grow: 0.6,
  minWidth: "120px",
  sortable: false,
});

// Drop the UI-only bales column before exporting
export const withoutBalesColumn = (columns) => columns.filter((col) => col.key !== QUANTITY_IN_BALES_KEY);
