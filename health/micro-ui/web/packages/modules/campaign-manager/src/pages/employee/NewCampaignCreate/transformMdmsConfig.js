/**
 * Transforms MDMS data structure to App Config format
 * @param {Object} mdmsData - The MDMS data object containing flows
 * @returns {Array} - Transformed app config array
 */
export const transformMdmsToAppConfig = (mdmsData) => {
  if (!mdmsData?.data?.flows) {
    console.error("Invalid MDMS data structure");
    return [];
  }

  const appConfig = [];
  const flows = mdmsData.data.flows;
  const moduleName = mdmsData.data.name; // Overall module name like "REGISTRATION-DELIVERY"

  flows.forEach((flow) => {
    const project = flow.project || mdmsData.data.project;
    const version = flow.version || mdmsData.data.version || 1;
    const flowName = flow.name; // Individual flow name like "HOUSEHOLD", "ADD_MEMBER", "DELIVERY"

    // Handle TEMPLATE screenType (like searchBeneficiary, householdOverview)
    if (flow.screenType === "TEMPLATE") {
      const transformedFlow = {
        body: transformBodyForTemplate(flow.body),
        module: moduleName,
        flow: flowName,
        page: flow.name,
        type: "template",
        order: flow.order || 1,
        footer: transformFooter(flow.footer),
        header: transformHeader(flow.header),
        heading: flow.heading,
        project: project,
        version: version,
        navigateTo: null, // Templates typically don't have navigateTo
        description: flow.description,
        screenType: flow.screenType,
        initActions: flow.initActions,
        wrapperConfig: flow.wrapperConfig,
      };

      appConfig.push(transformedFlow);
    }

    // Handle FORM screenType (like HOUSEHOLD, ADD_MEMBER, DELIVERY)
    if (flow.screenType === "FORM" && flow.pages) {
      flow.pages.forEach((page, pageIndex) => {
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
          order: page.order || pageIndex + 1,
          footer: transformActionLabelToFooter(page.actionLabel, page.navigateTo),
          heading: page.label,
          project: project,
          version: version,
          navigateTo: page.navigateTo,
          description: page.description,
          showAlertPopUp: page.showAlertPopUp,
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
    // If it's already in field format, wrap it
    if (item.fields) {
      return item;
    }

    // Transform different template body types
    const transformed = {
      ...item,
    };

    // Handle listView with child elements
    if (item.format === "listView" && item.child) {
      transformed.child = item.child;
    }

    // Handle card elements
    if (item.format === "card" && item.children) {
      transformed.children = transformChildren(item.children);
    }

    return transformed;
  });
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
      fieldName: prop.fieldName,
      deleteFlag: prop.deleteFlag || false,
      innerLabel: prop.innerLabel || "",
      systemDate: prop.systemDate || false,
      errorMessage: prop.errorMessage || "",
    };

    // Add enums if present
    if (prop.enums) {
      field.enums = prop.enums;
    }

    // Add schemaCode if present
    if (prop.schemaCode) {
      field.schemaCode = prop.schemaCode;
    }

    // Transform validations to required format
    if (prop.validations && Array.isArray(prop.validations)) {
      prop.validations.forEach((validation) => {
        if (validation.type === "required" && validation.value === true) {
          field.required = true;
          field["required.message"] = validation.message || "";
        } else if (validation.type === "minLength") {
          field["minLength"] = validation.value;
          field["minLength.message"] = validation.message || "";
        } else if (validation.type === "maxLength") {
          field["maxLength"] = validation.value;
          field["maxLength.message"] = validation.message || "";
        } else if (validation.type === "min") {
          field["min"] = validation.value;
          field["min.message"] = validation.message || "";
        } else if (validation.type === "max") {
          field["max"] = validation.value;
          field["max.message"] = validation.message || "";
        }
      });
    }

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
  return footer;
};

/**
 * Transform header array
 */
const transformHeader = (header) => {
  if (!header || !Array.isArray(header)) return [];
  return header;
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
        screenType: flow.screenType,
        project: flow.project || mdmsData.data.project,
        version: flow.version || mdmsData.data.version || 1,
        disabled: flow.disabled,
        isSelected: flow.isSelected,
      };
    }
  });

  return metadata;
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

  flows.forEach((flow) => {
    const flowPages = [];

    // Handle TEMPLATE screenType - single page flows
    if (flow.screenType === "TEMPLATE") {
      flowPages.push({
        name: flow.name,
        order: flow.order || 1,
        nextRoute: flow.nextRoute || null,
        previousRoute: flow.previousRoute || null,
      });
    }

    // Handle FORM screenType - multi-page flows
    if (flow.screenType === "FORM" && flow.pages) {
      flow.pages.forEach((page, pageIndex) => {
        flowPages.push({
          name: page.name || `${flow.name}.${page.page}`,
          order: page.order || pageIndex + 1,
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
        order: flow.order || 1,
        pages: flowPages,
        roles: flow.roles || [],
        project: project,
        indexRoute: flowPages[0]?.name || null,
      });
    }
  });

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
