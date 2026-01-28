/**
 * Utility function to transform form configuration data into service configuration format
 * This function converts the form builder format to the format expected by PublicServices module
 */

export const transformFormToServiceConfig = (formConfig) => {
  if (!formConfig || !formConfig.cards) {
    return [];
  }

  const properties = [];
  let orderNumber = 1;

  formConfig.cards.forEach((card) => {
    if (card.fields && Array.isArray(card.fields)) {
      card.fields.forEach((field) => {
        if (!field || !field.type) {
          return;
        }

        const transformedField = transformField(field, orderNumber++);
        if (transformedField) {
          properties.push(transformedField);
        }
      });
    }
  });

  return properties;
};

/**
 * Transform individual field from form builder format to service configuration format
 */
const transformField = (field, orderNumber) => {
  const baseField = {
    name: field.label?.replace(/\s+/g, '') || field.jsonPath || `field_${orderNumber}`,
    label: field.label || `Field ${orderNumber}`,
    required: field.required || false,
    orderNumber: orderNumber,
    disable: field.readOnly || false,
    defaultValue: field.defaultValue || field.value || "",
    helpText: field.helpText || "",
    tooltip: field.tooltip || "",
    errorMessage: field.errorMessage || ""
  };

  // Handle different field types
  switch (field.type) {
    case "textInput":
    case "text":
      return {
        ...baseField,
        type: "string",
        format: "text",
        maxLength: field.maxLength || 128,
        minLength: field.minLength || 2,
        validation: field.validation || {
          regex: "^[A-Za-z0-9 ]+$",
          message: "Only letters and numbers allowed"
        }
      };

    case "number":
      return {
        ...baseField,
        type: "integer",
        format: "number",
        validation: field.validation || {
          regex: "^[0-9]+$",
          message: "Only numbers allowed"
        }
      };

    case "datePicker":
    case "date":
      return {
        ...baseField,
        type: "date",
        format: "date"
      };

    case "mobileNumber":
      return {
        ...baseField,
        type: "mobileNumber",
        format: "mobileNumber",
        maxLength: field.maxLength || 256,
        minLength: field.minLength || 0,
        prefix: field.prefix || "91",
        validation: field.validation || {
          regex: "^[6-9]\\d{9}$",
          message: "Please enter a valid mobile number"
        }
      };

    case "dropdown":
      // Check if it's MDMS dropdown or enum dropdown
      if (field.schema && field.reference === "mdms") {
        // MDMS dropdown
        return {
          ...baseField,
          type: "string",
          format: "radioordropdown",
          schema: field.schema,
          reference: "mdms"
        };
      } else if (field.isBoundaryData) {
        // Boundary data dropdown
        return {
          ...baseField,
          type: "string",
          format: "radioordropdown",
          schema: "common-masters.BoundaryType",
          reference: "mdms"
        };
      } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
        // Enum dropdown
        const values = field.dropDownOptions.map(option => 
          option.value || option.code || option.name
        );
        return {
          ...baseField,
          type: "enum",
          format: "radioordropdown",
          values: values
        };
      } else {
        // Default dropdown
        return {
          ...baseField,
          type: "string",
          format: "radioordropdown"
        };
      }

    case "radio":
      // Check if it's MDMS radio or enum radio
      if (field.schema) {
        // MDMS radio
        return {
          ...baseField,
          type: "string",
          format: "radio",
          schema: field.schema,
          reference: "mdms"
        };
      } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
        // Enum radio
        const values = field.dropDownOptions.map(option => 
          option.value || option.code || option.name
        );
        return {
          ...baseField,
          type: "enum",
          format: "radio",
          values: values
        };
      } else {
        // Default radio
        return {
          ...baseField,
          type: "string",
          format: "radio"
        };
      }

    case "textarea":
      return {
        ...baseField,
        type: "string",
        format: "textarea",
        maxLength: field.maxLength || 1000,
        minLength: field.minLength || 0
      };

    case "checkbox":
      return {
        ...baseField,
        type: "boolean",
        format: "checkbox"
      };

    case "fileUpload":
      return {
        ...baseField,
        type: "string",
        format: "file",
        maxSizeInMB: field.maxSizeInMB || 5,
        allowedFileTypes: field.allowedFileTypes || ["pdf", "doc", "docx", "jpg", "png"]
      };

    case "amount":
      return {
        ...baseField,
        type: "number",
        format: "amount",
        validation: field.validation || {
          regex: "^[0-9]+(\.[0-9]{1,2})?$",
          message: "Please enter a valid amount"
        }
      };

    case "email":
      return {
        ...baseField,
        type: "string",
        format: "email",
        validation: field.validation || {
          regex: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
          message: "invalid email"
        }
      };

    case "password":
      return {
        ...baseField,
        type: "string",
        format: "password",
        maxLength: field.maxLength || 128,
        minLength: field.minLength || 6
      };

    case "time":
      return {
        ...baseField,
        type: "string",
        format: "time"
      };

    case "geolocation":
      return {
        ...baseField,
        type: "string",
        format: "geolocation"
      };

    case "search":
      return {
        ...baseField,
        type: "string",
        format: "search"
      };

    case "numeric":
      return {
        ...baseField,
        type: "integer",
        format: "numeric",
        validation: field.validation || {
          regex: "^[0-9]+$",
          message: "Only numbers allowed"
        }
      };

    default:
      // Default fallback for unknown field types
      return {
        ...baseField,
        type: "string",
        format: "text"
      };
  }
};

/**
 * Transform form configuration to service configuration fields structure
 * This creates the complete fields array structure expected by service configuration
 */
export const transformFormToServiceFields = (formConfig, sectionName = "ServiceDetails") => {
  const properties = transformFormToServiceConfig(formConfig);
  
  if (properties.length === 0) {
    return [];
  }

  return [
    {
      name: sectionName,
      type: "object",
      label: sectionName,
      properties: properties
    }
  ];
};

/**
 * Helper function to create a complete service configuration with form fields
 */
export const createServiceConfigWithFormFields = (formConfig, module, service, additionalConfig = {}) => {
  const fields = transformFormToServiceFields(formConfig);
  
  return {
    module: module,
    service: service,
    enabled: ["citizen", "employee"],
    fields: fields,
    ...additionalConfig
  };
};

/**
 * Helper function to validate form configuration before transformation
 */
export const validateFormConfig = (formConfig) => {
  const errors = [];

  if (!formConfig) {
    errors.push("Form configuration is required");
    return errors;
  }

  if (!formConfig.cards || !Array.isArray(formConfig.cards)) {
    errors.push("Form configuration must have a cards array");
    return errors;
  }

  formConfig.cards.forEach((card, cardIndex) => {
    if (!card.fields || !Array.isArray(card.fields)) {
      errors.push(`Card ${cardIndex + 1} must have a fields array`);
      return;
    }

    card.fields.forEach((field, fieldIndex) => {
      if (!field.type) {
        errors.push(`Field ${fieldIndex + 1} in card ${cardIndex + 1} must have a type`);
      }
      if (!field.label) {
        errors.push(`Field ${fieldIndex + 1} in card ${cardIndex + 1} must have a label`);
      }
    });
  });

  return errors;
};

export default {
  transformFormToServiceConfig,
  transformFormToServiceFields,
  createServiceConfigWithFormFields,
  validateFormConfig
}; 