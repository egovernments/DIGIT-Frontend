/**
 * Helper for scoping drawer panel properties to individual fields
 */

/**
 * Whether a panel property applies to the given field.
 *
 * Properties are normally scoped by field type, so every field of that type shows the same set.
 * These two optional lists narrow that further, by field name:
 *
 *   visibilityEnabledForFields  - show only for the fields listed
 *   visibilityDisabledForFields - show for every field except the ones listed
 *
 * A property that uses neither is not narrowed, so existing configuration is unaffected.
 *
 * @param {Object} panelItem - the panel property being checked
 * @param {string} fieldName - name of the field the property would be shown for
 * @returns {boolean} false only when the property's lists exclude this field
 */
export const isPanelItemEnabledForField = (panelItem, fieldName) => {
  const enabledFields = panelItem?.visibilityEnabledForFields;
  if (Array.isArray(enabledFields) && enabledFields.length > 0 && !enabledFields.includes(fieldName)) {
    return false;
  }

  const disabledFields = panelItem?.visibilityDisabledForFields;
  if (Array.isArray(disabledFields) && disabledFields.includes(fieldName)) {
    return false;
  }

  return true;
};
