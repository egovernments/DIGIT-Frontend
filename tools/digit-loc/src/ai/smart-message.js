/**
 * Smart Message Generator (Tier 1 — rule-based, no external deps)
 *
 * Generates human-readable localization messages from key codes using:
 * - Domain word dictionary (168+ health campaign terms)
 * - Field label mappings (90+ common field names)
 * - Context-aware message patterns (validation, button, label, etc.)
 *
 * Reuses proven logic from form-config-corrector/corrector-engine.js
 */

"use strict";

// Domain-specific words sorted longest-first for greedy matching.
const DOMAIN_WORDS = [
  "ACKNOWLEDGEMENT", "RECONCILIATION", "REGISTRATION", "CONFIGURATION",
  "BENEFICIARY", "COMMUNITY", "COMPLAINTS", "COMPLAINT", "CHECKLIST",
  "DASHBOARD", "HOUSEHOLD", "INVENTORY", "INDIVIDUAL", "NAVIGATION",
  "PERMISSION", "SELECTION", "SETTLEMENT", "TRANSPORT", "WAREHOUSE",
  "ATTENDANCE", "CAMPAIGN", "CATEGORY", "COMMENTS", "DELIVERY",
  "DETAILS", "DAMAGED", "EXPIRY", "FACILITY", "HANDLER", "LOCATION",
  "MULTIPLE", "OVERVIEW", "PREVIEW", "PRODUCTS", "PRODUCT", "QUANTITY",
  "RECEIVE", "REPORTS", "REQUIRED", "SCANNER", "SUCCESS", "VEHICLE",
  "ACTIONS", "BUTTON", "CANCEL", "CLOSE", "COORD", "CREATE", "DELETE",
  "ENTER", "FIELD", "GENDER", "MANAGE", "MEMBER", "NUMBER", "RECORD",
  "REPORT", "RETURN", "SCREEN", "SEARCH", "SELECT", "STOCK", "SUBMIT",
  "BATCH", "DATE", "EDIT", "FLOW", "FORM", "HEAD", "HOME", "ITEM",
  "LIST", "LOST", "MARK", "NAME", "NEXT", "OPEN", "PAGE", "SCAN",
  "SENT", "TEAM", "TEXT", "TYPE", "UNABLE", "VIEW", "AREA", "BACK",
  "CARD", "CODE", "DONE", "FROM", "HELP", "INFO", "LATLNG", "PANEL",
  "SAVE", "WHICH", "ADD", "AGE", "NEW", "QR", "TO",
  "MONITORING", "MONITOR", "SURVEYOR", "SURVEY", "CLUSTER", "LOT",
  "CHILDREN", "VACCINATED", "REFUSAL", "ABSENCE", "CAREGIVER",
  "AWARENESS", "DESIGNATION", "COVERED", "FINGER", "MARKED", "DOSES",
  "REASON", "SPECIFY", "INFORMED", "MISSED", "ASLEEP", "ROUTINE",
  "POORLY", "FINAL", "COUNT", "CASE", "VISITED", "REVISITED",
  "PRESENT", "PHYSICAL", "CALCULATED", "EXCESS", "ISSUED", "RETURNED",
  "RECEIVED", "WAYBILL", "ENTRY", "MRN", "TOTAL", "MEMBERS", "LABEL",
  "STATUS", "DESCRIPTION", "CONTACT", "INBOX", "COMPLAINANT",
  "REFERRAL", "SYMPTOM", "ERROR", "MOBILE", "HEADER", "TABLE",
  "PLACEHOLDER", "VALIDATION", "MESSAGE", "TITLE", "HEADING",
].sort((a, b) => b.length - a.length);

const SMALL_WORDS = new Set([
  "a", "an", "the", "to", "of", "in", "for", "and", "or", "but", "is", "at", "by", "on",
]);

// Known field name -> readable label mappings.
const FIELD_LABEL_MAP = {
  latLng: "GPS Coordinates", latlng: "GPS Coordinates", dob: "Date of Birth",
  dateOfBirth: "Date of Birth", qrCode: "QR Code", scanner: "Scan Code",
  id: "ID", uuid: "UUID", otp: "OTP", givenName: "Given Name",
  nameOfIndividual: "Name of Individual", isHeadOfFamily: "Head of Family",
  memberCount: "Member Count", proximityRadius: "Proximity Radius",
  selectedStatus: "Selected Status", cancelFilter: "Cancel Filter",
  filterSubmit: "Apply Filter", memberCard: "Member Card",
  detailsRow: "Details Row", headOfHouseholdName: "Head of Household",
  householdId: "Household ID", clientReferenceId: "Reference ID",
  editHouseholdRow: "Edit Household", editIndividual: "Edit Individual",
  labelFieldPair: "Label Field Pair", detailsView: "Details",
  viewDetails: "View Details", addMemberButton: "Add Member",
  viewHouseholdButton: "View Household", goBack: "Go Back",
  deliveryButton: "Deliver", deliveryStatusTable: "Delivery Status",
  facilityId: "Facility ID", tenantId: "Tenant ID",
  projectId: "Project ID", productVariantId: "Product Variant ID",
  additionalFields: "Additional Fields", transactionType: "Transaction Type",
  dateOfEntry: "Date of Entry", dateOfReconciliation: "Date of Reconciliation",
  wayBillNumber: "Waybill Number", mrnNumber: "MRN Number",
  batchNumber: "Batch Number", stockExpiry: "Stock Expiry",
  quantityReceived: "Quantity Received", applicationStatus: "Application Status",
  serviceRequestId: "Service Request ID", serviceCode: "Service Code",
  mobileNumber: "Mobile Number", dateOfRegistration: "Date of Registration",
  firstName: "First Name", lastName: "Last Name", middleName: "Middle Name",
  fullName: "Full Name", emailAddress: "Email Address",
  phoneNumber: "Phone Number", postalCode: "Postal Code",
  streetAddress: "Street Address",
};

// Module prefix patterns to strip when generating messages.
const MODULE_PREFIXES = [
  "HCM_", "DIGIT_", "APPONE_", "APP_CONFIG_", "CLF_", "COMMON_",
];

// Suffix patterns that indicate the field type.
const FIELD_TYPE_SUFFIXES = [
  { suffix: "_SECONDARY_ACTION_LABEL", type: "secondaryAction" },
  { suffix: "_PRIMARY_ACTION_LABEL", type: "primaryAction" },
  { suffix: "_ERROR_MESSAGE", type: "errorMessage" },
  { suffix: "_EXPAND_LABEL", type: "expandLabel" },
  { suffix: "_COLLAPSE_LABEL", type: "collapseLabel" },
  { suffix: "_ACTION_LABEL", type: "actionLabel" },
  { suffix: "_INNER_LABEL", type: "innerLabel" },
  { suffix: "_FIELD_NAME", type: "fieldName" },
  { suffix: "_DESCRIPTION", type: "description" },
  { suffix: "_PLACEHOLDER", type: "placeholder" },
  { suffix: "_HELP_TEXT", type: "helpText" },
  { suffix: "_INFO_TEXT", type: "infoText" },
  { suffix: "_HEADING", type: "heading" },
  { suffix: "_MESSAGE", type: "message" },
  { suffix: "_TOOLTIP", type: "tooltip" },
  { suffix: "_HEADER", type: "header" },
  { suffix: "_LABEL", type: "label" },
  { suffix: "_TITLE", type: "title" },
  { suffix: "_ERROR", type: "error" },
  { suffix: "_BTN", type: "button" },
  { suffix: "_BUTTON", type: "button" },
];

/**
 * Split a compound uppercase word using the domain dictionary.
 * e.g., "HOUSEHOLDMEMBERS" -> "Household Members"
 */
function splitCompound(word) {
  const upper = word.toUpperCase();
  let rem = upper;
  const parts = [];
  while (rem.length > 0) {
    let found = false;
    for (const dw of DOMAIN_WORDS) {
      if (rem.startsWith(dw)) {
        parts.push(dw);
        rem = rem.substring(dw.length);
        found = true;
        break;
      }
    }
    if (!found) {
      parts.push(rem);
      break;
    }
  }
  return parts.map((p, i) => {
    const l = p.toLowerCase();
    return (i > 0 && SMALL_WORDS.has(l)) ? l : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }).join(" ");
}

/**
 * Convert any string to a human-readable form.
 * Handles camelCase, UPPER_CASE, and compound words.
 */
function humanize(str) {
  if (!str) return "";
  // camelCase -> "Camel Case"
  if (/[a-z]/.test(str) && /[A-Z]/.test(str)) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase());
  }
  // ALLCAPS -> split using domain dictionary
  if (/^[A-Z0-9]+$/.test(str)) return splitCompound(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a camelCase field name to a human-readable label.
 * Uses the FIELD_LABEL_MAP for known mappings, falls back to splitting.
 */
function humanizeField(fieldName) {
  if (!fieldName) return null;
  if (FIELD_LABEL_MAP[fieldName]) return FIELD_LABEL_MAP[fieldName];
  return fieldName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * Generate a human-readable message from a localization code.
 *
 * @param {string} code - Localization code (e.g., "HCM_CAMPAIGN_SAVE_BUTTON")
 * @param {string} [moduleName] - Module name for prefix stripping
 * @returns {string} Human-readable message
 */
function smartMessageFromCode(code, moduleName) {
  if (!code) return code;
  let c = code;

  // Strip module-specific prefix
  if (moduleName) {
    const pfx = moduleName.toUpperCase().replace(/-/g, "_") + "_";
    if (c.startsWith(pfx)) c = c.substring(pfx.length);
  }

  // Strip common prefixes
  for (const pfx of MODULE_PREFIXES) {
    if (c.startsWith(pfx)) {
      c = c.substring(pfx.length);
      break;
    }
  }

  // Strip after a second module-level prefix (e.g., HCM_CAMPAIGN_ -> strip CAMPAIGN_)
  const secondPrefixMatch = c.match(/^([A-Z]+)_(.+)$/);
  if (secondPrefixMatch) {
    const possiblePrefix = secondPrefixMatch[1];
    // Only strip if it looks like a module name (not a meaningful word)
    const isModuleName = ["CAMPAIGN", "STOCK", "ATTENDANCE", "COMPLAINTS", "PGR"].includes(possiblePrefix);
    if (isModuleName) {
      c = secondPrefixMatch[2];
    }
  }

  // Strip type suffixes
  let detectedType = null;
  for (const { suffix, type } of FIELD_TYPE_SUFFIXES) {
    if (c.endsWith(suffix)) {
      c = c.substring(0, c.length - suffix.length);
      detectedType = type;
      break;
    }
  }

  // Split remaining words and humanize
  const words = c.split("_").filter(Boolean).map((s) => splitCompound(s)).join(" ");

  // Apply type-specific formatting
  if (detectedType === "placeholder" || detectedType === "helpText") {
    return `Enter the ${words.toLowerCase()}`;
  }
  if (detectedType === "errorMessage" || detectedType === "error") {
    if (/REQUIRED/i.test(code)) return `${words} is required`;
    return `${words} validation error`;
  }
  if (detectedType === "expandLabel") return "Show More";
  if (detectedType === "collapseLabel") return "Show Less";

  return words;
}

/**
 * Generate a context-aware smart message.
 *
 * @param {string} code - Localization code
 * @param {object} [context] - Additional context
 * @param {string} [context.fieldType] - Field type (label, heading, etc.)
 * @param {string} [context.fieldName] - camelCase field name
 * @param {string} [context.pageName] - Page/screen name
 * @param {string} [context.moduleName] - Module name
 * @returns {string} Generated message
 */
function generateSmartMessage(code, context = {}) {
  const { fieldType, fieldName, pageName, moduleName } = context;

  // Use field name label mapping if available
  const fieldLabel = fieldName ? humanizeField(fieldName) : null;
  const isSuccess = pageName && /success/i.test(pageName);

  switch (fieldType) {
    case "primaryActionLabel":
    case "actionLabel":
      return isSuccess ? "Back to Home" : "Submit";
    case "secondaryActionLabel":
      return isSuccess ? "Back to Home" : "Back";
    case "heading":
    case "title":
      return isSuccess ? "Success" : smartMessageFromCode(code, moduleName);
    case "description":
      return isSuccess ? "Your action has been completed successfully." : smartMessageFromCode(code, moduleName);
    case "label":
      return fieldLabel || smartMessageFromCode(code, moduleName);
    case "helpText":
    case "infoText":
    case "placeholder":
      return fieldLabel
        ? `Enter the ${fieldLabel.toLowerCase()}`
        : smartMessageFromCode(code, moduleName);
    case "expandLabel":
      return "Show More";
    case "collapseLabel":
      return "Show Less";
    case "tooltip":
      return smartMessageFromCode(code, moduleName);
    case "errorMessage":
    case "error":
      if (/REQUIRED/i.test(code)) return `${fieldLabel || smartMessageFromCode(code, moduleName)} is required`;
      if (/MIN/i.test(code)) return `${fieldLabel || smartMessageFromCode(code, moduleName)} is too short`;
      if (/MAX/i.test(code)) return `${fieldLabel || smartMessageFromCode(code, moduleName)} exceeds maximum length`;
      return smartMessageFromCode(code, moduleName);
    default:
      return smartMessageFromCode(code, moduleName);
  }
}

/**
 * Generate validation-specific error messages.
 */
function generateValidationMessage(fieldName, validationType, label) {
  const fieldLabel = label || fieldName || "Field";
  const readable = smartMessageFromCode(fieldLabel);
  switch (validationType) {
    case "required": return `${readable} is required`;
    case "min": return `${readable} must meet the minimum value`;
    case "max": return `${readable} exceeds the maximum value`;
    case "minLength": return `${readable} is too short`;
    case "maxLength": return `${readable} is too long`;
    case "pattern":
    case "regex": return `${readable} has an invalid format`;
    default: return `${readable} validation error`;
  }
}

/**
 * Batch-generate smart messages for an array of codes.
 *
 * @param {Array<{code, context?}>} codes - Array of code objects
 * @returns {Array<{code, message}>} Array with generated messages
 */
function batchGenerateMessages(codes) {
  return codes.map(({ code, context }) => ({
    code,
    message: generateSmartMessage(code, context || {}),
  }));
}

module.exports = {
  smartMessageFromCode,
  generateSmartMessage,
  generateValidationMessage,
  batchGenerateMessages,
  humanize,
  humanizeField,
  splitCompound,
  DOMAIN_WORDS,
  FIELD_LABEL_MAP,
  MODULE_PREFIXES,
  FIELD_TYPE_SUFFIXES,
};
