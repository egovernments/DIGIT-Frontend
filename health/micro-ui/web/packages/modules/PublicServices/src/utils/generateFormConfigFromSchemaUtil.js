// Importing field groups for different sections of the form
import { AddressFields } from "./templateConfig";
import { ApplicantFields } from "./templateConfig";
import { documentFields } from "./templateConfig";

// Main function to generate form config from service config, module, and service names
export const generateFormConfig = (config, module, service) => {
  // Extract fields from the first ServiceConfiguration object
  let serviceFields = config?.ServiceConfiguration?.[0]?.fields || [];

  // Utility to sort fields by their orderNumber property
  const sortByOrderNumber = (fields = []) =>
    [...fields].sort((a, b) => (a.orderNumber || 999) - (b.orderNumber || 999));


  //getting max length if user has mentioned in regex pattern
  function getMaxLengthFromRegex(regexString) {
    // Remove escape characters for processing
    const cleanRegex = regexString.replace(/\\/g, '');

    let totalLength = 0;

    // Match character classes like [6-9] - counts as 1 character
    const charClassRegex = /\[[^\]]+\]/g;
    const charClasses = cleanRegex.match(charClassRegex) || [];
    totalLength += charClasses.length;

    // Remove character classes to process the rest
    let remaining = cleanRegex;
    charClasses.forEach(charClass => {
      remaining = remaining.replace(charClass, '');
    });

    // Match digit patterns with quantifiers
    // \d{9} or d{9} after removing escapes
    const digitWithQuantifier = /d\{(\d+)(?:,(\d+))?\}/g;
    const digitMatches = [...remaining.matchAll(digitWithQuantifier)];

    for (const match of digitMatches) {
      if (match[2]) {
        // Has range {min,max}
        totalLength += parseInt(match[2], 10);
      } else {
        // Exact count {n}
        totalLength += parseInt(match[1], 10);
      }
    }

    // Match single \d without quantifiers
    const singleDigits = (remaining.match(/d(?!\{)/g) || []).length;
    totalLength += singleDigits;

    // Match literal characters (excluding anchors and special chars)
    const literalChars = remaining
      .replace(/[\^$+*?.|()]/g, '') // Remove regex special chars
      .replace(/d\{\d+(?:,\d+)?\}/g, '') // Remove already counted digit patterns
      .replace(/d/g, ''); // Remove already counted single digits

    totalLength += literalChars.length;

    return totalLength || null;
  }

  // Generates a single field configuration object
  const createField = (field) => {
    const rawPattern =
      field?.validation?.regex ||
      (typeof field?.validation?.pattern === "string"
        ? field.validation.pattern
        : null);
    // Don't evaluate visibilityExpression here - pass it through to be evaluated dynamically in the form
    return {
      type: field?.format === "MDMSDependentDropdown" ? "component" : (field.format || field.type),
      label: `${module}_${service}_${field?.name.toUpperCase()}`,
      isMandatory: !!field.required,
      // Keep disable at field level for FormComposerV2 to check
      disable: field.disable || !!field.valueExpression,
      ...(field?.component ? { component: field.component } : {}),
      // Keep visibilityExpression at field level for dynamic evaluation
      ...(field?.visibilityExpression ? { visibilityExpression: field.visibilityExpression } : {}),
      // Keep valueExpression at field level for dynamic value calculation
      ...(field?.valueExpression ? { valueExpression: field.valueExpression } : {}),
      // Keep readOnlyWhenAutoFilled at field level for configuring editability
      ...(field?.readOnlyWhenAutoFilled !== undefined ? { readOnlyWhenAutoFilled: field.readOnlyWhenAutoFilled } : {}),
      ...(field?.format === "MDMSDependentDropdown"
        ?
        {
          component: field?.format,
        }
        : {}),
      // Enable character count at field level when maxLength or minLength is provided
      ...(field?.maxLength || field?.minLength ? {
        charCount: true,
      } : {}),

      populators: {
        ...field?.populators, // Spread additional populators if provided
        name: field.name,
        optionsKey: "name",
        error: field?.validation?.message || "field is required",
        required: !!field.required,
        validation: {
          minlength: field?.minLength,
          maxlength: field?.maxLength,
          pattern: rawPattern || undefined,
          message: field?.validation?.message,
        },
        // Enable character count display when maxLength or minLength is provided
        ...(field?.maxLength || field?.minLength ? {
          charCount: true,
        } : {}),
        disable: field.disable || !!field.valueExpression,
        defaultValue: field.defaultValue,
        prefix: field.prefix,
        reference: field.reference,
        dependencies: field.dependencies,
        ...(field?.format === "mobileNumber" ? {
          maxLength: field?.maxLength || (field?.validation?.regex ? getMaxLengthFromRegex(field.validation.regex) : undefined),
          minLength: field?.minLength,
        } : {}),
        //hideSpan:true,


        //handle Dependent Fields data
        ...(field?.dependsOn && field?.schema
          ? {
            schemaCode: field.schema.split(".")[1],
            mdmsModule: field.schema.split(".")[0],
            //"optionKey": "code",
            //"valueKey": "code",
            parentKe: field?.parent,
            //"placeholder": "Select sub type",
            dependsOn: field.dependsOn
          }
          : {}),

        // Handle MDMS-based schema loading
        ...(field?.schema
          ? {
              mdmsConfig: {
                masterName: field.schema.split(".")[1] || "Master",
                moduleName: field.schema.split(".")[0] || "common-masters",
                localePrefix: `${field?.schema?.replace(/[^A-Za-z0-9]/g, "_")?.toUpperCase()}_${(field?.optionKey || "code")?.replace(/[^A-Za-z0-9]/g, "_")?.toUpperCase()}`,
              },
            }
          : {}),

        // Handle enum values if type is `enum`
        ...(field?.type === "enum"
          ? {
            options: field?.values?.map((ob) => ({
              code: ob.toUpperCase(),
              name: `${module}_${service}_${field.name.toUpperCase()}_${ob.toUpperCase()}`
            })),
          }
          : {}),

        // Add default option if defaultValue is present
        ...(field?.defaultValue
          ? {
            options: [
              {
                code: field.defaultValue,
                name: `TRADELICENSE_${field?.name.toUpperCase()}_${field.defaultValue}`,
              },
            ],
          }
          : {}),
      },
    };
  };

  let dynamicStep = 1; // Counter to track and increment step numbers for each form section

  // Create configuration for an object type field (child form)
  const createChildForm = (objectField) => {
    return {
      head: `${module}_${service}_${objectField.name.toUpperCase()}`,
      name: objectField.name,
      body: sortByOrderNumber(objectField.properties).map((subField) => createField(subField)),
      type: "childform",
      step: dynamicStep++,
    };
  };

  // Create configuration for an array type field (multi-entry child form)
  const createMultiChildForm = (arrayField) => {
    return {
      head: `${module}_${service}_${arrayField.name.toUpperCase()}`,
      name: arrayField.name,
      type: "multiChildForm",
      prefix: `${module}_${service}`,
      body: sortByOrderNumber(arrayField.items.properties).map((subField) => createField(subField)),
      step: dynamicStep++,
    };
  };

  // Create document upload form section
  const getDocumentFields = (documentField) => {
    return {
      head: `${module}_${service}_${documentField.head.toUpperCase()}`,
      type: "documents",
      body: [{
        ...documentField?.body?.[0],
        localePrefix: `${module.toUpperCase()}_${service.toUpperCase()}_${documentField.head.toUpperCase()}`
      }],
    };
  };

  // Create applicant form section from service configuration
  const createApplicantFormFromConfig = (applicantConfig) => {
    if (!applicantConfig || !applicantConfig.individual || !applicantConfig.individual.properties) {
      return {};
    }

    const applicantProperties = applicantConfig.individual.properties;

    // Determine if it should be a multi-child form based on maximum > 1
    const isMultiChild = false;

    if (isMultiChild) {
      return {
        head: `${module}_${service}_APPLICANT_DETAILS`,
        name: "applicantDetails",
        type: "multiChildForm",
        prefix: `${module}_${service}`,
        body: sortByOrderNumber(applicantProperties).map((field) => createField(field)),
        step: dynamicStep++,
        // Add applicant-specific configuration
        config: {
          maximum: applicantConfig.maximum,
          minimum: applicantConfig.minimum,
          allowLoggedInUser: applicantConfig.allowLoggedInUser,
          types: applicantConfig.types
        }
      };
    } else {
      return {
        head: `${module}_${service}_APPLICANT_DETAILS`,
        name: "applicantDetails",
        type: "childform",
        body: sortByOrderNumber(applicantProperties).map((field) => createField(field)),
        step: dynamicStep++,
        // Add applicant-specific configuration
        config: {
          maximum: applicantConfig.maximum,
          minimum: applicantConfig.minimum,
          allowLoggedInUser: applicantConfig.allowLoggedInUser,
          types: applicantConfig.types
        }
      };
    }
  };

  const basicFields = []; // Flat fields not nested in object/array
  const stepForms = [];   // Sections with child forms

  // Organize service fields into either flat fields or nested sections
  // Also extract address fields (type === "address") separately
  let addressFieldsFromConfig = null;

  sortByOrderNumber(serviceFields).forEach((field) => {
    if (field.type === "address") {
      // Store address fields from service config to use instead of template
      addressFieldsFromConfig = field;
    } else if (field.type === "object") {
      stepForms.push(createChildForm(field));
    } else if (field.type === "array") {
      stepForms.push(createMultiChildForm(field));
    } else {
      basicFields.push(createField(field));
    }
  });

  // Create address form section from service configuration
  const createAddressFormFromConfig = (addressConfig) => {
    if (!addressConfig || !addressConfig.properties) {
      return {};
    }

    const addressProperties = addressConfig.properties;

    return {
      head: `${module}_${service}_${addressConfig.name?.toUpperCase() || 'ADDRESS'}`,
      name: addressConfig.name || "address",
      type: "childform",
      body: sortByOrderNumber(addressProperties).map((field) => {
        // Handle hierarchyDropdown format specifically
        if (field.format === "hierarchyDropdown") {
          return {
            type: "component",
            component: "HierarchyDropdown",
            key: field.name,
            name: field.name,
            label: `${module}_${service}_${field.name?.toUpperCase()}`,
            disable: field.disable || false,
            isMandatory: !!field.required,
            populators: {
              name: field.name,
              hierarchyType: field.hierarchyType || "ADMIN",
              highestHierarchy: field.highestHierarchy || "",
              lowestHierarchy: field.lowestHierarchy || "LOCALITY",
              autoSelect: false,
              required: !!field.required
            }
          };
        }
        // Handle geolocation/locationPicker format
        else if (field.format === "geolocation" || field.format === "locationPicker") {
          return {
            type: "component",
            component: "MapWithInput",
            key: field.name,
            name: field.name,
            label: `${module}_${service}_${field.name?.toUpperCase()}`,
            disable: field.disable || false,
            isMandatory: !!field.required,
            populators: {
              name: field.name
            }
          };
        }
        // Use standard createField for other field types
        return createField(field);
      }),
      step: dynamicStep++,
    };
  };

  // Conditionally add address section - prefer service config over template
  let addressFieldsStep = {};

  if (addressFieldsFromConfig && config?.ServiceConfiguration?.[0]?.boundary) {
    addressFieldsStep = createAddressFormFromConfig(addressFieldsFromConfig);
  } else if (config?.ServiceConfiguration?.[0]?.boundary && AddressFields?.[0]) {
    addressFieldsStep = AddressFields[0].type === "object"
      ? createChildForm(AddressFields[0])
      : createMultiChildForm(AddressFields[0]);
  }

  // Create applicant section from service configuration instead of template
  let applicantFieldsStep = {};
  if (config?.ServiceConfiguration?.[0]?.applicant?.allowLoggedInUser == false) applicantFieldsStep = createApplicantFormFromConfig(config.ServiceConfiguration[0].applicant);
  //const applicantFieldsStep = !(config?.ServiceConfiguration?.[0]?.applicant?.allowLoggedInUser)  ? createApplicantFormFromConfig(config.ServiceConfiguration[0].applicant) : {}
  const steps = [];

  // Push flat field group as a top-level section if any exist
  if (basicFields.length > 0) {
    steps.push({
      head: `${module}_${service}_DETAILS`,
      body: basicFields,
      type: "form",
    });
  }

  // Conditionally add document section
  const documentform =
    config?.ServiceConfiguration?.[0]?.documents?.[0]?.actions?.[0]?.documents.length > 0 && documentFields?.[0]
      ? getDocumentFields(documentFields[0])
      : {};

  // Use uiforms for section ordering if available
  const uiforms = config?.ServiceConfigurationDrafts?.uiforms?.[0];

  if (uiforms && uiforms.formConfig && uiforms.formConfig.screens && uiforms.formConfig.screens.length > 0) {
    const orderedSections = [];
    const screens = uiforms.formConfig.screens;

    // Create a map of section types to their configurations
    const sectionMap = {
      'custom': [...steps, ...stepForms],
      'applicant': applicantFieldsStep,
      'address': addressFieldsStep,
      'document': documentform,
    };

    // Iterate through cards in uiforms to determine ordering
    screens.forEach(screen => {
      screen.cards?.forEach(card => {
        const sectionType = card.sectionType;
        const headerValue = card.headerFields?.find(hf => hf.label === "SCREEN_HEADING")?.value;

        // Match sections based on sectionType or header value
        if (sectionType === 'applicant' && Object.keys(sectionMap.applicant).length > 0) {
          if (!orderedSections.includes(sectionMap.applicant)) {
            orderedSections.push(sectionMap.applicant);
          }
        } else if (sectionType === 'address' && Object.keys(sectionMap.address).length > 0) {
          if (!orderedSections.includes(sectionMap.address)) {
            orderedSections.push(sectionMap.address);
          }
        } else if (sectionType === 'document' && Object.keys(sectionMap.document).length > 0) {
          if (!orderedSections.includes(sectionMap.document)) {
            orderedSections.push(sectionMap.document);
          }
        } else if (!sectionType && headerValue === 'Address Details' && Object.keys(sectionMap.address).length > 0) {
          // Fallback for address section without sectionType - match by header value
          if (!orderedSections.includes(sectionMap.address)) {
            orderedSections.push(sectionMap.address);
          }
        } else {
          // For custom sections, try to match by header value
          const matchedCustomSection = sectionMap.custom.find(section => {
            const sectionHead = section.head?.replace(`${module}_${service}_`, '');
            // Normalize by removing all spaces, underscores, hyphens for comparison
            const normalizedSectionHead = sectionHead?.replace(/[\s_-]/g, '').toUpperCase();
            const normalizedSectionName = section.name?.replace(/[\s_-]/g, '').toUpperCase();
            const normalizedCardHeader = headerValue?.replace(/[\s_-]/g, '').toUpperCase();

            return normalizedSectionHead === normalizedCardHeader ||
                   normalizedSectionName === normalizedCardHeader ||
                   section.name === card.header;
          });

          if (matchedCustomSection && !orderedSections.includes(matchedCustomSection)) {
            orderedSections.push(matchedCustomSection);
          }
        }
      });
    });

    // Add any remaining custom sections that weren't matched (to avoid losing sections)
    sectionMap.custom.forEach(customSection => {
      if (!orderedSections.includes(customSection)) {
        orderedSections.push(customSection);
      }
    });

    // Filter out empty objects
    return orderedSections.filter(section => Object.keys(section).length > 0);
  }

  // Final return — combine all dynamic sections (fallback to hardcoded order if no uiforms)
  return [...steps, ...stepForms, applicantFieldsStep, addressFieldsStep, documentform];
};
