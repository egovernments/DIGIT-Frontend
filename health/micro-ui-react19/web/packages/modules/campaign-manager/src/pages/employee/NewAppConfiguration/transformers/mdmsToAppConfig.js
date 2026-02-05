/**
 * Transform MDMS data structure to App Config structure
 * @param {Array} fullData - Array of MDMS screen configurations
 * @returns {Array} Array of app config objects
 */

//Final TransformaTION
export const transformMdmsToAppConfig = (fullData, version, existingFlows) => {
  if (!fullData || !Array.isArray(fullData) || fullData.length === 0) {
    throw new Error("Invalid fullData: Expected non-empty array");
  }

  // Separate templates and forms
  const templates = [];
  const forms = {};

  fullData.forEach((item) => {
    // Check if it's a template (has screenType: TEMPLATE or type: template)
    const isTemplate = item.screenType === "TEMPLATE" || item.type === "template" || (!item.type && !item.flow);

    if (isTemplate) {
      // It's a template screen
      templates.push(transformTemplate(item));
    } else if (item.type === "object" && item.flow) {
      // It's a form page - group pages by flow name
      const flowName = item.flow;
      if (!forms[flowName]) {
        forms[flowName] = {
          name: flowName,
          project: item.project,
          version: version + 1,
          disabled: item.disabled || false,
          isSelected: item.isSelected !== undefined ? item.isSelected : true,
          screenType: "FORM",
          pages: [],
          onAction: item.onAction,
          order: existingFlows?.find(f => f.name === flowName)?.order || item.order || 0,
          initActions: existingFlows?.find(f => f.name === flowName)?.initActions || [],
          wrapperConfig: existingFlows?.find(f => f.name === flowName)?.wrapperConfig || {},
          scrollListener: existingFlows?.find(f => f.name === flowName)?.scrollListener || {},
          summary: item.summary || false,
        };
      }
      // Add page to form
      forms[flowName].pages.push(transformFormPage(item));

      // Store onAction from the last page (or first one that has it)
      if (item.order >= forms[flowName].lastOrder) {
        forms[flowName].lastOrder = item.order;
      }
    }
  });

  // Process forms: Update onAction based on conditionalNavigateTo from last page
  Object.values(forms).forEach((form) => {
    // Find the last page (highest order)
    const lastPage = form.pages.reduce((max, page) => {
      return (page.order > max.order) ? page : max;
    }, form.pages[0]);

    // Check if last page has conditionalNavigationProperties with targetPages
    if (
      lastPage &&
      lastPage.conditionalNavigationProperties &&
      lastPage.conditionalNavigationProperties.targetPages &&
      lastPage.conditionalNavigationProperties.targetPages.length > 0
    ) {
      // Create a map of name+type -> condition from conditionalNavigateTo
      const conditionMap = new Map();

      if (lastPage.conditionalNavigateTo && Array.isArray(lastPage.conditionalNavigateTo)) {
        lastPage.conditionalNavigateTo.forEach((navItem) => {
          const key = `${navItem.navigateTo.name}|${navItem.navigateTo.type?.toLowerCase() || "form"}`;
          conditionMap.set(key, navItem.condition);
        });
      }

      // Update form's onAction based on the condition map
      if (form.onAction && Array.isArray(form.onAction)) {
        form.onAction = form.onAction.map((actionItem) => {
          if (!actionItem.actions || !Array.isArray(actionItem.actions)) {
            return actionItem;
          }

          // Skip if this action doesn't have a condition - don't add one
          if (!actionItem.condition) {
            return actionItem;
          }

          // Skip if this action already has DEFAULT condition - don't update it
          if (actionItem?.condition?.expression === "DEFAULT") {
            return actionItem;
          }

          if (actionItem?.condition?.type === "custom") {
            return actionItem;
          }

          // Find NAVIGATION action
          const navigationAction = actionItem?.actions.find(
            (action) => action.actionType === "NAVIGATION"
          );

          if (navigationAction && navigationAction.properties) {
            const { name, type } = navigationAction.properties;
            const key = `${name}|${type?.toLowerCase() || "form"}`;

            // Check if we have a condition for this navigation target
            if (conditionMap.has(key)) {
              // Update the condition with the one from conditionalNavigateTo
              return {
                ...actionItem,
                condition: {
                  expression: conditionMap.get(key)
                }
              };
            }
          else {
              // Navigation target exists but not in conditionalNavigateTo - set as NOT_CONFIGURED
              return {
                ...actionItem,
                condition: {
                  expression: "NOT_CONFIGURED"
                }
              };
            }
          }

          // No NAVIGATION action found, return original
          return actionItem;
        });
      }

      // Remove conditionalNavigateTo and conditionalNavigationProperties from last page
      delete lastPage.conditionalNavigateTo;
      delete lastPage.conditionalNavigationProperties;
    }
  });

  // Clean up temporary fields
  Object.values(forms).forEach((form) => {
    delete form.lastOrder;
  });

  // Combine templates and forms
  const result = [...templates, ...Object.values(forms)];

  return result;
};

/**
 * Transform a template screen
 */
const transformTemplate = (screenData) => {
  const transformedFields = (screenData.body?.[0]?.fields || []).map((field) => {
    if (field.format === "panelCard") {
      return {
        ...field,

        ...(field?.primaryAction && field?.primaryActionLabel
          ? {
              primaryAction: {
                ...field.primaryAction,
                label: field.primaryActionLabel,
              },
            }
          : {}),

        ...(field?.secondaryAction && field?.secondaryActionLabel
          ? {
              secondaryAction: {
                ...field.secondaryAction,
                label: field.secondaryActionLabel,
              },
            }
          : {}),
      };
    }

    if (field.format === "scanner" || field.format === "qrscanner") {
      const validations = [];

      validations.push({
        type: "scanLimit",
        value: field?.scanLimit || 1,
        message: field["scanLimit.message"],
      });

      validations.push({
        type: "isGS1",
        value: field?.isGS1 || false,
      });

      if (field["pattern"] !== undefined && field["pattern"] !== null && field["pattern"] !== "") {
        validations.push({
          type: "pattern",
          value: field?.pattern,
          message: field["pattern.message"],
        });
      }

      return {
        ...field,
        validations,
      };
    }

    // Handle isMdms toggle: if true, use schemaCode and clear enums; if false, use dropDownOptions as enums
    if (field.isMdms === true && field.schemaCode) {
      field.schemaCode = field.schemaCode;
      field.enums = null; // Clear enums when using MDMS
    } else {
      // isMdms is false or not set - use dropDownOptions as enums
      if (field.dropDownOptions) {
        field.enums = field.dropDownOptions;
      }
      // Clear schemaCode when not using MDMS
      field.schemaCode = null;
    }

    return field;
  });

  const template = {
    body: transformedFields || [],
  };

  // Add all relevant fields from screenData
  if (screenData.flow) template.name = screenData.flow;
  if (screenData.page) template.name = screenData.page; // page takes precedence if both exist
  if (screenData.heading) template.heading = screenData.heading;
  if (screenData.screenType) template.screenType = screenData.screenType;
  if (screenData.description) template.description = screenData.description;
  if (screenData.footer) template.footer = transformFooter(screenData.footer);
  if (screenData.header) template.header = screenData.header;
  if (screenData.navigateTo !== undefined) template.navigateTo = screenData.navigateTo;
  if (screenData.initActions) template.initActions = screenData.initActions;
  if (screenData.wrapperConfig) template.wrapperConfig = screenData.wrapperConfig;
  if(screenData.scrollListener) template.scrollListener = screenData.scrollListener;

  // Default screenType to TEMPLATE if not set
  if (!template.screenType) {
    template.screenType = "TEMPLATE";
  }

  template.preventScreenCapture = screenData.preventScreenCapture || false;
  template.submitCondition = screenData.submitCondition || null;
  template.order = screenData.order;

  return template;
};

const transformFooter = (footer) => {
  if (!footer || !Array.isArray(footer)) return [];

  const updatedFooter = footer.map((foo) => {
    if (foo.format === "scanner" || foo.format === "qrscanner") {
      const validations = [];

      validations.push({
        type: "scanLimit",
        value: foo.scanLimit || 1,
        message: foo["scanLimit.message"],
      });

      validations.push({
        type: "isGS1",
        value: foo.isGS1 || false,
      });

      if (foo["pattern.message"] !== undefined && foo["pattern.message"] !== null && foo["pattern.message"] !== "") {
        validations.push({
          type: "pattern",
          value: foo.pattern,
          message: foo["pattern.message"],
        });
      }

      return {
        ...foo,
        validations,
      };
    }
    return foo;
  });

  return updatedFooter;
};

/**
 * Transform a form page from MDMS format
 */
const transformFormPage = (pageData) => {
  const page = {
    ...pageData,
    body: null,
    page: pageData.page,
    type: pageData.type,
    label: pageData.heading,
    order: pageData.order,
    description: pageData.description,
    order: pageData.order,
    preventScreenCapture: pageData.preventScreenCapture || false,
    submitCondition: pageData.submitCondition || null,
    properties: transformFormProperties(pageData.body)

  };

  // Add navigateTo if exists
  if (pageData.navigateTo) {
    page.navigateTo = pageData.navigateTo;
  }

  // Add actionLabel from footer if exists
  if (pageData.footer && Array.isArray(pageData.footer) && pageData.footer.length > 0) {
    page.actionLabel = pageData.footer[0].label;
  }

  // Add showAlertPopUp if exists
  if (pageData.showAlertPopUp) {
    page.showAlertPopUp = pageData.showAlertPopUp;
  }

  // Add conditionalNavigateTo if exists
  if (pageData.conditionalNavigateTo) {
    page.conditionalNavigateTo = pageData.conditionalNavigateTo;
  }

  // Add conditionalNavigationProperties if exists
  if (pageData.conditionalNavigationProperties) {
    page.conditionalNavigationProperties = pageData.conditionalNavigationProperties;
  }
  return page;
};

/**
 * Transform form properties from body structure
 */
const transformFormProperties = (body) => {
  if (!body || !Array.isArray(body)) return [];

  const properties = [];

  body.forEach((bodySection) => {
    if (bodySection.fields && Array.isArray(bodySection.fields)) {
      bodySection.fields.forEach((field) => {
        // Destructure to exclude validations from spread (we build our own)
        const { validations: _existingValidations, ...restField } = field;
        const property = {
          // Spread restField FIRST so explicit transformations below take precedence
          ...restField,
          type: field.type,
          label: field.label,
          order: field.order,
          value: field.value !== undefined ? field.value : "",
          format: field.format,
          hidden: field.hidden !== undefined ? field.hidden : false,
          tooltip: typeof field.tooltip === "string" ? field.tooltip : "",
          helpText: typeof field.helpText === "string" ? field.helpText : "",
          infoText: typeof field.infoText === "string" ? field.infoText : "",
          readOnly: field.readOnly !== undefined ? field.readOnly : false,
          fieldName: field?.fieldName || field?.jsonPath,
          deleteFlag: field.deleteFlag !== undefined ? field.deleteFlag : false,
          innerLabel: typeof field.innerLabel === "string" ? field.innerLabel : "",
          systemDate: field.systemDate !== undefined ? field.systemDate : false,
          validations: buildValidations(field),
          errorMessage: field.errorMessage || "",
          mandatory: field?.mandatory ? field?.mandatory : false,
        };


        // Handle isMdms toggle: if true, use schemaCode and clear enums; if false, use dropDownOptions as enums
        if (field.isMdms === true && field.schemaCode) {
          property.schemaCode = field.schemaCode;
          property.enums = null; // Clear enums when using MDMS
        } else {
          // isMdms is false or not set - use dropDownOptions as enums
          if (field.dropDownOptions) {
            property.enums = field.dropDownOptions;
          }
          // Clear schemaCode when not using MDMS
          property.schemaCode = null;
        }
        if (field.includeInForm !== undefined) property.includeInForm = field.includeInForm;
        if (field.includeInSummary !== undefined) property.includeInSummary = field.includeInSummary;
        if (field.visibilityCondition) property.visibilityCondition = field.visibilityCondition;

        properties.push(property);
      });
    }
  });

  return properties;
};

/**
 * Build validations array from field properties
 */
const buildValidations = (field) => {
  const validations = [];

  // Configurable validation types that are built from field properties
  const configurableValidationTypes = [
    "required",
    "minLength",
    "maxLength",
    "min",
    "max",
    "isGS1",
    "scanLimit",
    "minSearchChars",
    "minAge",
    "maxAge",
    "startDate",
    "endDate",
    "pattern"
  ];

  // Handle required validation
  if (field.required) {
    validations.push({
      type: "required",
      value: true,
      message: field["required.message"] || "Required field cannot be empty",
    });
  }

  // Handle minLength validation
  if (field.minLength) {
    validations.push({
      type: "minLength",
      value: field.minLength,
      message: field["minLength.message"] || `Minimum length is ${field.minLength}`,
    });
  }

  // Handle maxLength validation
  if (field.maxLength) {
    validations.push({
      type: "maxLength",
      value: field.maxLength,
      message: field["maxLength.message"] || `Maximum length is ${field.maxLength}`,
    });
  }

  // Handle min validation
  if (field.min !== undefined) {
    validations.push({
      type: "min",
      value: field.min,
      message: field["min.message"] || `Minimum value is ${field.min}`,
    });
  }

  // Handle max validation
  if (field.max !== undefined) {
    validations.push({
      type: "max",
      value: field.max,
      message: field["max.message"] || `Maximum value is ${field.max}`,
    });
  }

  if (field.isGS1) {
    validations.push({
      type: "isGS1",
      value: field.isGS1 === true ? true : false,
    });
  }

  if (field.scanLimit) {
    validations.push({
      type: "scanLimit",
      value: field?.scanLimit,
      message: field["scanLimit.message"],
    });
  }

    if (field.minSearchChars) {
    validations.push({
      type: "minSearchChars",
      value: field?.minSearchChars,
      message: field["minSearchChars.message"],
    });
  }

  if(field.pattern){
    validations.push({
      type: "pattern",
      value: field?.pattern,
      message: field["pattern.message"],
    })
  }

  // Handle grouped validations (range, lengthRange, dateRange)
  const validationGroups = {
    range: ["min", "max"],
    lengthRange: ["minLength", "maxLength"],
    dateRange: ["startDate", "endDate"],
    ageRange: ["minAge", "maxAge"],
  };

  Object.entries(validationGroups).forEach(([groupName, types]) => {
    if (field[groupName] && typeof field[groupName] === "object") {
      const groupData = field[groupName];
      types.forEach((type) => {
        if (groupData[type] !== undefined) {
          validations.push({
            type: type,
            value: groupData[type],
            message: groupData.errorMessage || "",
          });
        }
      });
    }
  });

  // Retain non-configurable validations from field.validations (e.g., notEqualTo, pattern, custom validations)
  if (Array.isArray(field.validations)) {
    field.validations.forEach((validation) => {
      if (validation?.type && !configurableValidationTypes.includes(validation.type)) {
        // This validation type is not configurable, retain it as-is
        validations.push(validation);
      }
    });
  }

  return validations;
};

export default transformMdmsToAppConfig;