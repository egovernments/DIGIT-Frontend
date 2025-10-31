/**
 * Transform MDMS data structure to App Config structure
 * @param {Array} fullData - Array of MDMS screen configurations
 * @returns {Array} Array of app config objects
 */
export const transformMdmsToAppConfig = (fullData) => {
  if (!fullData || !Array.isArray(fullData) || fullData.length === 0) {
    throw new Error("Invalid fullData: Expected non-empty array");
  }

  // Separate templates and forms
  const templates = [];
  const forms = {};

  fullData.forEach(item => {
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
          version: item.version,
          disabled: item.disabled || false,
          isSelected: item.isSelected !== undefined ? item.isSelected : true,
          screenType: "FORM",
          pages: [],
          wrapperConfig: item.wrapperConfig
        };
      }
      // Add page to form
      forms[flowName].pages.push(transformFormPage(item));

      // Store onAction from the last page (or first one that has it)
      if (item.onAction && (!forms[flowName].onAction || item.order >= forms[flowName].lastOrder)) {
        forms[flowName].onAction = item.onAction;
        forms[flowName].lastOrder = item.order;
      }
    }
  });

  // Clean up temporary fields
  Object.values(forms).forEach(form => {
    delete form.lastOrder;
  });

  // Combine templates and forms
  const result = [
    ...templates,
    ...Object.values(forms)
  ];

  return result;
};

/**
 * Transform a template screen
 */
const transformTemplate = (screenData) => {
  const template = {
    body: screenData.body || []
  };

  // Add all relevant fields from screenData
  if (screenData.flow) template.name = screenData.flow;
  if (screenData.page) template.name = screenData.page; // page takes precedence if both exist
  if (screenData.heading) template.heading = screenData.heading;
  if (screenData.screenType) template.screenType = screenData.screenType;
  if (screenData.description) template.description = screenData.description;
  if (screenData.footer) template.footer = screenData.footer;
  if (screenData.header) template.header = screenData.header;
  if (screenData.navigateTo !== undefined) template.navigateTo = screenData.navigateTo;
  if (screenData.initActions) template.initActions = screenData.initActions;
  if (screenData.wrapperConfig) template.wrapperConfig = screenData.wrapperConfig;

  // Default screenType to TEMPLATE if not set
  if (!template.screenType) {
    template.screenType = "TEMPLATE";
  }

  return template;
};

/**
 * Transform a form page from MDMS format
 */
const transformFormPage = (pageData) => {
  const page = {
    page: pageData.page,
    type: pageData.type,
    label: pageData.heading,
    order: pageData.order,
    description: pageData.description,
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

  return page;
};

/**
 * Transform form properties from body structure
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

        // Add optional fields
        if (field.enums) property.enums = field.enums;
        if (field.schemaCode) property.schemaCode = field.schemaCode;
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

  // Handle required validation
  if (field.required) {
    validations.push({
      type: "required",
      value: true,
      message: field["required.message"] || "Required field cannot be empty"
    });
  }

  // Handle minLength validation
  if (field.minLength) {
    validations.push({
      type: "minLength",
      value: field.minLength,
      message: field["minLength.message"] || `Minimum length is ${field.minLength}`
    });
  }

  // Handle maxLength validation
  if (field.maxLength) {
    validations.push({
      type: "maxLength",
      value: field.maxLength,
      message: field["maxLength.message"] || `Maximum length is ${field.maxLength}`
    });
  }

  // Handle min validation
  if (field.min !== undefined) {
    validations.push({
      type: "min",
      value: field.min,
      message: field["min.message"] || `Minimum value is ${field.min}`
    });
  }

  // Handle max validation
  if (field.max !== undefined) {
    validations.push({
      type: "max",
      value: field.max,
      message: field["max.message"] || `Maximum value is ${field.max}`
    });
  }

  return validations;
};

export default transformMdmsToAppConfig;
