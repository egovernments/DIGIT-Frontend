const getTypeAndMetaData = (field, fieldTypeMasterData = []) => {
  if (!Array.isArray(fieldTypeMasterData) || fieldTypeMasterData.length === 0) {
    return { type: "textInput" };
  }

  // Try to find a matching field type from master data
  const matched = fieldTypeMasterData.find((item) => {
    // Match type and format from metadata and fieldName in case of type : dynamic and format : custom
    if (item?.metadata?.type === "dynamic" && item?.metadata?.format === "custom") {
      return item?.metadata?.type === field.type && item?.metadata?.format === field.format && item?.type === field?.fieldName;
    }
    // Match both type and format from metadata
    return item?.metadata?.type === field.type && item?.metadata?.format === field.format;
    // && item?.metadata?.format === field.fieldName;
  });

  if (!matched) {
    return { type: "textInput" };
  }

  // Start with the fieldType as type
  let result = { type: matched.fieldType, appType: matched.type };

  // Copy all metadata properties except type/format (already used)
  Object.entries(matched.metadata || {}).forEach(([key, value]) => {
    if (key !== "type" && key !== "format") {
      result[key] = value;
    }
  });

  // Map/rename additional attributes as per attributeToRename
  if (matched.attributeToRename) {
    Object.entries(matched.attributeToRename).forEach(([to, from]) => {
      if (field[from] !== undefined) {
        result[to] = field[from];
      }
    });
  }

  // Special handling for enums to dropdownOptions (for dropdown/select)
  if (field.enums) {
    result.dropDownOptions = [...field.enums];
  }

  // Pass through other common field properties if needed (e.g., min, max, prefix)
  ["min", "max", "prefix", "startDate", "endDate"].forEach((prop) => {
    if (field[prop] !== undefined) {
      result[prop] = field[prop];
    }
  });

  return result;
};

const guessPageName = (label) => {
  const map = {
    BENE_LOCATION: "beneficiaryLocation",
    BENE_HOUSE: "HouseDetails",
    // Add more mappings as needed
  };
  return map[label] || label;
};

// Helper to get type/format and handle attribute renaming from appType using fieldTypeMasterData
export const getTypeAndFormatFromAppType = (field, fieldTypeMasterData = []) => {
  if (!field.appType) return {};
  const matched = fieldTypeMasterData.find((item) => item.type === field.appType);
  if (!matched) return {};
  const result = {
    type: matched.metadata?.type,
    format: matched.metadata?.format,
  };
  // Handle attributeToRename: { targetKey: sourceKey }
  if (matched.attributeToRename) {
    Object.entries(matched.attributeToRename).forEach(([targetKey, sourceKey]) => {
      if (sourceKey === "validations" || targetKey === "validations") {
        return;
      } else {
        result[sourceKey] = field[targetKey];
      }
    });
  }
  return result;
};

// const getTypeAndFormatFromAppType = (field, fieldTypeMasterData = []) => {
//   if (!field.appType) return {};

//   const matched = fieldTypeMasterData.find((item) => item.type === field.appType);
//   if (!matched) return {};

//   const result = {
//     type: matched.metadata?.type,
//     format: matched.metadata?.format,
//   };

//   const renameMap = matched.attributeToRename || {};

//   Object.keys(field).forEach((key) => {
//     if (key === "validations") return;

//     if (renameMap[key]) {
//       // If the current key should be renamed, store its value under the mapped key
//       result[renameMap[key]] = field[key];
//     } else if (!Object.values(renameMap).includes(key)) {
//       // If key is not in targetKey list, copy it as-is
//       result[key] = field[key];
//     }
//     // If key is a target of rename (i.e., already renamed from source), skip it
//   });

//   return result;
// };

function flattenValidationsToField(validationsArray) {
  const result = {};

  if (!Array.isArray(validationsArray)) return {};

  for (const rule of validationsArray) {
    if (!rule || typeof rule !== "object") continue;
    const { type, value, message } = rule;

    if (!type || value === undefined || value === null) continue;

    result[`toArray.${type}`] = value;
    if (message !== undefined && message !== null) {
      result[`toArray.${type}.message`] = message;
    }
  }

  return result;
}

function flattenValidationsToField2(validationsArray, groupKey = "validation") {
  const result = {};
  if (!Array.isArray(validationsArray)) return result;
  for (const rule of validationsArray) {
    if (!rule || typeof rule !== "object") continue;
    const { type, value, message } = rule;
    if (!type || value === undefined || value === null) continue;
    if (!result[groupKey]) result[groupKey] = {};
    result[groupKey][type] = value;
    if (message !== undefined && message !== null) {
      result[groupKey][`${type}.message`] = message;
    }
  }
  return result;
}
function flattenConfigArrays(configObj) {
  const result = {};
  for (const key in configObj) {
    if (key === "validations") {
      continue;
    }
    const value = configObj[key];
    // Handle array of {type, value} objects (like validations)
    if (Array.isArray(value) && value.every((v) => typeof v === "object" && v.type)) {
      const flattened = flattenValidationsToField2(value, key);
      Object.assign(result, flattened); // Only merged part (e.g., { validations: { ... } })
    }
  }
  return result; // :white_check_mark: Only changed keys
}

const addValidationArrayToConfig = (field, fieldTypeMasterData = []) => {
  const validationArray = [];
  if (field && field.pattern) {
    validationArray.push({
      type: "pattern",
      message: field?.pattern?.message,
      value: field?.pattern?.value,
      ...field?.pattern,
    });
  }
  return validationArray;
};

export const restructure = (data1, fieldTypeMasterData = [], parent) => {
  return [...data1?.sort((a, b) => a.order - b.order)].map((page) => {
    const cardFields = page.properties
      ?.sort((a, b) => a.order - b.order)
      ?.map((field, index) => ({
        ...getTypeAndMetaData(field, fieldTypeMasterData),
        ...flattenConfigArrays(field),
        ...flattenValidationsToField(field?.validations || []),
        label: field?.label || "",
        value: field?.value || "",
        defaultValue: field?.value ? true : false,
        active: true,
        jsonPath: field?.fieldName || "",
        format: field?.format || "",
        metaData: {},
        // Mandatory: field.required || false,
        hidden: field?.hidden || false,
        deleteFlag: field?.deleteFlag || false,
        isLocalised: field?.isLocalised ? true : false,
        innerLabel: field?.innerLabel || "",
        errorMessage: field?.errorMessage || "",
        tooltip: field?.tooltip || "",
        infoText: field?.infoText || "",
        order: field?.order,
        readOnly: field?.readOnly || false,
        systemDate: field?.systemDate || false,
        pattern: field?.validations?.find((i) => i?.type === "pattern"),
        RegexPattern: field?.validations?.find((i) => i?.type === "pattern") ? true : false,
        MdmsDropdown: field?.schemaCode ? true : false,
        isMdms: field?.schemaCode ? true : false,
        isMultiSelect: field?.isMultiSelect ? true : false,
        schemaCode: field?.schemaCode || "",
        includeInForm: field?.includeInForm === false ? false : true,
        includeInSummary: field?.includeInSummary === false ? false : true,
        helpText: typeof field?.helpText === "string" ? field.helpText : "",
        prefixText: field?.prefixText || "",
        suffixText: field?.suffixText || "",
        visibilityCondition: { ...field?.visibilityCondition } || null,
        autoFillCondition: field?.autoFillCondition,
      }));

    return {
      name: page.page || "default",
      cards: [
        {
          header: crypto.randomUUID(), // remove this crypto dependency
          fields: cardFields,
          headerFields: [
            {
              type: "text",
              label: "SCREEN_HEADING",
              value: page.label || "",
              active: true,
              jsonPath: "ScreenHeading",
              metaData: {},
              required: true,
              isLocalised: page.label ? true : false,
            },
            {
              type: "textarea",
              label: "SCREEN_DESCRIPTION",
              value: page.description || "",
              active: true,
              jsonPath: "Description",
              metaData: {},
              required: true,
              isLocalised: page.description ? true : false,
            },
          ],
        },
      ],
      actionLabel: page?.actionLabel || "",
      order: page.order,
      type: page.type,
      config: {
        enableComment: false,
        enableFieldAddition: true,
        allowFieldsAdditionAt: ["body"],
        enableSectionAddition: false,
        allowCommentsAdditionAt: ["body"],
      },
      navigateTo: page?.navigateTo || {},
       conditionalNavigateTo: page?.conditionalNavigateTo,
      parent: parent?.name || "",
    };
  });
};

function addToArrayFields(field) {
  const validationMap = {};

  if (!field || typeof field !== "object") return [];

  for (const key in field) {
    if (!Object.prototype.hasOwnProperty.call(field, key)) continue;

    if (key.startsWith("toArray.")) {
      //TODO @nabeel @jagan right now key is toArray. but we should have a object called toArray :{ all attributes to be set inside this}
      const parts = key.split(".");
      const type = parts[1];
      if (!type) continue;

      if (!validationMap[type]) validationMap[type] = { type };

      if (parts.length === 2) {
        validationMap[type].value = field[key];
      } else if (parts.length === 3 && parts[2] === "message") {
        validationMap[type].message = field[key];
      }
    }
  }

  return Object.values(validationMap).filter((v) => v.value !== undefined && v.value !== null);
}

// Update reverseRestructure to use getTypeAndFormatFromAppType
export const reverseRestructure = (updatedData, fieldTypeMasterData = []) => {
  return updatedData.map((section, index) => {
    const properties = section.cards?.[0]?.fields.map((field, fieldIndex) => {
      const typeAndFormat = getTypeAndFormatFromAppType(field, fieldTypeMasterData);
      const toArrayFields = addToArrayFields(field, fieldTypeMasterData); // TODO @nabeel @jagan right now this works for only validation array, we should think to expose to change the main config dynamically
      return {
        ...typeAndFormat,
        label: field?.label || "",
        order: field?.order,
        value: field?.value || "",
        // required: field.Mandatory || false,
        hidden: field?.hidden || false,
        fieldName: field?.jsonPath || "",
        tooltip: field?.tooltip || "",
        infoText: field?.infoText || "",
        innerLabel: field?.innerLabel || "",
        errorMessage: field?.errorMessage || "",
        deleteFlag: field?.deleteFlag || false,
        readOnly: field?.readOnly || false,
        systemDate: field?.systemDate || false,
        isMultiSelect: field?.isMultiSelect ? true : false,
        includeInForm: field?.includeInForm === false ? false : true,
        includeInSummary: field?.includeInSummary === false ? false : true,
        enums: field?.dropDownOptions,
        validations: toArrayFields,
        helpText: typeof field?.helpText === "string" ? field.helpText : "",
        prefixText: field?.prefixText || "",
        suffixText: field?.suffixText || "",
        visibilityCondition: { ...field?.visibilityCondition } || null,
        autoFillCondition: field?.autoFillCondition,
      };
    });

    return {
      page: guessPageName(section.name),
      type: section.type || "object",
      label: section.cards?.[0]?.headerFields?.find((i) => i.jsonPath === "ScreenHeading")?.value,
      description: section.cards?.[0]?.headerFields?.find((i) => i.jsonPath === "Description")?.value,
      actionLabel: section?.actionLabel || "",
      order: section.order,
      properties,
      navigateTo: section?.navigateTo || {},
       conditionalNavigateTo: section?.conditionalNavigateTo,
    };
  });
};

export function incrementVersion(version) {
  let [major, minor, patch] = version.split(".").map(Number);

  patch += 1;
  if (patch > 9) {
    patch = 0;
    minor += 1;
  }

  if (minor > 9) {
    minor = 0;
    major += 1;
  }

  return `${major}.${minor}.${patch}`;
}
