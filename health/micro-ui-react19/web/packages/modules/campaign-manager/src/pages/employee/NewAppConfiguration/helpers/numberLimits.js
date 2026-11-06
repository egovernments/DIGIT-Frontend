/**
 * Limits a number property sets for itself in the master, through `min` and `max`
 * (e.g. a popup timer's minutes, 0 - 4).
 *
 * The panel keeps whatever is typed and shows the property's own `validationMessage`
 * while the entry is outside the limits, instead of rewriting it. Saving reports the
 * same message, so the value is never quietly corrected. Both the limits and the message
 * come from the master - the same pairing a group's validationExpression already uses.
 */
export const isOutsideLimits = (value, min, max) => {
  if (value === null || value === undefined || value === "") return false;
  const entered = Number(value);
  if (isNaN(entered)) return false;
  return (min !== undefined && entered < min) || (max !== undefined && entered > max);
};
