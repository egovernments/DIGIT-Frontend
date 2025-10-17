/**
 * Transform single MDMS screen data to App Config flow structure
 * @param {Object} screenData - Single MDMS screen configuration
 * @returns {Object} Transformed flow object
 */
const transformSingleScreen = (screenData) => {
  if (screenData.type === "template") {
    return {
      screenType: "TEMPLATE",
      name: screenData.page,
      heading: screenData.heading,
      description: screenData.description,
      body: transformTemplateBody(screenData.body),
      footer: screenData.footer || [],
      ...(screenData.navigateTo && { navigateTo: screenData.navigateTo })
    };
  } else if (screenData.type === "object") {
    return {
      screenType: "FORM",
      name: screenData.flow,
      project: screenData.project,
      version: screenData.version,
      disabled: false,
      isSelected: true,
      pages: [{
        page: screenData.page,
        type: screenData.type,
        label: screenData.heading,
        order: screenData.order,
        description: screenData.description,
        properties: transformFormProperties(screenData.body),
        ...(screenData.navigateTo && { navigateTo: screenData.navigateTo }),
        ...(screenData.footer && screenData.footer.length > 0 && { actionLabel: screenData.footer[0].label })
      }],
      ...(screenData.footer && screenData.footer.length > 0 && {
        onAction: extractOnActions(screenData.footer)
      })
    };
  }
};

/**
 * Transform MDMS data structure to App Config structure
 * @param {Array} fullData - Array of MDMS screen configurations
 * @returns {Array} Array of app config objects (one per unique flow)
 */
export const transformMdmsToAppConfig = (fullData) => {
  if (!fullData || !Array.isArray(fullData) || fullData.length === 0) {
    throw new Error("Invalid fullData: Expected non-empty array");
  }

  // Group data by flow
  const flowGroups = {};

  fullData.forEach(item => {
    const flowName = item.flow || "DEFAULT";
    if (!flowGroups[flowName]) {
      flowGroups[flowName] = {
        project: item.project,
        version: item.version,
        templates: [],
        formPages: []
      };
    }

    if (item.type === "template") {
      flowGroups[flowName].templates.push(item);
    } else if (item.type === "object") {
      flowGroups[flowName].formPages.push(item);
    }
  });

  // Create app config for each flow
  const appConfigs = [];

  Object.entries(flowGroups).forEach(([flowName, flowData]) => {
    const { project, version, templates, formPages } = flowData;

    // Sort by order
    templates.sort((a, b) => (a.order || 0) - (b.order || 0));
    formPages.sort((a, b) => (a.order || 0) - (b.order || 0));

    const flows = [];

    // Add template screens
    templates.forEach(template => {
      flows.push(transformSingleScreen(template));
    });

    // Add form screen if form pages exist
    if (formPages.length > 0) {
      flows.push({
        screenType: "FORM",
        name: flowName,
        project: project,
        version: version,
        disabled: false,
        isSelected: true,
        pages: formPages.map(page => ({
          page: page.page,
          type: page.type,
          label: page.heading,
          order: page.order,
          description: page.description,
          properties: transformFormProperties(page.body),
          ...(page.navigateTo && { navigateTo: page.navigateTo }),
          ...(page.footer && page.footer.length > 0 && { actionLabel: page.footer[0].label })
        })),
        ...(formPages[formPages.length - 1]?.footer && {
          onAction: extractOnActions(formPages[formPages.length - 1].footer)
        })
      });
    }

    appConfigs.push({
      name: `${flowName}-${project}`,
      initialPage: templates[0]?.page || formPages[0]?.page,
      project: project,
      version: version,
      disabled: false,
      isSelected: true,
      flows: flows
    });
  });

  return appConfigs;
};

/**
 * Transform template body fields
 */
const transformTemplateBody = (body) => {
  if (!body || !Array.isArray(body)) return [];

  const transformedBody = [];

  body.forEach(bodySection => {
    if (bodySection.fields && Array.isArray(bodySection.fields)) {
      bodySection.fields.forEach(field => {
        const transformed = {
          format: field.format,
          label: field.label,
          fieldName: field.fieldName,
          order: field.order
        };

        if (field.type && field.type !== "template") {
          transformed.type = field.type;
        }
        if (field.value !== undefined && field.value !== "") {
          transformed.value = field.value;
        }
        if (field.hidden !== undefined) {
          transformed.hidden = field.hidden;
        }
        if (field.readOnly !== undefined) {
          transformed.readOnly = field.readOnly;
        }
        if (field.required !== undefined) {
          transformed.required = field.required;
        }
        if (field.enums) {
          transformed.enums = field.enums;
        }
        if (field.tooltip) {
          transformed.tooltip = field.tooltip;
        }
        if (field.helpText) {
          transformed.helpText = field.helpText;
        }
        if (field.infoText) {
          transformed.infoText = field.infoText;
        }
        if (field.errorMessage) {
          transformed.errorMessage = field.errorMessage;
        }
        if (field["required.message"]) {
          transformed.requiredMessage = field["required.message"];
        }
        if (field.systemDate !== undefined) {
          transformed.systemDate = field.systemDate;
        }
        if (field.schemaCode) {
          transformed.schemaCode = field.schemaCode;
        }

        transformedBody.push(transformed);
      });
    }
  });

  return transformedBody;
};

/**
 * Transform form properties from body
 */
const transformFormProperties = (body) => {
  if (!body || !Array.isArray(body)) return [];

  const properties = [];

  body.forEach(bodySection => {
    if (bodySection.fields && Array.isArray(bodySection.fields)) {
      bodySection.fields.forEach(field => {
        const property = {
          type: field.type,
          label: field.label,
          order: field.order,
          value: field.value !== undefined ? field.value : "",
          format: field.format,
          hidden: field.hidden !== undefined ? field.hidden : false,
          tooltip: field.tooltip || "",
          helpText: field.helpText || "",
          infoText: field.infoText || "",
          readOnly: field.readOnly !== undefined ? field.readOnly : false,
          fieldName: field.fieldName,
          deleteFlag: field.deleteFlag !== undefined ? field.deleteFlag : false,
          innerLabel: field.innerLabel || "",
          systemDate: field.systemDate !== undefined ? field.systemDate : false,
          validations: buildValidations(field),
          errorMessage: field.errorMessage || "",
          isMultiSelect: field.isMultiSelect !== undefined ? field.isMultiSelect : false
        };

        if (field.enums) {
          property.enums = field.enums;
        }
        if (field.schemaCode) {
          property.schemaCode = field.schemaCode;
        }

        properties.push(property);
      });
    }
  });

  return properties;
};

/**
 * Build validations array from field
 */
const buildValidations = (field) => {
  const validations = [];

  if (field.required) {
    validations.push({
      type: "required",
      value: true,
      message: field["required.message"] || "Required field cannot be empty"
    });
  }

  return validations;
};

/**
 * Extract onAction from footer
 */
const extractOnActions = (footer) => {
  if (!footer || !Array.isArray(footer)) return [];

  const actions = [];
  footer.forEach(item => {
    if (item.onAction && Array.isArray(item.onAction)) {
      actions.push(...item.onAction);
    }
  });

  return actions;
};

export default transformMdmsToAppConfig;
