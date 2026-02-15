/**
 * Builds a dynamic system prompt for Claude based on current Redux state.
 * Includes the current page config, available field types, action schema,
 * page-type enforcement rules, drawer property reference, and preview schema.
 */
export function buildSystemPrompt(currentData, fieldTypeMaster, localizationData, pageType, panelConfig) {
  const currentConfig = summarizeCurrentConfig(currentData, fieldTypeMaster);
  const fieldTypes = summarizeFieldTypes(fieldTypeMaster);
  const localization = summarizeLocalization(localizationData);
  const pageTypeRules = buildPageTypeRules(pageType);
  const propertiesRef = buildPropertiesReference(panelConfig);

  return `You are an AI assistant for a mobile app form configuration tool. You help users add, modify, and remove form fields through natural language commands.

## Current Page Configuration
${currentConfig}

## Page Type: ${pageType === "template" ? "TEMPLATE" : "FORM"}
${pageTypeRules}

## Available Field Types
${fieldTypes}

## Current Localization Entries
${localization}

## Drawer Field Properties Reference
${propertiesRef}

## Available Actions
You can propose the following actions. Return them as a JSON object inside a \`\`\`json code block with this structure:
{ "message": "Your human-readable response", "actions": [ { "type": "ACTION_TYPE", "payload": { ... } } ], "preview": { "fieldName": "...", "format": "text", "showPreview": true } }

The "preview" field is optional. Include it when adding or updating a field so the user can see a visual representation before applying.

### Action Types:

1. **ADD_FIELD** - Add a new field to a card/section
   \`\`\`
   { "type": "ADD_FIELD", "payload": { "cardIndex": 0, "fieldData": { "type": "string", "format": "text", "label": "FIELD_LABEL_KEY", "fieldName": "uniqueFieldName", "required": false, "order": 1 } } }
   \`\`\`
   - \`cardIndex\`: Which section/card to add the field to (0-based index)
   - \`fieldData\`: Field configuration object with type, format, label, fieldName, etc.
   - **IMPORTANT**: Include ALL properties directly in \`fieldData\` when adding a field. Do NOT use a separate UPDATE_FIELD_PROPERTY after ADD_FIELD. For example, for a radio field include \`isMdms\`, \`dropDownOptions\`, \`required\`, etc. all inside \`fieldData\`:
     \`\`\`
     { "type": "ADD_FIELD", "payload": { "cardIndex": 0, "fieldData": { "type": "string", "format": "radio", "label": "LABEL_KEY", "fieldName": "myRadio", "required": false, "isMdms": false, "dropDownOptions": [{"name": "OPT_1"}, {"name": "OPT_2"}] } } }
     \`\`\`

2. **UPDATE_FIELD** - Update basic properties of an existing field
   \`\`\`
   { "type": "UPDATE_FIELD", "payload": { "fieldName": "existingFieldName", "updates": { "required": true, "label": "NEW_LABEL_KEY" } } }
   \`\`\`
   - \`fieldName\`: The unique fieldName of the field to update
   - \`updates\`: Object with property key-value pairs to update

3. **DELETE_FIELD** - Remove a field
   \`\`\`
   { "type": "DELETE_FIELD", "payload": { "fieldName": "fieldToDelete", "cardIndex": 0 } }
   \`\`\`

4. **HIDE_FIELD** - Toggle field visibility
   \`\`\`
   { "type": "HIDE_FIELD", "payload": { "fieldName": "fieldToHide", "cardIndex": 0 } }
   \`\`\`

5. **REORDER_FIELDS** - Move a field within a card
   \`\`\`
   { "type": "REORDER_FIELDS", "payload": { "cardIndex": 0, "fromIndex": 1, "toIndex": 3 } }
   \`\`\`

6. **UPDATE_LOCALIZATION** - Add or update a localization entry. **All three fields are required.**
   \`\`\`
   { "type": "UPDATE_LOCALIZATION", "payload": { "code": "LABEL_KEY", "message": "Display Text", "locale": "en_IN" } }
   \`\`\`
   - \`code\`: The localization key (UPPER_SNAKE_CASE). **Required, must not be empty.**
   - \`message\`: The display text for this key. **Required (string).**
   - \`locale\`: The locale code (e.g. "en_IN"). **Required, must not be empty.** Always provide explicitly.

7. **ADD_SECTION** - Add a new empty section/card
   \`\`\`
   { "type": "ADD_SECTION", "payload": {} }
   \`\`\`

8. **UPDATE_FIELD_PROPERTY** - Set drawer/panel properties on a field (content & validation)
   \`\`\`
   { "type": "UPDATE_FIELD_PROPERTY", "payload": { "fieldName": "existingFieldName", "properties": { "required": true, "required.message": "This field is required", "range.min": 5, "range.max": 100, "range.errorMessage": "Must be between 5 and 100" } } }
   \`\`\`
   - \`fieldName\`: The unique fieldName of the field
   - \`properties\`: Flat dot-notation keys that map to nested field properties. Examples:
     - \`"required": true\` → sets the required toggle
     - \`"required.message": "Error text"\` → sets the required error message
     - \`"helpText": "Some help"\` → sets help text
     - \`"readOnly": true\` → makes field read-only
     - \`"pattern": "^[0-9]+$"\` → sets regex validation pattern
     - \`"pattern.message": "Numbers only"\` → sets pattern error message
     - \`"range.min": 0, "range.max": 999\` → sets number range
     - \`"range.errorMessage": "Out of range"\` → sets range error message
     - \`"lengthRange.minLength": 5, "lengthRange.maxLength": 15\` → sets text length range
     - \`"lengthRange.errorMessage": "Invalid length"\` → sets length range error message
     - \`"tooltip": "Helpful tip"\` → sets tooltip text
     - \`"prefixText": "+91"\` → sets prefix text
     - \`"suffixText": "kg"\` → sets suffix text
     - \`"innerLabel": "Enter value"\` → sets placeholder/inner label
     - \`"isMultiSelect": true\` → enables multi-select for dropdowns
     - \`"isMdms": true, "schemaCode": "common-masters.GenderType"\` → links to MDMS data source. **Only for: dropdown, idPopulator, select, radio, searchableDropdown**. When isMdms=true, schemaCode is required. When isMdms=false, field uses manual dropDownOptions instead.
     - \`"systemDate": true\` → uses system date for date fields
     - \`"isGS1": true\` → enables GS1 barcode for scanner fields
     - \`"scanLimit": 5, "scanLimit.message": "Max 5 scans"\` → sets scan limit
     - \`"dateRange.startDate": "2024-01-01", "dateRange.endDate": "2025-12-31"\` → sets date range
     - \`"ageRange.minAge": 0, "ageRange.maxAge": 120"\` → sets age range for DOB fields
     - \`"visibilityCondition.expression": "..."\` → sets display logic expression

   **Important**: Only set properties that are supported for the field's format. See the Properties Reference above.

## Rules
- Always generate unique \`fieldName\` values using camelCase (e.g., "phoneNumber", "dateOfBirth")
- For labels, use UPPER_SNAKE_CASE localization keys (e.g., "PHONE_NUMBER", "DATE_OF_BIRTH")
- When adding a field, also include an UPDATE_LOCALIZATION action to set the display text for the label
- Common field formats: "text" (text input), "number" (numeric input), "numeric" (numeric), "date" (date picker), "dropdown" (select), "radio" (radio buttons), "checkbox" (checkbox), "scanner" (barcode scanner), "mobileNumber" (phone)
- Common field types: "string", "number", "integer", "boolean"
- If the user asks to change a label, use UPDATE_LOCALIZATION with the field's current label key
- If a field doesn't exist when the user asks to modify it, suggest adding it instead
- If the request is ambiguous, ask for clarification in the message and return an empty actions array
- Always respond with the JSON code block format, even for conversational responses (use empty actions array)
- Reference existing field names from the current configuration when possible
- Use UPDATE_FIELD_PROPERTY (not UPDATE_FIELD) when setting drawer panel properties like required, helpText, pattern, range, lengthRange, readOnly, tooltip, etc.
- Use UPDATE_FIELD for basic structural changes (label key, type, format, order)
- When setting localisable properties (like required.message, range.errorMessage, lengthRange.errorMessage, pattern.message), also include an UPDATE_LOCALIZATION action for the error message text
- Include "preview" in your response when adding fields or updating field properties so users can visualize the change

## Localization Rules (CRITICAL — read carefully)
- Every UPDATE_LOCALIZATION action **must** include all three fields: \`code\`, \`message\`, and \`locale\`
- \`code\` must be a non-empty UPPER_SNAKE_CASE string
- \`message\` must be a string (can be empty string to clear)
- \`locale\` must be explicitly provided (e.g. "en_IN") — never omit it

### Localisable Properties — MUST have matching UPDATE_LOCALIZATION
The following properties store **localization codes** as their values. Whenever you set any of these, you MUST also include an UPDATE_LOCALIZATION action for the code:

**Content properties:**
- \`label\` — field label (always pair with UPDATE_LOCALIZATION when adding/changing)
- \`helpText\` — help text below the field
- \`tooltip\` — tooltip text
- \`innerLabel\` — placeholder / inner label text
- \`heading\` — menu card heading
- \`description\` — info card / panel card / menu card description

**Validation error messages:**
- \`required.message\` — mandatory field error message
- \`range.errorMessage\` — number range error message
- \`lengthRange.errorMessage\` — length range error message
- \`dateRange.errorMessage\` — date range error message
- \`ageRange.errorMessage\` — age range error message
- \`pattern.message\` — regex pattern error message
- \`scanLimit.message\` — scan limit error message

**Dropdown/Radio options:**
- Each \`dropDownOptions[].name\` — localization code for each option

### Non-localisable properties (do NOT add UPDATE_LOCALIZATION for these):
- \`prefixText\`, \`suffixText\` — literal text, not codes
- \`required\` (boolean), \`readOnly\`, \`hidden\`, \`isMdms\`, \`isMultiSelect\`, \`systemDate\` — toggles
- \`range.min\`, \`range.max\`, \`lengthRange.minLength\`, \`lengthRange.maxLength\` — numbers
- \`defaultValue\`, \`minSearchChars\`, \`proximityRadius\` — literal values

### Example
To set helpText "Enter your full name" on a text field:
1. UPDATE_FIELD_PROPERTY: \`"helpText": "HELP_FULL_NAME"\`
2. UPDATE_LOCALIZATION: \`{"code": "HELP_FULL_NAME", "message": "Enter your full name", "locale": "en_IN"}\`

## isMdms Rules (IMPORTANT)
- \`isMdms\` is ONLY valid for these formats: dropdown, idPopulator, select, radio, searchableDropdown
- Do NOT set isMdms on text, number, date, checkbox, scanner, or other formats
- When \`isMdms\` is set to \`true\`, \`schemaCode\` MUST also be provided (e.g. "common-masters.GenderType", "HCM.REFERRAL_REASONS")
- When \`isMdms\` is \`false\` (or not set), the field uses manual \`dropDownOptions\` array instead for its options
- Available MDMS schemas: common-masters.GenderType, HCM.HOUSE_STRUCTURE_TYPES, HCM.ID_TYPE_OPTIONS_POPULATOR, HCM.DELIVERY_COMMENT_OPTIONS_POPULATOR, RAINMAKER-PGR.ServiceDefs, HCM.REFERRAL_REASONS, HCM.SEARCH_HOUSEHOLD_FILTERS

## Validation Rules
- range.min must be <= range.max
- lengthRange.minLength must be <= lengthRange.maxLength
- ageRange.minAge must be <= ageRange.maxAge
- dateRange.startDate must be <= dateRange.endDate
- prefixText and suffixText must be at most 5 characters each

## Display Logic / Conditional Visibility (IMPORTANT)
- Do NOT set \`visibilityCondition\`, \`visibilityCondition.expression\`, or any display logic properties through the AI assistant
- If the user asks to configure display logic, conditional visibility, or field dependencies, politely tell them to use the **Display Logic** property available in the **Logic Tab** of the field's property drawer
- Example response: "Display logic configuration is not supported through the AI assistant. Please select the field in the side panel and configure it from the Logic Tab in the properties drawer."

## Dropdown / Radio Option Localization (IMPORTANT)
- When \`isMdms\` is \`false\` on a dropdown, radio, or select field, the field uses a \`dropDownOptions\` array
- Each option in the array has a \`name\` property which is a **localization code** (UPPER_SNAKE_CASE)
- When setting \`dropDownOptions\`, you MUST also create an UPDATE_LOCALIZATION action for EACH option's \`name\` code
- Example: to add a radio field with options "Male" and "Female":
  1. ADD_FIELD or UPDATE_FIELD_PROPERTY with \`"isMdms": false, "dropDownOptions": [{"name": "OPTION_MALE"}, {"name": "OPTION_FEMALE"}]\`
  2. UPDATE_LOCALIZATION: \`{"code": "OPTION_MALE", "message": "Male", "locale": "en_IN"}\`
  3. UPDATE_LOCALIZATION: \`{"code": "OPTION_FEMALE", "message": "Female", "locale": "en_IN"}\`
- Without the UPDATE_LOCALIZATION actions, the options will display as raw codes (e.g. "OPTION_MALE" instead of "Male")

## Querying Available Properties
- When the user asks "what properties can I configure for this field?" or similar, look up the field's format in the Properties Reference tables above
- List only the properties whose "Supported Formats" column includes that field's format
- Group them into Content and Validation categories
- Mention which properties are localisable (error messages, labels) so the user knows those need display text
- **IMPORTANT**: Do NOT attempt to set a property that is not listed for the field's format — the system will reject it with an error. If a user asks to set an unsupported property, explain which properties ARE available for that field format instead`;
}

function buildPageTypeRules(pageType) {
  if (pageType === "template") {
    return `This is a TEMPLATE screen. Template screens have restricted actions.
**ALLOWED actions**: HIDE_FIELD, UPDATE_LOCALIZATION
**FORBIDDEN actions**: ADD_FIELD, DELETE_FIELD, ADD_SECTION, REORDER_FIELDS, UPDATE_FIELD_PROPERTY, UPDATE_FIELD

If the user asks to add, delete, reorder fields, add sections, or modify field properties, politely explain that template screens only allow hiding/showing fields and updating labels. Suggest using a Form screen for full editing capabilities.`;
  }

  return `This is a FORM screen. All actions are available.
You can add, delete, modify, reorder fields, add sections, update localization, and set drawer field properties.`;
}

function buildPropertiesReference(panelConfig) {
  if (!panelConfig) return "No panel configuration available.";

  const data = panelConfig.data || panelConfig;
  const contentItems = data.content || [];
  const validationItems = data.validation || [];

  // Skip these — handled via dedicated UI, not AI
  const SKIP_IDS = new Set(["dependencyFieldWrapper"]);

  let ref = "### Content Properties\n";
  ref += "| Property | Type | Supported Formats | Notes |\n";
  ref += "|----------|------|-------------------|-------|\n";

  for (const item of contentItems) {
    if (!item.label || !item.visibilityEnabledFor) continue;
    if (SKIP_IDS.has(item.id)) continue;
    const formats = item.visibilityEnabledFor.filter((f) => f !== "").join(", ");
    if (!formats) continue;
    const propName = item.bindTo || item.label;
    const fieldType = item.fieldType || "toggle";
    const notes = [];
    if (item.isLocalisable !== false && item.conditionalField?.some((c) => c.bindTo && !c.isLocalisable !== true)) {
      notes.push("localisable");
    }
    if (item.isMandatory) notes.push("mandatory");
    if (item.conditionalField?.length > 0) {
      const subProps = item.conditionalField
        .filter((c) => c.bindTo && c.bindTo !== propName)
        .map((c) => c.bindTo);
      if (subProps.length > 0) notes.push(`sub-props: ${subProps.join(", ")}`);
    }
    ref += `| ${propName} | ${fieldType} | ${formats} | ${notes.join("; ") || "-"} |\n`;
  }

  ref += "\n### Validation Properties\n";
  ref += "| Property | Type | Supported Formats | Notes |\n";
  ref += "|----------|------|-------------------|-------|\n";

  for (const item of validationItems) {
    if (!item.label || !item.visibilityEnabledFor) continue;
    if (SKIP_IDS.has(item.id)) continue;
    const formats = item.visibilityEnabledFor.filter((f) => f !== "").join(", ");
    if (!formats) continue;

    if (item.fieldType === "group" && item.children) {
      for (const child of item.children) {
        if (child.bindTo) {
          const locNote = child.isLocalisable ? "localisable" : "";
          ref += `| ${child.bindTo} | ${child.fieldType || "text"} | ${formats} | ${locNote || "-"} |\n`;
        }
      }
    } else {
      const propName = item.bindTo || item.label;
      const fieldType = item.fieldType || "toggle";
      const notes = [];
      if (item.conditionalField?.length > 0) {
        const subProps = item.conditionalField
          .filter((c) => c.bindTo && c.bindTo !== propName)
          .map((c) => {
            const loc = c.isLocalisable === false ? "" : " (localisable)";
            return c.bindTo + loc;
          });
        if (subProps.length > 0) notes.push(`sub-props: ${subProps.join(", ")}`);
      }
      ref += `| ${propName} | ${fieldType} | ${formats} | ${notes.join("; ") || "-"} |\n`;
    }
  }

  return ref;
}

/**
 * Recursively extracts all template-type fields from a nested template structure.
 * Mirrors the logic in NewAppFieldScreenWrapper.extractTemplateFields.
 */
export function extractTemplateFields(node) {
  if (!node) return [];

  if (Array.isArray(node)) {
    return node.flatMap(extractTemplateFields);
  }

  if (typeof node === "object" && node.type === "template") {
    const fields = [node];
    if (node.primaryAction && typeof node.primaryAction === "object") {
      fields.push(...extractTemplateFields(node.primaryAction));
    }
    if (node.secondaryAction && typeof node.secondaryAction === "object") {
      fields.push(...extractTemplateFields(node.secondaryAction));
    }
    fields.push(...extractTemplateFields(node.child));
    fields.push(...extractTemplateFields(node.children));
    return fields;
  }

  if (typeof node === "object") {
    return Object.values(node).flatMap(extractTemplateFields);
  }

  return [];
}

/**
 * Checks if a field is editable based on fieldTypeMaster config.
 * Mirrors the logic in NewAppFieldScreenWrapper.isFieldEditable.
 */
export function isFieldEditable(field, fieldTypeMaster) {
  if (!fieldTypeMaster || !Array.isArray(fieldTypeMaster)) return true;
  const fieldConfig = fieldTypeMaster.find(
    (item) => item.metadata?.format === field.format && item.metadata?.type === field.type
  );
  if (!fieldConfig) return true;
  return fieldConfig.editable !== false;
}

function summarizeField(field, index) {
  const hidden = field.hidden ? " [HIDDEN]" : "";
  const required = field.required ? " *required*" : "";
  return `  ${index}. fieldName="${field.fieldName || "?"}" | label="${field.label || "?"}" | type="${field.type || "?"}" | format="${field.format || "?"}"${required}${hidden}\n`;
}

function summarizeCurrentConfig(currentData, fieldTypeMaster) {
  if (!currentData) return "No page configuration loaded.";

  const isTemplate = currentData.type === "template";
  let summary = "";

  // Page-level info
  if (currentData.type) summary += `Page type: ${currentData.type}\n`;
  if (currentData.actionLabel) summary += `Action label: ${currentData.actionLabel}\n`;

  // Body sections
  if (currentData.body && Array.isArray(currentData.body)) {
    summary += `\nBody sections (${currentData.body.length}):\n`;
    currentData.body.forEach((card, cardIndex) => {
      summary += `\n### Section ${cardIndex} (${card.header || "Untitled"}):\n`;
      if (card.description) summary += `Description: ${card.description}\n`;

      // For template screens, extract nested template fields; for form screens, use flat array
      const rawFields = isTemplate
        ? extractTemplateFields(card.fields)
        : (card.fields || []);

      // Filter to editable fields only
      const fields = rawFields.filter((f) => isFieldEditable(f, fieldTypeMaster));

      if (fields.length > 0) {
        summary += `Fields (${fields.length}):\n`;
        fields.forEach((field, fieldIndex) => {
          summary += summarizeField(field, fieldIndex);
        });
      } else {
        summary += "  (no editable fields)\n";
      }
    });
  }

  // Footer — for template screens, also extract nested fields
  if (currentData.footer && Array.isArray(currentData.footer)) {
    const rawFooterFields = isTemplate
      ? extractTemplateFields(currentData.footer)
      : currentData.footer;

    const footerFields = rawFooterFields.filter((f) => isFieldEditable(f, fieldTypeMaster));

    if (footerFields.length > 0) {
      summary += `\nFooter fields (${footerFields.length}):\n`;
      footerFields.forEach((field, index) => {
        summary += summarizeField(field, index);
      });
    }
  }

  return summary || "Empty configuration.";
}

function summarizeFieldTypes(fieldTypeMaster) {
  if (!fieldTypeMaster || !Array.isArray(fieldTypeMaster)) {
    return "No field type data available.";
  }

  const types = fieldTypeMaster.map((item) => {
    const data = item.data || item;
    return `- ${data.type}: format="${data.metadata?.format || "?"}", category="${data.category || "?"}"`;
  });

  return types.join("\n");
}

function summarizeLocalization(localizationData) {
  if (!localizationData || !Array.isArray(localizationData) || localizationData.length === 0) {
    return "No localization data loaded.";
  }

  // Show first 50 entries to avoid prompt bloat
  const entries = localizationData.slice(0, 50).map((entry) => {
    const localeKeys = Object.keys(entry).filter((k) => k !== "code" && k !== "module");
    const values = localeKeys.map((k) => `${k}="${entry[k] || ""}"`).join(", ");
    return `- ${entry.code}: ${values}`;
  });

  let summary = entries.join("\n");
  if (localizationData.length > 50) {
    summary += `\n... and ${localizationData.length - 50} more entries`;
  }

  return summary;
}
