/**
 * FormConfig Corrector Engine
 *
 * Core library that validates and auto-fixes HCM FormConfigTemplate JSON.
 * Used by both CLI and Web interfaces.
 *
 * Checks & fixes:
 *   1. Missing `type` on components with `format` (TEMPLATE -> "template", FORM -> skip)
 *   2. Missing `fieldName` on components with `format`
 *   3. Duplicate fieldNames within a page/screen
 *   4. Missing flow `category`
 *   5. primaryAction/secondaryAction missing type, format, fieldName, properties.type
 *   6. Empty/missing errorMessage on components with validations
 *   7. Validation message: empty or hardcoded English -> localization codes
 *   8. Table column headers: generic/numbered codes -> descriptive codes
 *   9. Icon missing in properties when icon at component level
 *  10. Localization: collect all text codes, generate smart messages for missing ones
 *  11. labelPairList keys need localizations
 *  12. enum/dropDownOptions name values need localizations
 */

const MAX_WALK_DEPTH = 50;

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

const LOCALIZATION_FIELDS = [
  'fieldName', 'label', 'heading', 'title', 'description', 'message',
  'helpText', 'infoText', 'actionLabel', 'primaryActionLabel',
  'secondaryActionLabel', 'expandLabel', 'collapseLabel', 'innerLabel',
  'tooltip', 'errorMessage', 'key',
];

const DOMAIN_WORDS = [
  'ACKNOWLEDGEMENT', 'RECONCILIATION', 'REGISTRATION', 'CONFIGURATION',
  'BENEFICIARY', 'COMMUNITY', 'COMPLAINTS', 'COMPLAINT', 'CHECKLIST',
  'DASHBOARD', 'HOUSEHOLD', 'INVENTORY', 'INDIVIDUAL', 'NAVIGATION',
  'PERMISSION', 'SELECTION', 'SETTLEMENT', 'TRANSPORT', 'WAREHOUSE',
  'ATTENDANCE', 'CAMPAIGN', 'CATEGORY', 'COMMENTS', 'DELIVERY',
  'DETAILS', 'DAMAGED', 'EXPIRY', 'FACILITY', 'HANDLER', 'LOCATION',
  'MULTIPLE', 'OVERVIEW', 'PREVIEW', 'PRODUCTS', 'PRODUCT', 'QUANTITY',
  'RECEIVE', 'REPORTS', 'REQUIRED', 'SCANNER', 'SUCCESS', 'VEHICLE',
  'ACTIONS', 'BUTTON', 'CANCEL', 'CLOSE', 'COORD', 'CREATE', 'DELETE',
  'ENTER', 'FIELD', 'GENDER', 'MANAGE', 'MEMBER', 'NUMBER', 'RECORD',
  'REPORT', 'RETURN', 'SCREEN', 'SEARCH', 'SELECT', 'STOCK', 'SUBMIT',
  'BATCH', 'DATE', 'EDIT', 'FLOW', 'FORM', 'HEAD', 'HOME', 'ITEM',
  'LIST', 'LOST', 'MARK', 'NAME', 'NEXT', 'OPEN', 'PAGE', 'SCAN',
  'SENT', 'TEAM', 'TEXT', 'TYPE', 'UNABLE', 'VIEW', 'AREA', 'BACK',
  'CARD', 'CODE', 'DONE', 'FROM', 'HELP', 'INFO', 'LATLNG', 'PANEL',
  'SAVE', 'WHICH', 'ADD', 'AGE', 'NEW', 'QR', 'TO',
  'MONITORING', 'MONITOR', 'SURVEYOR', 'SURVEY', 'CLUSTER', 'LOT',
  'CHILDREN', 'VACCINATED', 'REFUSAL', 'ABSENCE', 'CAREGIVER',
  'AWARENESS', 'DESIGNATION', 'COVERED', 'FINGER', 'MARKED', 'DOSES',
  'REASON', 'SPECIFY', 'INFORMED', 'MISSED', 'ASLEEP', 'ROUTINE',
  'POORLY', 'FINAL', 'COUNT', 'CASE', 'VISITED', 'REVISITED',
  'PRESENT', 'PHYSICAL', 'CALCULATED', 'EXCESS', 'ISSUED', 'RETURNED',
  'RECEIVED', 'WAYBILL', 'ENTRY', 'MRN', 'TOTAL', 'MEMBERS', 'LABEL',
  'STATUS', 'DESCRIPTION', 'CONTACT', 'INBOX', 'COMPLAINANT',
  'REFERRAL', 'SYMPTOM', 'ERROR', 'MOBILE',
].sort((a, b) => b.length - a.length);

const SMALL_WORDS = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'for', 'and', 'or', 'but', 'is', 'at', 'by', 'on']);

const FIELD_LABEL_MAP = {
  latLng: 'GPS Coordinates', latlng: 'GPS Coordinates', dob: 'Date of Birth',
  dateOfBirth: 'Date of Birth', qrCode: 'QR Code', scanner: 'Scan Code',
  id: 'ID', uuid: 'UUID', otp: 'OTP', givenName: 'Given Name',
  nameOfIndividual: 'Name of Individual', isHeadOfFamily: 'Head of Family',
  memberCount: 'Member Count', proximityRadius: 'Proximity Radius',
  selectedStatus: 'Selected Status', cancelFilter: 'Cancel Filter',
  filterSubmit: 'Apply Filter', memberCard: 'Member Card',
  detailsRow: 'Details Row', headOfHouseholdName: 'Head of Household',
  openButton: 'Open', beneficiaryTag: 'Beneficiary Tag',
  householdId: 'Household ID', clientReferenceId: 'Reference ID',
  editHouseholdRow: 'Edit Household', editIndividual: 'Edit Individual',
  labelFieldPair: 'Label Field Pair', detailsView: 'Details',
  viewDetails: 'View Details', addMemberButton: 'Add Member',
  viewHouseholdButton: 'View Household', goBack: 'Go Back',
  deliveryButton: 'Deliver', deliveryStatusTable: 'Delivery Status',
  facilityId: 'Facility ID', tenantId: 'Tenant ID',
  projectId: 'Project ID', productVariantId: 'Product Variant ID',
  additionalFields: 'Additional Fields', transactionType: 'Transaction Type',
  dateOfEntry: 'Date of Entry', dateOfReconciliation: 'Date of Reconciliation',
  wayBillNumber: 'Waybill Number', mrnNumber: 'MRN Number',
  batchNumber: 'Batch Number', stockExpiry: 'Stock Expiry',
  quantityReceived: 'Quantity Received', applicationStatus: 'Application Status',
  serviceRequestId: 'Service Request ID', serviceCode: 'Service Code',
  mobileNumber: 'Mobile Number', dateOfRegistration: 'Date of Registration',
};

// ──────────────────────────────────────────────────────────────
// Utility functions
// ──────────────────────────────────────────────────────────────

function isCode(str) {
  if (!str || str.length === 0) return false;
  if (str.includes(' ') && !str.includes('_')) return false;
  if (/^[A-Z0-9_]+$/.test(str)) return true;
  if (/^[A-Za-z0-9_]+$/.test(str) && str.includes('_')) return true;
  return false;
}

function splitCompound(word) {
  const upper = word.toUpperCase();
  let rem = upper;
  const parts = [];
  while (rem.length > 0) {
    let found = false;
    for (const dw of DOMAIN_WORDS) {
      if (rem.startsWith(dw)) { parts.push(dw); rem = rem.substring(dw.length); found = true; break; }
    }
    if (!found) { parts.push(rem); break; }
  }
  return parts.map((p, i) => {
    const l = p.toLowerCase();
    return (i > 0 && SMALL_WORDS.has(l)) ? l : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }).join(' ');
}

function humanize(str) {
  if (!str) return '';
  if (/[a-z]/.test(str) && /[A-Z]/.test(str)) return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
  if (/^[A-Z0-9]+$/.test(str)) return splitCompound(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function humanizeField(fn) {
  if (!fn) return null;
  if (FIELD_LABEL_MAP[fn]) return FIELD_LABEL_MAP[fn];
  return fn.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
}

function labelToFieldName(label) {
  if (!label || typeof label !== 'string') return null;
  const parts = label.split('_').filter((p) => p.length > 0);
  if (parts.length === 0) return null;
  const useParts = parts.length > 4 ? parts.slice(-3) : parts;
  return useParts.map((part, idx) => {
    const lower = part.toLowerCase();
    if (idx === 0) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');
}

function smartMessageFromCode(code, moduleName) {
  if (!code) return code;
  let c = code;
  // Strip module prefix
  if (moduleName) {
    const pfx = moduleName.toUpperCase() + '_';
    if (c.startsWith(pfx)) c = c.substring(pfx.length);
  }
  // Strip common prefixes
  for (const pfx of ['HCM_', 'APPONE_', 'APP_CONFIG_', 'CLF_']) {
    if (c.startsWith(pfx)) { c = c.substring(pfx.length); break; }
  }
  // Strip common suffixes
  const SUFFIXES = [
    '_SECONDARY_ACTION_LABEL', '_PRIMARY_ACTION_LABEL', '_ERROR_MESSAGE', '_EXPAND_LABEL',
    '_COLLAPSE_LABEL', '_ACTION_LABEL', '_INNER_LABEL', '_FIELD_NAME', '_DESCRIPTION',
    '_HELP_TEXT', '_INFO_TEXT', '_HEADING', '_MESSAGE', '_TOOLTIP', '_LABEL', '_TITLE',
    '_ERROR',
  ];
  for (const sfx of SUFFIXES) {
    if (c.endsWith(sfx)) { c = c.substring(0, c.length - sfx.length); break; }
  }
  return c.split('_').filter(Boolean).map((s) => splitCompound(s)).join(' ');
}

function generateValidationMessage(fieldName, validationType, label) {
  const fieldLabel = label || fieldName || 'Field';
  const readable = smartMessageFromCode(fieldLabel);
  switch (validationType) {
    case 'required': return `${readable} is required`;
    case 'min': return `${readable} must meet the minimum value`;
    case 'max': return `${readable} exceeds the maximum value`;
    case 'minLength': return `${readable} is too short`;
    case 'maxLength': return `${readable} is too long`;
    case 'pattern': case 'regex': return `${readable} has an invalid format`;
    case 'minAge': case 'maxAge': return `Age must be within the valid range`;
    case 'scanLimit': return `Scan limit reached`;
    case 'facilityHierarchy': return `Invalid facility selection`;
    case 'notEqualTo': return `Facility from and to must be different`;
    case 'isGS1': return `Invalid barcode format`;
    default: return `${readable} validation error`;
  }
}

function generateErrorCode(moduleName, flowName, fieldName) {
  return `${moduleName.toUpperCase()}_${flowName.toUpperCase()}_${fieldName}_ERROR`;
}

function generateValidationCode(moduleName, flowName, fieldName, validationType) {
  const suffix = validationType.replace(/([A-Z])/g, '_$1').toUpperCase();
  return `${moduleName.toUpperCase()}_${flowName.toUpperCase()}_${fieldName}_${suffix}_ERROR`;
}

// ──────────────────────────────────────────────────────────────
// Rule 1: Missing type on components with format
// Rule 2: Missing fieldName on components with format
// ──────────────────────────────────────────────────────────────

function checkTypeAndFieldName(data, pathStr = 'data', issues = [], currentScreenType = null, visited = null, depth = 0) {
  if (depth > MAX_WALK_DEPTH) return issues;
  if (!visited) visited = new WeakSet();
  if (!data || typeof data !== 'object') return issues;
  if (Array.isArray(data)) {
    data.forEach((item, idx) => checkTypeAndFieldName(item, `${pathStr}[${idx}]`, issues, currentScreenType, visited, depth + 1));
    return issues;
  }
  if (visited.has(data)) return issues;
  visited.add(data);
  const screenType = data.screenType || currentScreenType;
  if (screenType === 'FORM') {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        checkTypeAndFieldName(value, `${pathStr}.${key}`, issues, screenType, visited, depth + 1);
      }
    }
    return issues;
  }
  if (data.format && typeof data.format === 'string' && data.format !== 'backLink') {
    const missing = [];
    if (screenType === 'TEMPLATE') {
      if (!data.type || data.type !== 'template') missing.push('type');
      if (!data.fieldName || typeof data.fieldName !== 'string' || data.fieldName.trim() === '') missing.push('fieldName');
    } else {
      if (!data.fieldName || typeof data.fieldName !== 'string' || data.fieldName.trim() === '') missing.push('fieldName');
      if (!data.type || typeof data.type !== 'string' || data.type.trim() === '') missing.push('type');
    }
    if (missing.length > 0) {
      issues.push({ path: pathStr, format: data.format, missing, obj: data, screenType });
    }
  }
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      checkTypeAndFieldName(value, `${pathStr}.${key}`, issues, screenType, visited, depth + 1);
    }
  }
  return issues;
}

function fixTypeAndFieldName(issues) {
  const fixes = [];
  for (const issue of issues) {
    if (issue.missing.includes('type')) {
      const targetType = issue.screenType === 'TEMPLATE' ? 'template' : 'string';
      issue.obj.type = targetType;
      fixes.push({ rule: 'missing-type', path: issue.path, format: issue.format, fixed: `type -> "${targetType}"` });
    }
    if (issue.missing.includes('fieldName')) {
      const candidate = labelToFieldName(issue.obj.label) || labelToFieldName(issue.obj.heading) || issue.obj.format || 'field';
      issue.obj.fieldName = candidate;
      fixes.push({ rule: 'missing-fieldName', path: issue.path, format: issue.format, fixed: `fieldName -> "${candidate}"` });
    }
  }
  return fixes;
}

// ──────────────────────────────────────────────────────────────
// Rule 3: Duplicate fieldNames within a page/screen
// ──────────────────────────────────────────────────────────────

function collectFieldNames(data, pathStr = '', entries = [], visited = null) {
  if (!visited) visited = new WeakSet();
  if (!data || typeof data !== 'object') return entries;
  if (Array.isArray(data)) {
    data.forEach((item, idx) => collectFieldNames(item, `${pathStr}[${idx}]`, entries, visited));
    return entries;
  }
  if (visited.has(data)) return entries;
  visited.add(data);
  if (data.fieldName && typeof data.fieldName === 'string' && data.fieldName.trim() !== '') {
    entries.push({ obj: data, fieldName: data.fieldName, path: pathStr });
  }
  for (const [key, value] of Object.entries(data)) {
    if (key === 'fieldName') continue;
    if (typeof value === 'object' && value !== null) {
      collectFieldNames(value, pathStr ? `${pathStr}.${key}` : key, entries, visited);
    }
  }
  return entries;
}

function checkAndFixDuplicateFieldNames(data) {
  if (!data?.flows || !Array.isArray(data.flows)) return [];
  const fixes = [];

  for (const flow of data.flows) {
    const screens = [];
    if (flow.body || flow.header || flow.footer) {
      screens.push({ screen: flow, name: flow.name || '(unnamed)' });
    }
    if (flow.pages && Array.isArray(flow.pages)) {
      flow.pages.forEach((page) => {
        screens.push({ screen: page, name: page.page || page.name || '(unnamed)' });
      });
    }

    for (const { screen, name } of screens) {
      const entries = collectFieldNames(screen);
      const seen = new Map();
      for (const entry of entries) {
        const fn = entry.fieldName;
        if (seen.has(fn)) {
          let suffix = 2;
          let newName = `${fn}${suffix}`;
          const allNames = new Set(entries.map((e) => e.obj.fieldName));
          while (allNames.has(newName)) { suffix++; newName = `${fn}${suffix}`; }
          entry.obj.fieldName = newName;
          fixes.push({ rule: 'duplicate-fieldName', screen: name, old: fn, new: newName, path: entry.path });
        } else {
          seen.set(fn, true);
        }
      }
    }
  }
  return fixes;
}

// ──────────────────────────────────────────────────────────────
// Rule 4: Missing flow category
// ──────────────────────────────────────────────────────────────

function checkAndFixFlowCategories(data) {
  if (!data?.flows) return [];
  const fixes = [];
  for (const flow of data.flows) {
    if ((flow.screenType || flow.body) && (!flow.category || typeof flow.category !== 'string' || flow.category.trim() === '')) {
      flow.category = flow.name || 'UNKNOWN';
      fixes.push({ rule: 'missing-flow-category', flow: flow.name, fixed: `category -> "${flow.category}"` });
    }
    if (flow.pages && Array.isArray(flow.pages)) {
      for (const pg of flow.pages) {
        if ((pg.screenType || pg.body) && (!pg.category || typeof pg.category !== 'string' || pg.category.trim() === '')) {
          pg.category = pg.name || pg.page || flow.name || 'UNKNOWN';
          fixes.push({ rule: 'missing-page-category', flow: flow.name, page: pg.page || pg.name, fixed: `category -> "${pg.category}"` });
        }
      }
    }
  }
  return fixes;
}

// ──────────────────────────────────────────────────────────────
// Rule 5: primaryAction/secondaryAction missing properties
// ──────────────────────────────────────────────────────────────

function checkAndFixActions(data) {
  const fixes = [];
  const visited = new WeakSet();
  function walkActions(obj, flowName, location) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walkActions(item, flowName, `${location}[${i}]`));
      return;
    }
    if (visited.has(obj)) return;
    visited.add(obj);
    for (const actionKey of ['primaryAction', 'secondaryAction']) {
      if (obj[actionKey] && typeof obj[actionKey] === 'object') {
        const action = obj[actionKey];
        const propType = actionKey === 'primaryAction' ? 'primary' : 'secondary';
        const baseName = flowName || obj.name || obj.page || 'unknown';
        const expectedFieldName = `${baseName.toLowerCase()}_${actionKey}`;
        let fixed = false;
        const details = [];

        if (!action.type) { action.type = 'template'; fixed = true; details.push('type -> "template"'); }
        if (!action.format) { action.format = 'button'; fixed = true; details.push('format -> "button"'); }
        if (!action.fieldName) { action.fieldName = expectedFieldName; fixed = true; details.push(`fieldName -> "${expectedFieldName}"`); }
        if (!action.properties) action.properties = {};
        if (!action.properties.type) { action.properties.type = propType; fixed = true; details.push(`properties.type -> "${propType}"`); }

        if (fixed) {
          fixes.push({ rule: `missing-${actionKey}-props`, flow: flowName, location: `${location}.${actionKey}`, details: details.join(', ') });
        }
      }
    }
    for (const [key, val] of Object.entries(obj)) {
      if (key !== 'primaryAction' && key !== 'secondaryAction' && typeof val === 'object' && val !== null) {
        walkActions(val, flowName, `${location}.${key}`);
      }
    }
  }

  for (const flow of (data.flows || [])) {
    walkActions(flow, flow.name, flow.name || 'flow');
  }
  return fixes;
}

// ──────────────────────────────────────────────────────────────
// Rule 6 & 7: errorMessage and validation messages
// ──────────────────────────────────────────────────────────────

function checkAndFixValidations(data, moduleName) {
  const fixes = [];
  const newLocCodes = new Map(); // code -> message

  function processComp(comp, flowName, location) {
    const fieldName = comp.fieldName || 'unknown';
    const label = comp.label || comp.heading || '';

    // Rule 6: Empty errorMessage on component with validations
    if ('errorMessage' in comp && (!comp.errorMessage || comp.errorMessage === '')) {
      if (comp.validations && comp.validations.length > 0) {
        const code = generateErrorCode(moduleName, flowName, fieldName);
        comp.errorMessage = code;
        fixes.push({ rule: 'empty-errorMessage', flow: flowName, location, fieldName, fixed: `errorMessage -> "${code}"` });
        if (!newLocCodes.has(code)) {
          newLocCodes.set(code, `${smartMessageFromCode(fieldName)} validation failed`);
        }
      }
    }

    // Rule 7: Validation messages
    if (Array.isArray(comp.validations)) {
      for (let vi = 0; vi < comp.validations.length; vi++) {
        const v = comp.validations[vi];
        const vType = v.type || '';
        if (vType === 'isGS1' && !('message' in v)) continue;
        if (vType === 'minSearchChars' && !('message' in v)) continue;

        if ('message' in v) {
          const msg = v.message || '';
          if (!msg || msg === '') {
            // Empty validation message
            const code = generateValidationCode(moduleName, flowName, fieldName, vType);
            v.message = code;
            fixes.push({ rule: 'empty-validation-message', flow: flowName, location: `${location}.validations[${vi}]`, fieldName, vType, fixed: `message -> "${code}"` });
            if (!newLocCodes.has(code)) {
              newLocCodes.set(code, generateValidationMessage(fieldName, vType, label));
            }
          } else if (!isCode(msg)) {
            // Hardcoded English text
            const code = generateValidationCode(moduleName, flowName, fieldName, vType);
            const originalMsg = msg;
            v.message = code;
            fixes.push({ rule: 'hardcoded-validation-message', flow: flowName, location: `${location}.validations[${vi}]`, fieldName, vType, original: originalMsg, fixed: `"${originalMsg}" -> "${code}"` });
            if (!newLocCodes.has(code)) {
              newLocCodes.set(code, originalMsg);
            }
          } else {
            // Already a code - ensure localization exists
            if (!newLocCodes.has(msg)) {
              newLocCodes.set(msg, generateValidationMessage(fieldName, vType, label));
            }
          }
        }
      }
    }
  }

  for (const flow of (data.flows || [])) {
    const flowName = flow.name;
    for (const section of ['body', 'header', 'footer']) {
      for (let i = 0; i < (flow[section] || []).length; i++) {
        processComp(flow[section][i], flowName, `${section}[${i}]`);
      }
    }
    for (let pi = 0; pi < (flow.pages || []).length; pi++) {
      const page = flow.pages[pi];
      for (let pri = 0; pri < (page.properties || []).length; pri++) {
        processComp(page.properties[pri], flowName, `pages[${pi}].properties[${pri}]`);
      }
    }
  }

  return { fixes, newLocCodes };
}

// ──────────────────────────────────────────────────────────────
// Rule 8: Table column headers (generic -> descriptive)
// ──────────────────────────────────────────────────────────────

function checkTableHeaders(data, moduleName) {
  const issues = [];
  const visited = new WeakSet();
  function walk(obj, path) {
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${path}[${i}]`));
    } else if (obj && typeof obj === 'object') {
      if (visited.has(obj)) return;
      visited.add(obj);
      if (obj.format === 'table' && obj.data && Array.isArray(obj.data.columns)) {
        for (let ci = 0; ci < obj.data.columns.length; ci++) {
          const col = obj.data.columns[ci];
          if (!col.header) {
            issues.push({ rule: 'missing-table-header', path: `${path}.data.columns[${ci}]`, cellValue: col.cellValue, obj: col });
          } else if (!isCode(col.header)) {
            // Hardcoded text header - needs a code
            issues.push({ rule: 'hardcoded-table-header', path: `${path}.data.columns[${ci}]`, header: col.header, cellValue: col.cellValue, obj: col });
          } else if (/HEADER_\d+_LABEL$/.test(col.header)) {
            // Generic numbered header like HEADER_1_LABEL
            issues.push({ rule: 'generic-table-header', path: `${path}.data.columns[${ci}]`, header: col.header, cellValue: col.cellValue, obj: col });
          }
        }
      }
      for (const [key, val] of Object.entries(obj)) {
        walk(val, `${path}.${key}`);
      }
    }
  }
  walk(data, 'data');
  return issues;
}

function deriveTableHeaderCode(moduleName, cellValue, existingHeader) {
  // Try to understand what the column represents from cellValue
  if (!cellValue) return null;

  // Extract the field name from template expressions
  // {{item.dateOfEntry}} -> dateOfEntry
  // {{fn:formatDate(item.dateOfReconciliation, ...)}} -> dateOfReconciliation
  // {{item.additionalFields.fields.sku}} -> sku
  const fieldMatch = cellValue.match(/item\.(?:additionalFields\.fields\.)?(\w+)/);
  if (fieldMatch) {
    const field = fieldMatch[1];
    const readable = humanizeField(field) || humanize(field);
    const codePart = field.replace(/([A-Z])/g, '_$1').toUpperCase();
    return {
      code: `${moduleName.toUpperCase()}_TABLE_HEADER_${codePart}`,
      message: readable,
    };
  }

  // contextData patterns
  const ctxMatch = cellValue.match(/contextData\.\d+\.[\w.]+\.(\w+)(?:\.\w+)*$/);
  if (ctxMatch) {
    const field = ctxMatch[1];
    const readable = humanizeField(field) || humanize(field);
    const codePart = field.replace(/([A-Z])/g, '_$1').toUpperCase();
    return {
      code: `${moduleName.toUpperCase()}_TABLE_HEADER_${codePart}`,
      message: readable,
    };
  }

  return null;
}

function fixTableHeaders(issues, moduleName) {
  const fixes = [];
  const newLocCodes = new Map();

  for (const issue of issues) {
    if (issue.rule === 'hardcoded-table-header') {
      // Hardcoded text -> generate code
      const codePart = issue.header.toUpperCase().replace(/\s+/g, '_');
      const newCode = `${moduleName.toUpperCase()}_TABLE_HEADER_${codePart}`;
      const oldHeader = issue.header;
      issue.obj.header = newCode;
      fixes.push({ rule: 'hardcoded-table-header', path: issue.path, old: oldHeader, new: newCode });
      if (!newLocCodes.has(newCode)) {
        newLocCodes.set(newCode, oldHeader);
      }
    } else if (issue.rule === 'generic-table-header') {
      // Generic numbered -> derive from cellValue
      const derived = deriveTableHeaderCode(moduleName, issue.cellValue, issue.header);
      if (derived) {
        const oldHeader = issue.header;
        issue.obj.header = derived.code;
        fixes.push({ rule: 'generic-table-header', path: issue.path, old: oldHeader, new: derived.code, message: derived.message });
        if (!newLocCodes.has(derived.code)) {
          newLocCodes.set(derived.code, derived.message);
        }
      }
    }
  }

  return { fixes, newLocCodes };
}

// ──────────────────────────────────────────────────────────────
// Rule 9: Icon missing in properties
// ──────────────────────────────────────────────────────────────

function checkAndFixIcons(data) {
  const fixes = [];
  const visited = new WeakSet();
  function walk(obj, path, depth) {
    if (depth > MAX_WALK_DEPTH) return;
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${path}[${i}]`, depth + 1));
    } else if (obj && typeof obj === 'object') {
      if (visited.has(obj)) return;
      visited.add(obj);
      // Only fix icon on components (objects that have format), not generic objects
      if (obj.format && obj.icon && typeof obj.icon === 'string' && obj.icon.trim()) {
        if (!obj.properties) obj.properties = {};
        if (!obj.properties.icon) {
          obj.properties.icon = obj.icon;
          fixes.push({ rule: 'icon-missing-in-properties', path, icon: obj.icon });
        }
      }
      for (const [key, val] of Object.entries(obj)) {
        // Skip recursing into properties to avoid the chain properties.properties...
        if (key === 'properties') continue;
        if (typeof val === 'object' && val !== null) walk(val, `${path}.${key}`, depth + 1);
      }
    }
  }
  walk(data, 'data', 0);
  return fixes;
}

// ──────────────────────────────────────────────────────────────
// Rule 10: Collect all localization codes and generate messages
// ──────────────────────────────────────────────────────────────

function collectLocalizationCodes(data, moduleName) {
  const codes = new Map(); // code -> { fieldType, suggested message }
  const visited = new WeakSet();

  function walk(obj, ctx, depth) {
    if (depth > MAX_WALK_DEPTH) return;
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { obj.forEach((item) => walk(item, ctx, depth + 1)); return; }
    if (visited.has(obj)) return;
    visited.add(obj);

    const c = { ...ctx };
    if (obj.screenType) c.screenType = obj.screenType;
    if (obj.name && !obj.format) c.pageName = obj.name;
    if (obj.page) c.pageName = obj.page;

    const isCmp = !!obj.format;

    for (const f of LOCALIZATION_FIELDS) {
      const v = obj[f];
      if (v && typeof v === 'string' && v.trim()) {
        const code = v.trim();
        // Skip non-code values (actual text, template expressions, etc.)
        if (code.includes(' ') && !code.includes('_')) continue;
        if (code.startsWith('{{')) continue;
        if (code.startsWith('fn:')) continue;
        if (code.includes('(') || code.includes(')')) continue;
        if (code.includes('.')) continue;

        if (!codes.has(code)) {
          const message = generateSmartLocMessage(code, f, isCmp ? obj.fieldName : null, c.pageName, moduleName);
          codes.set(code, { fieldType: f, message, componentFieldName: isCmp ? obj.fieldName : null, pageName: c.pageName });
        }
      }
    }

    // Also check table headers
    if (obj.format === 'table' && obj.data && Array.isArray(obj.data.columns)) {
      for (const col of obj.data.columns) {
        if (col.header && isCode(col.header) && !codes.has(col.header)) {
          codes.set(col.header, { fieldType: 'tableHeader', message: smartMessageFromCode(col.header, moduleName) });
        }
      }
    }

    // labelPairList keys
    if (Array.isArray(obj.labelPairList)) {
      for (const pair of obj.labelPairList) {
        for (const keyField of ['key', 'label']) {
          if (pair && pair[keyField] && typeof pair[keyField] === 'string' && isCode(pair[keyField])) {
            if (!codes.has(pair[keyField])) {
              codes.set(pair[keyField], { fieldType: 'labelPairList', message: smartMessageFromCode(pair[keyField], moduleName) });
            }
          }
        }
      }
    }

    // enums and dropDownOptions (dropdown/dropdownTemplate components)
    for (const enumArr of ['enums', 'dropDownOptions']) {
      if (Array.isArray(obj[enumArr])) {
        for (const en of obj[enumArr]) {
          if (en && en.name && typeof en.name === 'string' && en.name.trim()) {
            const nc = en.name.trim();
            if (nc.includes(' ') && !nc.includes('_')) continue;
            if (nc.startsWith('{{')) continue;
            if (!codes.has(nc)) {
              codes.set(nc, { fieldType: 'enum', message: generateSmartLocMessage(nc, 'enum', obj.fieldName || null, c.pageName, moduleName) });
            }
          }
        }
      }
    }

    for (const [k, val] of Object.entries(obj)) {
      if (typeof val === 'object' && val !== null) walk(val, c, depth + 1);
    }
  }

  walk(data, {}, 0);
  return codes;
}

function generateSmartLocMessage(code, fieldType, componentFieldName, pageName, moduleName) {
  if (!code) return '';
  if (code.includes(' ')) return code; // Already a message

  const fl = componentFieldName ? humanizeField(componentFieldName) : null;
  const isSuccess = pageName && /success/i.test(pageName);

  switch (fieldType) {
    case 'primaryActionLabel':
    case 'actionLabel':
      return isSuccess ? 'Back to Home' : 'Submit';
    case 'secondaryActionLabel':
      return isSuccess ? 'Back to Home' : 'Back';
    case 'heading':
    case 'title':
      return isSuccess ? 'Success' : smartMessageFromCode(code, moduleName);
    case 'description':
      return isSuccess ? 'Your action has been completed successfully.' : smartMessageFromCode(code, moduleName);
    case 'label':
      return fl || smartMessageFromCode(code, moduleName);
    case 'helpText':
    case 'infoText':
      return fl ? `Enter the ${fl.toLowerCase()}` : smartMessageFromCode(code, moduleName);
    case 'expandLabel':
      return 'Show More';
    case 'collapseLabel':
      return 'Show Less';
    case 'tooltip':
      return smartMessageFromCode(code, moduleName);
    case 'errorMessage':
    case 'message':
      if (/REQUIRED/i.test(code)) return `${fl || smartMessageFromCode(code, moduleName)} is required`;
      if (/MIN/i.test(code)) return `${fl || smartMessageFromCode(code, moduleName)} is too short`;
      if (/MAX/i.test(code)) return `${fl || smartMessageFromCode(code, moduleName)} exceeds maximum length`;
      return smartMessageFromCode(code, moduleName);
    default:
      return smartMessageFromCode(code, moduleName);
  }
}

// ──────────────────────────────────────────────────────────────
// Rule 11: LabelFieldPairConfig name localizations
// ──────────────────────────────────────────────────────────────

function collectLfpcCodes(lfpcRecords) {
  const codes = new Map();
  for (const rec of (lfpcRecords || [])) {
    if (rec.data && Array.isArray(rec.data.labelFields)) {
      for (const lf of rec.data.labelFields) {
        if (lf.name && typeof lf.name === 'string' && !lf.name.startsWith('{{') && !codes.has(lf.name)) {
          codes.set(lf.name, { entity: rec.data.entity, message: smartMessageFromCode(lf.name, null) });
        }
      }
    }
  }
  return codes;
}

// ──────────────────────────────────────────────────────────────
// Main corrector function
// ──────────────────────────────────────────────────────────────

/**
 * Analyze and fix a single FormConfig JSON.
 * @param {object} configData - The FormConfig data object (rec.data)
 * @param {object} options
 * @param {boolean} options.autoFix - Whether to apply fixes to the data (default: true)
 * @param {Map} options.existingLocCodes - Set of existing localization codes
 * @param {object[]} options.lfpcRecords - LabelFieldPairConfig records (optional)
 * @returns {object} { correctedData, report, newLocalizations }
 */
function analyzeAndFix(configData, options = {}) {
  const { autoFix = true, existingLocCodes = new Map(), lfpcRecords = [] } = options;
  const data = autoFix ? JSON.parse(JSON.stringify(configData)) : configData;
  const moduleName = data.name || 'UNKNOWN';

  const report = {
    moduleName,
    totalIssues: 0,
    fixes: [],
    warnings: [],
  };

  const allNewLocCodes = new Map(); // code -> message

  // Rule 1 & 2: Missing type and fieldName
  const typeFieldIssues = checkTypeAndFieldName(data);
  if (typeFieldIssues.length > 0) {
    if (autoFix) {
      const tfFixes = fixTypeAndFieldName(typeFieldIssues);
      report.fixes.push(...tfFixes);
    } else {
      for (const issue of typeFieldIssues) {
        for (const m of issue.missing) {
          report.warnings.push({ rule: `missing-${m}`, path: issue.path, format: issue.format, screenType: issue.screenType });
        }
      }
    }
  }

  // Rule 3: Duplicate fieldNames
  const dupFixes = checkAndFixDuplicateFieldNames(data);
  report.fixes.push(...dupFixes);

  // Rule 4: Missing flow categories
  const catFixes = checkAndFixFlowCategories(data);
  report.fixes.push(...catFixes);

  // Rule 5: primaryAction/secondaryAction
  const actionFixes = checkAndFixActions(data);
  report.fixes.push(...actionFixes);

  // Rule 6 & 7: Validation messages
  const valResult = checkAndFixValidations(data, moduleName);
  report.fixes.push(...valResult.fixes);
  for (const [code, msg] of valResult.newLocCodes) allNewLocCodes.set(code, msg);

  // Rule 8: Table headers
  const tableIssues = checkTableHeaders(data, moduleName);
  if (tableIssues.length > 0 && autoFix) {
    const tableResult = fixTableHeaders(tableIssues, moduleName);
    report.fixes.push(...tableResult.fixes);
    for (const [code, msg] of tableResult.newLocCodes) allNewLocCodes.set(code, msg);
  } else {
    for (const issue of tableIssues) {
      report.warnings.push(issue);
    }
  }

  // Rule 9: Icon in properties
  const iconFixes = checkAndFixIcons(data);
  report.fixes.push(...iconFixes);

  // Rule 10: Collect all localization codes
  const allLocCodes = collectLocalizationCodes(data, moduleName);
  const missingLocs = [];
  for (const [code, info] of allLocCodes) {
    if (!existingLocCodes.has(code) && !allNewLocCodes.has(code)) {
      missingLocs.push({ code, ...info });
      allNewLocCodes.set(code, info.message);
    }
  }

  // Rule 11: LFPC codes
  const lfpcCodes = collectLfpcCodes(lfpcRecords);
  for (const [code, info] of lfpcCodes) {
    if (!existingLocCodes.has(code) && !allNewLocCodes.has(code)) {
      allNewLocCodes.set(code, info.message);
    }
  }

  report.totalIssues = report.fixes.length + report.warnings.length;
  report.missingLocalizations = missingLocs;

  return {
    correctedData: autoFix ? data : configData,
    report,
    newLocalizations: Array.from(allNewLocCodes.entries()).map(([code, message]) => ({ code, message })),
  };
}

// ──────────────────────────────────────────────────────────────
// Exports
// ──────────────────────────────────────────────────────────────

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeAndFix,
    checkTypeAndFieldName,
    fixTypeAndFieldName,
    checkAndFixDuplicateFieldNames,
    checkAndFixFlowCategories,
    checkAndFixActions,
    checkAndFixValidations,
    checkTableHeaders,
    fixTableHeaders,
    checkAndFixIcons,
    collectLocalizationCodes,
    collectLfpcCodes,
    isCode,
    smartMessageFromCode,
    generateSmartLocMessage,
    humanize,
    humanizeField,
    LOCALIZATION_FIELDS,
  };
}
