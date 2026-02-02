/**
 * Transforms MDMS data structure to App Config format
 * @param {Object} mdmsData - The MDMS data object containing flows
 * @returns {Array} - Transformed app config array
 */

//iNTITIAL TRANSFORMATION
export const transformMdmsToAppConfig = (mdmsData) => {
  if (!mdmsData?.data?.flows) {
    console.error("Invalid MDMS data structure");
    return [];
  }

  const appConfig = [];
  const flows = mdmsData.data.flows;
  const moduleName = mdmsData.data.name; // Overall module name like "REGISTRATION-DELIVERY"

  flows.forEach((flow, flowIndex) => {
    const project = mdmsData.data.project;
    const version = mdmsData.data.version;
    const flowName = flow.name;
    const onAction = flow.onAction; // Individual flow name like "HOUSEHOLD", "ADD_MEMBER", "DELIVERY"

    // Handle TEMPLATE screenType (like searchBeneficiary, householdOverview)
    if (flow.screenType === "TEMPLATE") {
      const transformedFlow = {
        body: [
          {
            fields: transformBodyForTemplate(flow.body),
          },
        ],
        module: moduleName,
        flow: flowName,
        page: flow.name,
        type: "template",
        order: flow.order !== undefined ? flow.order : flowIndex + 1,
        footer: transformFooter(flow.footer),
        header: transformHeader(flow.header),
        preventScreenCapture: flow.preventScreenCapture || false,
        submitCondition: flow.submitCondition || null,
        heading: flow.heading,
        project: project,
        version: version,
        navigateTo: null, // Templates typically don't have navigateTo
        description: flow.description,
        screenType: flow.screenType,
        initActions: flow.initActions,
        wrapperConfig: flow.wrapperConfig,
        scrollListener: flow.scrollListener,
      };

      appConfig.push(transformedFlow);
    }

    // Handle FORM screenType (like HOUSEHOLD, ADD_MEMBER, DELIVERY)
    if (flow.screenType === "FORM" && flow.pages) {
      // Find the last page (page with highest order)
      const lastPage = flow.pages.reduce((max, page) => {
        const pageOrder = page.order !== undefined ? page.order : 0;
        const maxOrder = max.order !== undefined ? max.order : 0;
        return pageOrder > maxOrder ? page : max;
      }, flow.pages[0]);

      flow.pages.forEach((page, pageIndex) => {
        // Check if this is the last page
        const isLastPage = page === lastPage;
        
        // Transform onAction to conditionalNavigateTo if:
        // 1. This is the last page
        // 2. onAction exists at flow level
        // 3. conditionalNavigateTo doesn't already exist on the page
        // 4. This flow is configured for conditional navigate transformation
        let conditionalNavigateTo = page.conditionalNavigateTo;
        let conditionalNavigationProperties = page.conditionalNavigationProperties;
        
        if (
          isLastPage &&
          flow.onAction && 
          !conditionalNavigateTo 
        ) {
          conditionalNavigateTo = transformOnActionToConditionalNavigateTo(flow.onAction);
          
          // Only add conditionalNavigationProperties if conditionalNavigateTo was successfully created
          if (conditionalNavigateTo && !conditionalNavigationProperties) {
            const targetPages = extractTargetPagesFromOnAction(flow.onAction);
            if (targetPages) {
              conditionalNavigationProperties = {
                targetPages: targetPages
              };
            }
          }
        }

        const transformedPage = {
          body: [
            {
              fields: transformPropertiesToFields(page.properties),
            },
          ],
          module: moduleName,
          flow: flowName,
          page: page.page,
          type: page.type || "object",
          order: page.order !== undefined ? page.order : pageIndex + 1,
          footer: transformActionLabelToFooter(page.actionLabel, page.navigateTo),
          heading: page.label,
          project: project,
          version: version,
          navigateTo: page.navigateTo,
          onAction: flow.onAction,
          summary: flow.summary || false,
          preventScreenCapture: page.preventScreenCapture || false,
          submitCondition: page.submitCondition || null,
          description: page.description,
          showAlertPopUp: page.showAlertPopUp,
          conditionalNavigateTo: conditionalNavigateTo,
          conditionalNavigationProperties: conditionalNavigationProperties,
          showTabView: page?.multiEntityConfig !== null && page?.multiEntityConfig !== undefined ? Object.keys(page?.multiEntityConfig)?.length > 0 ? true : false : false,
          multiEntityConfig: page.multiEntityConfig,

        };

        appConfig.push(transformedPage);
      });

      // Add onAction and wrapperConfig metadata to a separate config object if needed
      if (flow.onAction || flow.wrapperConfig) {
        const flowMetadata = {
          module: moduleName,
          flow: flowName,
          onAction: flow.onAction,
          wrapperConfig: flow.wrapperConfig,
          project: project,
          version: version,
          screenType: flow.screenType,
        };
        // You can store this metadata separately or merge it with pages as needed
      }
    }
  });

  return appConfig;
};

/**
 * Transform body array for TEMPLATE screens
 */
const transformBodyForTemplate = (body) => {
  if (!body || !Array.isArray(body)) return [];

  return body.map((item) => {
    // Transform the item and its nested structures
    const transformed = transformField(item);

    // Handle listView with child elements
    if (item.format === "listView" && item.child) {
      transformed.child = transformField(item.child);
    }

    // Handle card elements with children
    if (item.format === "card" && item.children) {
      transformed.children = item.children.map((child) => transformField(child));
    }

    return transformed;
  });
};

/**
 * Helper function to transform a single field (handles nested children)
 * @param {Object} field - Field object to transform
 * @returns {Object} - Transformed field
 */
const transformField = (field) => {
  if (!field || typeof field !== "object") return field;

  const transformed = { ...field };

  // Transform validations if present
  if (field.validations && Array.isArray(field.validations)) {
    const validationProps = transformValidations(field.validations);
    Object.assign(transformed, validationProps);
    // Optionally remove the original validations array
    // delete transformed.validations;
  }

  // Extract action labels for panelCard format
  if (field.format === "panelCard") {
    const actionLabels = extractActionLabels(field);
    Object.assign(transformed, actionLabels);
  }

  // Recursively transform child
  if (field.child) {
    transformed.child = transformField(field.child);
  }

  // Recursively transform children array
  if (field.children && Array.isArray(field.children)) {
    transformed.children = field.children.map((child) => transformField(child));
  }

  return transformed;
};

/**
 * Recursively transform children elements
 */
const transformChildren = (children) => {
  if (!children || !Array.isArray(children)) return [];

  return children.map((child) => {
    if (child.children) {
      return {
        ...child,
        children: transformChildren(child.children),
      };
    }
    return child;
  });
};

/**
 * Transform properties array to fields array
 */
const transformPropertiesToFields = (properties) => {
  if (!properties || !Array.isArray(properties)) return [];

  return properties.map((prop) => {
    const field = {
      type: prop.type,
      label: prop.label,
      order: prop.order,
      value: prop.value || "",
      format: prop.format,
      hidden: prop.hidden || false,
      tooltip: prop.tooltip || "",
      helpText: prop.helpText || "",
      infoText: prop.infoText || "",
      readOnly: prop.readOnly || false,
      fieldName: prop?.fieldName || prop?.jsonPath,
      deleteFlag: prop.deleteFlag || false,
      innerLabel: prop.innerLabel || "",
      systemDate: prop.systemDate || false,
      errorMessage: prop.errorMessage || "",
      mandatory: prop.mandatory || false,
      ...prop,
    };

    // Add enums if present
    if (prop.enums) {
      field.dropDownOptions = prop.enums;
    }

    // Add schemaCode if present and set isMdms accordingly
    if (prop.schemaCode) {
      field.schemaCode = prop.schemaCode;
      field.isMdms = true;
    } else {
      field.isMdms = false;
    }

    // Transform validations to flat keys
    if (prop.validations && Array.isArray(prop.validations)) {
      const validationProps = transformValidations(prop.validations);
      Object.assign(field, validationProps);
    }

    // // Transform validations to required format
    // if (prop.validations && Array.isArray(prop.validations)) {
    //   prop.validations.forEach((validation) => {
    //     if (validation.type === "required" && validation.value === true) {
    //       field.required = true;
    //       field["required.message"] = validation.message || "";
    //     } else if (validation.type === "minLength") {
    //       field["minLength"] = validation.value;
    //       field["minLength.message"] = validation.message || "";
    //     } else if (validation.type === "maxLength") {
    //       field["maxLength"] = validation.value;
    //       field["maxLength.message"] = validation.message || "";
    //     } else if (validation.type === "min") {
    //       field["min"] = validation.value;
    //       field["min.message"] = validation.message || "";
    //     } else if (validation.type === "max") {
    //       field["max"] = validation.value;
    //       field["max.message"] = validation.message || "";
    //     }
    //     else if (validation.type === "isGS1") {
    //       field["isGS1"] = validation.value;
    //     }
    //     else if (validation.type === "scanLimit") {
    //       field["scanLimit"] = validation.value;
    //       field["scanLimit.message"] = validation.message || "";
    //     }
    //   });
    // }

    // Add visibility condition if present
    if (prop.visibilityCondition) {
      field.visibilityCondition = prop.visibilityCondition;
    }

    // Add includeInForm and includeInSummary if present
    if (prop.includeInForm !== undefined) {
      field.includeInForm = prop.includeInForm;
    }
    if (prop.includeInSummary !== undefined) {
      field.includeInSummary = prop.includeInSummary;
    }

    // Add isMultiSelect if present
    if (prop.isMultiSelect !== undefined) {
      field.isMultiSelect = prop.isMultiSelect;
    }

    return field;
  });
};

/**
 * Transform actionLabel to footer format
 */
const transformActionLabelToFooter = (actionLabel, navigateTo) => {
  if (!actionLabel) return [];

  return [
    {
      label: actionLabel,
      format: "button",
      onAction: navigateTo
        ? [
            {
              actionType: "NAVIGATION",
              properties: navigateTo,
            },
          ]
        : [],
      properties: {
        size: "large",
        type: "primary",
        mainAxisSize: "max",
        mainAxisAlignment: "center",
      },
    },
  ];
};

/**
 * Transform footer array
 */
const transformFooter = (footer) => {
  if (!footer || !Array.isArray(footer)) return [];

  // Apply field transformation to each footer item
  return footer.map((item) => transformField(item));
};

/**
 * Transform header array
 */
const transformHeader = (header) => {
  if (!header || !Array.isArray(header)) return [];
  return header;
};

const transformValidations = (validations) => {
  if (!validations || !Array.isArray(validations)) return {};

  const validationProps = {};

  // Define validation groups - related types that should be combined
  const validationGroups = {
    range: ["min", "max"],
    lengthRange: ["minLength", "maxLength"],
    dateRange: ["startDate", "endDate"],
    ageRange: ["minAge", "maxAge"],
  };

  // Create reverse lookup: type -> groupName
  const typeToGroup = {};
  Object.entries(validationGroups).forEach(([groupName, types]) => {
    types.forEach((type) => {
      typeToGroup[type] = groupName;
    });
  });

  // Collect grouped validations
  const groupedValues = {};

  validations.forEach((validation) => {
    const { type, value, message } = validation;
    if (type === undefined || value === undefined) return;

    const groupName = typeToGroup[type];

    if (groupName) {
      // This type belongs to a group
      if (!groupedValues[groupName]) {
        groupedValues[groupName] = {};
      }
      groupedValues[groupName][type] = value;
      // Store the last message as errorMessage
      if (message) {
        groupedValues[groupName].errorMessage = message;
      }
    } else {
      // Standalone validation - keep as flat key
      validationProps[type] = value;
      if (message) {
        validationProps[`${type}.message`] = message;
      }
    }
  });

  // Merge grouped validations into result
  Object.entries(groupedValues).forEach(([groupName, groupData]) => {
    validationProps[groupName] = groupData;
  });

  return validationProps;
};

const extractActionLabels = (field) => {
  const actionLabels = {};

  if (field?.primaryAction && field.primaryAction?.label) {
    actionLabels.primaryActionLabel = field.primaryAction.label;
  }

  if (field?.secondaryAction && field.secondaryAction?.label) {
    actionLabels.secondaryActionLabel = field.secondaryAction.label;
  }

  return actionLabels;
};

/**
 * Extract flow metadata (onAction, wrapperConfig, etc.)
 */
export const extractFlowMetadata = (mdmsData) => {
  if (!mdmsData?.data?.flows) {
    return {};
  }

  const metadata = {};

  mdmsData.data.flows.forEach((flow) => {
    if (flow.onAction || flow.wrapperConfig) {
      metadata[flow.name] = {
        onAction: flow.onAction,
        wrapperConfig: flow.wrapperConfig,
        scrollListener: flow.scrollListener,
        screenType: flow.screenType,
        project: flow.project || mdmsData.data.project,
        version: mdmsData.data.version,
        disabled: flow.disabled,
        isSelected: flow.isSelected,
        summary: flow.summary,
      };
    }
  });

  return metadata;
};

/**
 * Transform onAction array to conditionalNavigateTo format
 * Extracts NAVIGATION actions and their conditions
 * Skips conditions with "DEFAULT" expression or missing expression
 */
const transformOnActionToConditionalNavigateTo = (onAction) => {
  if (!onAction || !Array.isArray(onAction)) return null;

  const conditionalNavigateTo = [];

  onAction.forEach((item) => {
    if (!item.actions || !Array.isArray(item.actions)) return;

    // Find NAVIGATION action in the actions array
    const navigationAction = item.actions.find(
      (action) => action.actionType === "NAVIGATION"
    );

    if (navigationAction && navigationAction.properties) {
      const { name, type } = navigationAction.properties;
      const condition = item.condition?.expression;
      const conditionType = item.condition?.type;

      // Skip if:
      // 1. No condition expression present
      // 2. Condition expression is "DEFAULT"
      if (!condition || condition === "DEFAULT" || conditionType === "custom") {
        return;
      }

      if (name && type) {
        conditionalNavigateTo.push({
          condition: condition,
          navigateTo: {
            name: name,
            type: type,
          },
        });
      }
    }
  });

  // Only return if we have valid conditional navigations
  return conditionalNavigateTo.length > 0 ? conditionalNavigateTo : null;
};

/**
 * Extract target pages from onAction array for conditionalNavigationProperties
 * Extracts all unique NAVIGATION targets (name and type)
 */
const extractTargetPagesFromOnAction = (onAction) => {
  if (!onAction || !Array.isArray(onAction)) return null;

  const targetPages = [];
  const seen = new Set(); // To track unique combinations

  onAction.forEach((item) => {
    if (!item.actions || !Array.isArray(item.actions)) return;

    // Find NAVIGATION action in the actions array
    const navigationAction = item.actions.find(
      (action) => action.actionType === "NAVIGATION"
    );

    if (navigationAction && navigationAction.properties) {
      const { name, type } = navigationAction.properties;

      if (name && type) {
        // Create unique key to avoid duplicates
        const key = `${name}|${type}`;
        if (!seen.has(key)) {
          seen.add(key);
          targetPages.push({
            name: name,
            code: name,
            type: type?.toLowerCase() || "form",
          });
        }
      }
    }
  });

  return targetPages.length > 0 ? targetPages : null;
};

/**
 * Transform MDMS data to Flow Config format
 * @param {Object} mdmsData - The MDMS data object containing flows
 * @returns {Array} - Transformed flow config array
 */
export const transformMdmsToFlowConfig = (mdmsData) => {
  // Handle both mdmsData.data and direct mdmsData structure
  const data = mdmsData?.data || mdmsData;

  if (!data?.flows) {
    console.error("Invalid MDMS data structure");
    return [];
  }

  const flows = data.flows;
  const project = data.project;

  // Process each flow separately to maintain flow-wise next/previous routes
  const flowConfigs = [];

  flows.forEach((flow, flowIndex) => {
    const flowPages = [];

    // Handle TEMPLATE screenType - single page flows
    if (flow.screenType === "TEMPLATE") {
      flowPages.push({
        name: flow.name,
        order: flow.order !== undefined ? flow.order : flowIndex + 1,
        nextRoute: flow.nextRoute || null,
        previousRoute: flow.previousRoute || null,
      });
    }

    // Handle FORM screenType - multi-page flows
    if (flow.screenType === "FORM" && flow.pages) {
      flow.pages.forEach((page, pageIndex) => {
        flowPages.push({
          name: page.name || `${flow.name}.${page.page}`,
          order: page.order !== undefined ? page.order : pageIndex + 1,
          nextRoute: page.nextRoute || null,
          previousRoute: page.previousRoute || null,
        });
      });
    }

    // Sort pages within this flow by order
    flowPages.sort((a, b) => a.order - b.order);

    // Calculate next/previous routes within this flow only (as fallback if not provided)
    flowPages.forEach((page, index) => {
      const nextPage = flowPages[index + 1];
      const previousPage = flowPages[index - 1];

      // Use the original nextRoute/previousRoute from MDMS data if available, otherwise fallback to calculated within flow
      if (page.nextRoute === null && nextPage) {
        page.nextRoute = nextPage.name;
      }
      if (page.previousRoute === null && previousPage) {
        page.previousRoute = previousPage.name;
      }
    });

    // Create flow config
    if (flowPages.length > 0) {
      flowConfigs.push({
        id: flow.name,
        name: flow.name,
        order: flow.order !== undefined ? flow.order : flowIndex + 1,
        pages: flowPages,
        roles: flow.roles || [],
        project: project,
        type: flow.screenType?.toLowerCase() || "form",
        indexRoute: flowPages[0]?.name || null,
      });
    }
  });

  // Sort flows by order to maintain consistent ordering
  flowConfigs.sort((a, b) => a.order - b.order);

  return flowConfigs;
};

/**
 * Main export function that returns both config and metadata
 */
export const transformMdmsData = (mdmsData) => {
  return {
    appConfig: transformMdmsToAppConfig(mdmsData),
    flowMetadata: extractFlowMetadata(mdmsData),
    initialPage: mdmsData?.data?.initialPage,
    project: mdmsData?.data?.project,
    version: mdmsData?.data?.version,
    name: mdmsData?.data?.name,
  };
};