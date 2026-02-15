import {
  addField,
  deleteField,
  hideField,
  reorderFields,
  selectField,
  updateSelectedField,
  deselectField,
  addSection,
} from "../redux/remoteConfigSlice";
import { updateLocalizationEntry } from "../redux/localizationSlice";

// Actions forbidden on template screens
const TEMPLATE_FORBIDDEN_ACTIONS = new Set([
  "ADD_FIELD",
  "DELETE_FIELD",
  "ADD_SECTION",
  "REORDER_FIELDS",
  "UPDATE_FIELD_PROPERTY",
  "UPDATE_FIELD",
]);

// Formats that support isMdms (from panelConfig visibilityEnabledFor)
const MDMS_SUPPORTED_FORMATS = new Set([
  "dropdown",
  "idPopulator",
  "select",
  "radio",
  "searchableDropdown",
]);

/**
 * Builds a property configuration map from the panelConfig.
 * Returns:
 *   formatMap   – { propertyPath: Set<allowedFormats> }
 *   localisableProps – Set<propertyPath> whose values are localization codes
 */
function buildPropertyConfigFromPanel(panelConfig) {
  const formatMap = {};
  const localisableProps = new Set();

  const data = panelConfig?.data || panelConfig;
  if (!data) return { formatMap, localisableProps };

  const allEntries = [...(data.content || []), ...(data.validation || [])];

  for (const entry of allEntries) {
    const formats = (entry.visibilityEnabledFor || []).filter((f) => f !== "");
    if (formats.length === 0) continue;
    const formatSet = new Set(formats);

    const bindTo = entry.bindTo;

    // Map the main bindTo
    if (bindTo) {
      formatMap[bindTo] = formatSet;

      // Determine localisability of the main property
      if (entry.fieldType === "text" || entry.fieldType === "textarea") {
        if (entry.isLocalisable !== false) localisableProps.add(bindTo);
      } else if (entry.fieldType === "toggle" && entry.showFieldOnToggle && entry.conditionalField?.length > 0) {
        // Toggle with conditional text/textarea that shares the same bindTo → localisable
        const sameBind = entry.conditionalField.find((cf) => cf.bindTo === bindTo);
        if (sameBind && (sameBind.type === "text" || sameBind.type === "textarea") && sameBind.isLocalisable !== false) {
          localisableProps.add(bindTo);
        }
      }
    }

    // Group children (range, lengthRange, ageRange, dateRange, etc.)
    if (entry.children) {
      for (const child of entry.children) {
        if (child.bindTo) {
          formatMap[child.bindTo] = formatSet;
          if (child.isLocalisable === true || (child.fieldType === "text" && child.isLocalisable !== false)) {
            localisableProps.add(child.bindTo);
          }
        }
      }
    }

    // Conditional fields with DIFFERENT bindTo (e.g. required → required.message)
    if (entry.conditionalField) {
      for (const cf of entry.conditionalField) {
        if (cf.bindTo && cf.bindTo !== bindTo) {
          formatMap[cf.bindTo] = formatSet;
          if ((cf.type === "text" || cf.type === "textarea") && cf.isLocalisable !== false) {
            localisableProps.add(cf.bindTo);
          }
        }
      }
    }
  }

  return { formatMap, localisableProps };
}

/**
 * Validates that each property being set is available for the field's format.
 * Uses the panelConfig's visibilityEnabledFor to determine availability.
 */
function validatePropertyFormats(properties, fieldFormat, formatMap) {
  const invalidProps = [];

  for (const key of Object.keys(properties)) {
    const allowedFormats = formatMap[key];
    // Only reject if the property IS in the formatMap but the format is NOT in its set
    if (allowedFormats && allowedFormats.size > 0 && !allowedFormats.has(fieldFormat)) {
      invalidProps.push(key);
    }
  }

  if (invalidProps.length > 0) {
    throw new Error(
      `The following properties are not configurable for "${fieldFormat}" format fields: ${invalidProps.join(", ")}. ` +
      `Check the Properties Reference for available properties per field format.`
    );
  }
}

/**
 * Validates that localisable properties have matching UPDATE_LOCALIZATION actions.
 * Localisable properties store localization codes as values and need display text.
 */
function validateLocalisableProps(properties, allActions, fieldName, localisableProps) {
  if (!allActions || localisableProps.size === 0) return;

  const missingLocalizations = [];

  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === "string" && value.trim() !== "" && localisableProps.has(key)) {
      const hasLocalization = allActions.some(
        (a) => a.type === "UPDATE_LOCALIZATION" && a.payload?.code === value
      );
      if (!hasLocalization) {
        missingLocalizations.push({ property: key, code: value });
      }
    }
  }

  if (missingLocalizations.length > 0) {
    const details = missingLocalizations
      .map((m) => `"${m.property}" (code: "${m.code}")`)
      .join(", ");
    throw new Error(
      `Field "${fieldName}" has localisable properties missing UPDATE_LOCALIZATION actions: ${details}. ` +
      `Each localisable property value is a localization code and needs a corresponding ` +
      `UPDATE_LOCALIZATION action with { code, locale: "en_IN", message: "Display Text" }.`
    );
  }
}

/**
 * Executes an array of AI-proposed actions by dispatching to Redux.
 * Validates payloads and enforces page-type restrictions before dispatching.
 * Returns { success, results } with per-action outcomes.
 */
export function executeActions(actions, dispatch, getState) {
  const results = [];

  for (const action of actions) {
    try {
      // Page-type enforcement
      const pageType = getState()?.remoteConfig?.currentData?.type;
      if (pageType === "template" && TEMPLATE_FORBIDDEN_ACTIONS.has(action.type)) {
        throw new Error(
          `Action "${action.type}" is not allowed on template screens. Only HIDE_FIELD and UPDATE_LOCALIZATION are permitted.`
        );
      }

      const result = executeSingleAction(action, dispatch, getState, actions);
      results.push({ type: action.type, success: true, ...result });
    } catch (error) {
      results.push({ type: action.type, success: false, error: error.message });
    }
  }

  const success = results.every((r) => r.success);
  return { success, results };
}

function executeSingleAction(action, dispatch, getState, allActions) {
  const { type, payload } = action;

  switch (type) {
    case "ADD_FIELD":
      return handleAddField(payload, dispatch, getState, allActions);
    case "UPDATE_FIELD":
      return handleUpdateField(payload, dispatch, getState);
    case "DELETE_FIELD":
      return handleDeleteField(payload, dispatch, getState);
    case "HIDE_FIELD":
      return handleHideField(payload, dispatch);
    case "REORDER_FIELDS":
      return handleReorderFields(payload, dispatch);
    case "UPDATE_LOCALIZATION":
      return handleUpdateLocalization(payload, dispatch);
    case "ADD_SECTION":
      return handleAddSection(dispatch);
    case "UPDATE_FIELD_PROPERTY":
      return handleUpdateFieldProperty(payload, dispatch, getState, allActions);
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

function handleAddField(payload, dispatch, getState, allActions) {
  const { cardIndex, fieldData } = payload;
  if (cardIndex === undefined || cardIndex === null) {
    throw new Error("ADD_FIELD requires cardIndex");
  }
  if (!fieldData || !fieldData.fieldName) {
    throw new Error("ADD_FIELD requires fieldData with at least a fieldName");
  }

  const state = getState();
  const body = state.remoteConfig?.currentData?.body;
  if (!body || !body[cardIndex]) {
    throw new Error(`Card at index ${cardIndex} does not exist`);
  }

  // Validate localisable properties in fieldData have matching UPDATE_LOCALIZATION
  if (allActions) {
    const panelConfig = state.fieldPanelMaster?.byName?.drawerPanelConfig;
    if (panelConfig) {
      const { localisableProps } = buildPropertyConfigFromPanel(panelConfig);
      validateLocalisableProps(fieldData, allActions, fieldData.fieldName, localisableProps);
    }

    // Also validate dropDownOptions localization
    if (fieldData.dropDownOptions && Array.isArray(fieldData.dropDownOptions)) {
      validateDropdownOptionsLocalization(fieldData.dropDownOptions, allActions, fieldData.fieldName);
    }
  }

  dispatch(addField({ cardIndex, fieldData }));
  return { detail: `Added field "${fieldData.fieldName}" to section ${cardIndex}` };
}

function handleUpdateField(payload, dispatch, getState) {
  const { fieldName, updates } = payload;
  if (!fieldName) throw new Error("UPDATE_FIELD requires fieldName");
  if (!updates || Object.keys(updates).length === 0) throw new Error("UPDATE_FIELD requires non-empty updates");

  const state = getState();
  const currentData = state.remoteConfig?.currentData;
  if (!currentData) throw new Error("No current configuration loaded");

  // Find the field in body or footer
  let foundField = null;
  let foundCardIndex = null;

  if (currentData.body && Array.isArray(currentData.body)) {
    for (let ci = 0; ci < currentData.body.length; ci++) {
      const card = currentData.body[ci];
      if (card.fields && Array.isArray(card.fields)) {
        const field = card.fields.find((f) => f.fieldName === fieldName);
        if (field) {
          foundField = field;
          foundCardIndex = ci;
          break;
        }
      }
    }
  }

  if (!foundField && currentData.footer && Array.isArray(currentData.footer)) {
    const field = currentData.footer.find((f) => f.fieldName === fieldName);
    if (field) {
      foundField = field;
      foundCardIndex = -1;
    }
  }

  if (!foundField) {
    throw new Error(`Field "${fieldName}" not found in current configuration`);
  }

  // Select -> update -> deselect
  dispatch(selectField({ field: foundField, screen: null, card: null, cardIndex: foundCardIndex }));
  dispatch(updateSelectedField(updates));
  dispatch(deselectField());

  return { detail: `Updated field "${fieldName}" with ${Object.keys(updates).join(", ")}` };
}

function handleDeleteField(payload, dispatch, getState) {
  const { fieldName, cardIndex } = payload;
  if (!fieldName) throw new Error("DELETE_FIELD requires fieldName");

  const state = getState();
  const currentData = state.remoteConfig?.currentData;
  if (!currentData) throw new Error("No current configuration loaded");

  let fieldIndex = -1;
  const resolvedCardIndex = cardIndex !== undefined ? cardIndex : null;

  if (resolvedCardIndex === -1) {
    // Footer field
    if (currentData.footer && Array.isArray(currentData.footer)) {
      fieldIndex = currentData.footer.findIndex((f) => f.fieldName === fieldName);
    }
  } else if (resolvedCardIndex !== null) {
    // Specific card
    const card = currentData.body?.[resolvedCardIndex];
    if (card?.fields) {
      fieldIndex = card.fields.findIndex((f) => f.fieldName === fieldName);
    }
  } else {
    // Search all cards
    if (currentData.body) {
      for (let ci = 0; ci < currentData.body.length; ci++) {
        const card = currentData.body[ci];
        if (card.fields) {
          const idx = card.fields.findIndex((f) => f.fieldName === fieldName);
          if (idx >= 0) {
            fieldIndex = idx;
            payload.cardIndex = ci;
            break;
          }
        }
      }
    }
  }

  if (fieldIndex < 0) {
    throw new Error(`Field "${fieldName}" not found`);
  }

  dispatch(deleteField({ fieldIndex, cardIndex: payload.cardIndex ?? resolvedCardIndex }));
  return { detail: `Deleted field "${fieldName}"` };
}

function handleHideField(payload, dispatch) {
  const { fieldName, cardIndex } = payload;
  if (!fieldName) throw new Error("HIDE_FIELD requires fieldName");
  if (cardIndex === undefined || cardIndex === null) throw new Error("HIDE_FIELD requires cardIndex");

  dispatch(hideField({ fieldName, cardIndex }));
  return { detail: `Toggled visibility of "${fieldName}"` };
}

function handleReorderFields(payload, dispatch) {
  const { cardIndex, fromIndex, toIndex } = payload;
  if (cardIndex === undefined) throw new Error("REORDER_FIELDS requires cardIndex");
  if (fromIndex === undefined || toIndex === undefined) throw new Error("REORDER_FIELDS requires fromIndex and toIndex");

  dispatch(reorderFields({ cardIndex, fromIndex, toIndex }));
  return { detail: `Moved field from position ${fromIndex} to ${toIndex} in section ${cardIndex}` };
}

function handleUpdateLocalization(payload, dispatch) {
  const { code, locale, message } = payload;
  if (!code || (typeof code === "string" && code.trim() === "")) {
    throw new Error("UPDATE_LOCALIZATION requires a non-empty code");
  }
  if (typeof message !== "string") {
    throw new Error("UPDATE_LOCALIZATION requires message (string)");
  }
  if (!locale || (typeof locale === "string" && locale.trim() === "")) {
    throw new Error("UPDATE_LOCALIZATION requires locale (e.g. 'en_IN')");
  }

  dispatch(updateLocalizationEntry({ code, locale, message }));
  return { detail: `Set localization "${code}" = "${message}" (${locale})` };
}

function handleAddSection(dispatch) {
  dispatch(addSection());
  return { detail: "Added new section" };
}

/**
 * Expands dot-notation flat properties into a nested object.
 * e.g. { "range.min": 5, "range.max": 100 } → { range: { min: 5, max: 100 } }
 * Preserves existing sibling values from the field.
 */
function expandDotNotation(flatProps, existingField) {
  const result = {};

  for (const [key, value] of Object.entries(flatProps)) {
    const parts = key.split(".");
    if (parts.length === 1) {
      // Simple top-level property
      result[key] = value;
    } else {
      // Nested property - expand dot notation
      const root = parts[0];
      const rest = parts.slice(1).join(".");

      if (!result[root]) {
        // Preserve existing values from the field for this root key
        const existingValue = existingField?.[root];
        if (existingValue && typeof existingValue === "object" && !Array.isArray(existingValue)) {
          result[root] = { ...existingValue };
        } else {
          result[root] = {};
        }
      }

      // Set the nested value
      setNestedValue(result[root], rest, value);
    }
  }

  return result;
}

/**
 * Sets a value at a dot-notation path within an object.
 */
function setNestedValue(obj, path, value) {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== "object") {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * Validates isMdms property usage.
 * - isMdms is only valid for MDMS_SUPPORTED_FORMATS
 * - When isMdms=true, schemaCode must also be provided
 * - When isMdms=false (or not set), dropDownOptions can be used instead
 */
function validateIsMdmsProperty(properties, foundField) {
  const fieldFormat = foundField?.format;
  const hasIsMdms = properties.isMdms !== undefined;

  if (hasIsMdms) {
    // Only allow isMdms for supported field formats
    if (!MDMS_SUPPORTED_FORMATS.has(fieldFormat)) {
      throw new Error(
        `isMdms is not supported for format "${fieldFormat}". Supported formats: ${[...MDMS_SUPPORTED_FORMATS].join(", ")}`
      );
    }

    if (properties.isMdms === true) {
      // When enabling isMdms, schemaCode is required
      if (!properties.schemaCode && !foundField?.schemaCode) {
        throw new Error(
          'When isMdms is true, schemaCode must be provided (e.g. "common-masters.GenderType")'
        );
      }
    }
  }

  // Validate schemaCode alone (without isMdms) - field must support it
  if (properties.schemaCode !== undefined && !hasIsMdms) {
    if (!MDMS_SUPPORTED_FORMATS.has(fieldFormat)) {
      throw new Error(
        `schemaCode is not supported for format "${fieldFormat}". Supported formats: ${[...MDMS_SUPPORTED_FORMATS].join(", ")}`
      );
    }
  }
}

/**
 * Validates range properties (min <= max).
 */
function validateRangeProperties(properties) {
  const rangeMin = properties["range.min"];
  const rangeMax = properties["range.max"];
  if (rangeMin !== undefined && rangeMax !== undefined) {
    if (Number(rangeMin) > Number(rangeMax)) {
      throw new Error(`range.min (${rangeMin}) must be less than or equal to range.max (${rangeMax})`);
    }
  }

  const lengthMin = properties["lengthRange.minLength"];
  const lengthMax = properties["lengthRange.maxLength"];
  if (lengthMin !== undefined && lengthMax !== undefined) {
    if (Number(lengthMin) > Number(lengthMax)) {
      throw new Error(`lengthRange.minLength (${lengthMin}) must be less than or equal to lengthRange.maxLength (${lengthMax})`);
    }
  }

  const ageMin = properties["ageRange.minAge"];
  const ageMax = properties["ageRange.maxAge"];
  if (ageMin !== undefined && ageMax !== undefined) {
    if (Number(ageMin) > Number(ageMax)) {
      throw new Error(`ageRange.minAge (${ageMin}) must be less than or equal to ageRange.maxAge (${ageMax})`);
    }
  }

  // prefixText max 5 chars
  if (properties.prefixText && typeof properties.prefixText === "string" && properties.prefixText.length > 5) {
    throw new Error(`prefixText must be at most 5 characters (got ${properties.prefixText.length})`);
  }

  // suffixText max 5 chars
  if (properties.suffixText && typeof properties.suffixText === "string" && properties.suffixText.length > 5) {
    throw new Error(`suffixText must be at most 5 characters (got ${properties.suffixText.length})`);
  }
}

/**
 * Validates dropdown options when isMdms is false on a dropdown-type field.
 * Mirrors AppConfigurationWrapper's dropDownOptions validation.
 */
function validateDropdownOptions(properties, foundField) {
  const fieldFormat = foundField?.format;
  if (!MDMS_SUPPORTED_FORMATS.has(fieldFormat)) return;

  // Determine effective isMdms: check properties first, then existing field
  const effectiveIsMdms = properties.isMdms !== undefined ? properties.isMdms : foundField?.isMdms;

  if (effectiveIsMdms === false) {
    const options = properties.dropDownOptions || foundField?.dropDownOptions;
    if (!options || !Array.isArray(options) || options.length === 0) {
      throw new Error(
        `When isMdms is false on a ${fieldFormat} field, dropDownOptions must be a non-empty array`
      );
    }
    for (let i = 0; i < options.length; i++) {
      if (!options[i]?.name || (typeof options[i].name === "string" && options[i].name.trim() === "")) {
        throw new Error(
          `dropDownOptions[${i}] must have a non-empty "name" (localization code)`
        );
      }
    }
  }
}

/**
 * Validates that dropDownOptions have matching UPDATE_LOCALIZATION actions for each option's name code.
 * Throws an error (not just a warning) so the AI is forced to include localization actions.
 */
function validateDropdownOptionsLocalization(options, allActions, fieldName) {
  const missingCodes = [];
  for (const opt of options) {
    if (opt?.name && typeof opt.name === "string" && opt.name.trim() !== "") {
      const hasLocalization = allActions.some(
        (a) => a.type === "UPDATE_LOCALIZATION" && a.payload?.code === opt.name
      );
      if (!hasLocalization) {
        missingCodes.push(opt.name);
      }
    }
  }
  if (missingCodes.length > 0) {
    throw new Error(
      `Field "${fieldName}" has dropDownOptions with localization codes that are missing UPDATE_LOCALIZATION actions: ${missingCodes.join(", ")}. ` +
      `Each option's "name" is a localization code and needs a corresponding UPDATE_LOCALIZATION action with { code, locale: "en_IN", message: "Display Text" }.`
    );
  }
}

/**
 * Handles UPDATE_FIELD_PROPERTY action.
 * Uses the same selectField → updateSelectedField → deselectField flow as manual editing.
 * Validates isMdms, range, dropdown options, and other property constraints before applying.
 */
function handleUpdateFieldProperty(payload, dispatch, getState, allActions) {
  const { fieldName, properties } = payload;
  if (!fieldName) throw new Error("UPDATE_FIELD_PROPERTY requires fieldName");
  if (!properties || Object.keys(properties).length === 0) {
    throw new Error("UPDATE_FIELD_PROPERTY requires non-empty properties");
  }

  // Block display logic / conditional visibility — must be configured via Logic Tab
  const blockedKeys = Object.keys(properties).filter(
    (k) => k === "visibilityCondition" || k.startsWith("visibilityCondition.")
  );
  if (blockedKeys.length > 0) {
    throw new Error(
      `Display logic (${blockedKeys.join(", ")}) cannot be configured through the AI assistant. ` +
      `Please select the field and use the Display Logic property in the Logic Tab of the property drawer.`
    );
  }

  const state = getState();
  const currentData = state.remoteConfig?.currentData;
  if (!currentData) throw new Error("No current configuration loaded");

  // Find the field in body or footer
  let foundField = null;
  let foundCardIndex = null;

  if (currentData.body && Array.isArray(currentData.body)) {
    for (let ci = 0; ci < currentData.body.length; ci++) {
      const card = currentData.body[ci];
      if (card.fields && Array.isArray(card.fields)) {
        const field = card.fields.find((f) => f.fieldName === fieldName);
        if (field) {
          foundField = field;
          foundCardIndex = ci;
          break;
        }
      }
    }
  }

  if (!foundField && currentData.footer && Array.isArray(currentData.footer)) {
    const field = currentData.footer.find((f) => f.fieldName === fieldName);
    if (field) {
      foundField = field;
      foundCardIndex = -1;
    }
  }

  if (!foundField) {
    throw new Error(`Field "${fieldName}" not found in current configuration`);
  }

  // Validate property availability for this field's format using panelConfig
  const panelConfig = state.fieldPanelMaster?.byName?.drawerPanelConfig;
  if (panelConfig) {
    const { formatMap, localisableProps } = buildPropertyConfigFromPanel(panelConfig);

    // Check each property is valid for this field format
    validatePropertyFormats(properties, foundField.format, formatMap);

    // Check localisable properties have matching UPDATE_LOCALIZATION actions
    if (allActions) {
      validateLocalisableProps(properties, allActions, fieldName, localisableProps);
    }
  }

  // Validate isMdms usage against field format
  validateIsMdmsProperty(properties, foundField);

  // Validate range and other constraints
  validateRangeProperties(properties);

  // Validate dropdown options when isMdms=false
  validateDropdownOptions(properties, foundField);

  // Warn if dropDownOptions are set without matching UPDATE_LOCALIZATION for each option
  if (allActions && properties.dropDownOptions && Array.isArray(properties.dropDownOptions)) {
    validateDropdownOptionsLocalization(properties.dropDownOptions, allActions, fieldName);
  }

  // Expand dot-notation properties into nested objects, preserving existing values
  const mergedUpdates = expandDotNotation(properties, foundField);

  // Select → update → deselect (same path as manual drawer editing)
  dispatch(selectField({ field: foundField, screen: null, card: null, cardIndex: foundCardIndex }));
  dispatch(updateSelectedField(mergedUpdates));
  dispatch(deselectField());

  const propKeys = Object.keys(properties).join(", ");
  return { detail: `Updated properties of "${fieldName}": ${propKeys}` };
}
