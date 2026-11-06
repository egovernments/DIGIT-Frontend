/**
 * Evaluates a group's validationExpression against a field.
 *
 * The side panel and the save check both use this, so a rule can never be shown in red in the
 * panel and then let through on save.
 *
 * Returns true when the rule holds, and also when any value it mentions is still blank - a
 * half-filled group is treated as "not ready yet" rather than wrong, the same way a range whose
 * maximum has not been typed yet does not complain.
 *
 * @param {Object} field - the field being edited
 * @param {string} expression - e.g. "range.min <= range.max" or
 *                              "popupTimer.minutes * 60 + popupTimer.seconds >= 30"
 * @returns {boolean} true if valid or not yet applicable
 */
export const evaluateGroupExpression = (field, expression) => {
  if (!expression) return true;

  try {
    // A plain copy: the stored field is frozen, and an expression reads straight off it
    const plainFieldCopy = structuredClone(field);

    const paths = expression.match(/[\w.]+/g)?.filter((part) => part.includes(".")) || [];
    const getNestedValue = (obj, path) => path.split(".").reduce((current, key) => current?.[key], obj);

    const allFieldsFilled = paths.every((path) => {
      const value = getNestedValue(plainFieldCopy, path);
      return value !== null && value !== undefined && value !== "";
    });
    if (!allFieldsFilled) return true;

    // The field's own keys become the function's parameters, so the expression can name them
    // directly. Dots are not valid in a parameter name, hence the swap.
    const paramNames = Object.keys(plainFieldCopy).map((key) => key.replace(/\./g, "_"));
    const paramValues = Object.values(plainFieldCopy);
    const evaluate = new Function(...paramNames, `return ${expression}`);
    return evaluate(...paramValues);
  } catch (error) {
    console.error("Validation expression error:", error);
    return true; // Never block on a broken expression
  }
};
