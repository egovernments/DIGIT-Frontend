import _ from "lodash";

const destroySessionHelper = (currentPath, pathList, sessionName) => {
  if (!pathList.includes(currentPath)) {
    sessionStorage.removeItem(`Digit.${sessionName}`);
  }
};

function createStatusMap(data, boundaryHierarchy) {
  return data.reduce((statusMap, { type }) => {
    statusMap[type] = (statusMap[type] || 0) + 1;
    return statusMap;
  }, boundaryHierarchy.reduce((initialMap, { boundaryType }) => {
    initialMap[boundaryType] = 0;
    return initialMap;
  }, {}));
}

const formValidator = (formData, key, state, t) => {
  function getValueFromPath(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }



  // Validator function
  function validateFormData(jsonPaths) {
    for (const path of jsonPaths) {
      const value = getValueFromPath(formData, path);

      // If the value is falsy (undefined, null, 0, '', false, etc.), return false immediately
      if (!value) {
        return false;
      }
    }

    // If no falsy values are found, return true
    return true;
  }

  const campaignDetailsValidator = () => {
    const isValid = validateFormData(["campaignType.code", "disease.code", "distributionStrat.resourceDistributionStrategyCode"]);
    if (!isValid) return { key: "error", label: "ERROR_CAMPAIGN_DETAILS_MANDATORY" };
    return null;
  };

  const microplanDetailsValidator = () => {
    function validateName(name) {
      const microplanNamingRegexString = state?.MicroplanNamingRegex?.[0]?.data;
      const namePattern = new RegExp(microplanNamingRegexString);
      return namePattern.test(name);
    }

    const isValid = validateFormData(["microplanName"]);
    if (!isValid) return { key: "error", label: "ERROR_MICROPLAN_DETAILS_MANDATORY" };

    //check regex here
    const isNameValid = validateName(formData?.microplanName);
    if (!isNameValid) {
      return { key: "error", label: "ERROR_MICROPLAN_NAME_INVALID" };
    }
    return null;
  };

  const boundarySelectionValidator = () => {

    function recursiveParentFind(filteredData) {
      const parentChildrenMap = {};

      // Build the parent-children map
      filteredData?.forEach((item) => {
        if (item?.parent) {
          if (!parentChildrenMap[item?.parent]) {
            parentChildrenMap[item?.parent] = [];
          }
          parentChildrenMap[item?.parent].push(item.code);
        }
      });

      // Check for missing children
      const missingParents = filteredData?.filter((item) => item?.parent && !parentChildrenMap[item.code]);
      const extraParent = missingParents?.filter((i) => i?.type !== state?.lowestHierarchy);
      return extraParent;
    }

    function validateBoundaryData(data, requiredTypes) {
      // Create a Set to keep track of found types
      const foundTypes = new Set();

      // Loop through the data array to collect types
      data.forEach((item) => {
        if (requiredTypes.includes(item.type)) {
          foundTypes.add(item.type);
        }
      });

      // Check if all required types are found
      return requiredTypes.every((type) => foundTypes.has(type));
    }
    const isSelectedBoundariesValid = validateBoundaryData(
      formData.selectedData,
      state?.boundaryHierarchy?.map((row) => row.boundaryType)
    );
    if (!isSelectedBoundariesValid) {
      return { key: "error", label: "ERROR_BOUNDARY_SELECTION" };
    }
    const missedType = recursiveParentFind(formData?.selectedData);
    if (missedType.length > 0) {
      return {
        key: "error",
        label: `${t(`HCM_CAMPAIGN_FOR`)} ${t(`${state?.hierarchyType}_${missedType?.[0]?.type}`?.toUpperCase())} ${t(missedType?.[0]?.code)} ${t(`HCM_CAMPAIGN_CHILD_NOT_PRESENT`)}`,
      }
    }
    return null;
  };

  const areFieldsValid = (fields) => {
    if (fields.length === 0) {
      return false
    }

    const hasInvalidField = fields?.some(field => {
      const isValid = field && field.value;
      return !isValid;
    });

    return !hasInvalidField; // Returns true if all fields are valid
  };




  const assumptionsFormValidator = (formData) => {

    let requiredFields = []
    if (formData?.selectedRegistrationProcess && formData?.selectedDistributionProcess) {
      requiredFields = [
        formData?.selectedRegistrationProcess,
        formData?.selectedDistributionProcess,
      ]
      if (!areFieldsValid(requiredFields)) {
        return { key: "error", label: "ERROR_MANDATORY_FIELDS" };
      }
    } else if (formData?.selectedRegistrationDistributionMode) {
      requiredFields = [
        formData?.selectedRegistrationDistributionMode,
      ]
      if (!areFieldsValid(requiredFields)) {
        return { key: "error", label: "ERROR_MANDATORY_FIELDS" };
      }
    }

    const processesAreValid = formData?.selectedRegistrationProcess?.code && formData?.selectedDistributionProcess?.code;
    if (processesAreValid && (formData?.selectedRegistrationProcess.code === formData?.selectedDistributionProcess.code) && (formData?.selectedRegistrationProcess.code !== "MIXED")) {
      return { key: "error", label: "ERROR_REGISTRATION_AND_DISTRIBUTION_ARE_SAME" }; // Customize as needed
    }

    if (!areFieldsValid(requiredFields)) {
      return { key: "error", label: "ERROR_MANDATORY_FIELDS" };
    }

    return null; // Return null if all validations pass
  };



  const checkValueInvalid = (data) => {
    return data.some(item => {
      const value = item.value;
      // Check if the value is null, 0, or less than 0
      return value === null || value <= 0 || value > 1000;
    });
  }

  const microplanAssumptionsValidator = (formData) => {

    if (!areFieldsValid(formData.assumptionValues?.filter(row => !(row.category === undefined && row.value === undefined)))) {
      return { key: "error", label: "ERROR_MANDATORY_FIELDS" };
    }
    if (checkValueInvalid(formData.assumptionValues)) {
      return { key: "error", label: "INCORRECT_FIELDS" };
    }

    return null
  }

  const formulaConfigurationValidator = (formData) => {
    if (formData?.formulaConfigValues?.some((i) => i.operatorName === "SUBSTRACTION" && i.input === i.assumptionValue)) {
      return {
        key: "error",
        label: t("ERR_MANDATORY_FIELD_SAME_OPERAND"),
        transitionTime: 3000,
      };
    } else if (
      formData?.formulaConfigValues
        .every((row) => {
          return row.assumptionValue && row.input && row.output && row.operatorName;
        })
    ) {
      return null;
    } else {
      return {
        key: "error",
        label: t("ERR_MANDATORY_FIELD"),
        transitionTime: 3000,
      };
    }
  }

  const uploadDataValidator = (formData) => {
    if (formData?.isSuccess) return null;
    return { key: "error", label: "ERROR_VALID_MANDATORY_FILES" };
  }

  const newColumnsValidator = (formData) => {
    // Return null if formData is not an array
    if (!Array.isArray(formData)) return null;
  
    // Regex: allow letters, numbers, and spaces only
    const noSpecialCharsExceptSpace = /^[A-Za-z0-9 ]+$/;

    const seen = new Set(); // To track unique non-empty values
    // Loop through each value
    for (let val of formData) {
      // Allow empty strings
      if (val === "") continue;
  
      // Check length first
      if (val.length > 200) {
        return { key: "error", label: "COLUMN_NAME_TOO_LONG" };
      }
  
      // Check allowed characters
      if (!noSpecialCharsExceptSpace.test(val)) {
        return { key: "error", label: "ERROR_INVALID_COL_NAME" };
      }
      if (seen.has(val.trim())) {

        return { key: "error", label: "DUPLICATE_COLUMN_NAME" };
      }
      seen.add(val.trim());
    }
  
    // If all values are valid
    return null;
  };
  

  //here we'll validate formData based on the config
  switch (key) {
    case "campaignDetails":
      return campaignDetailsValidator();
    case "microplanDetails":
      return microplanDetailsValidator();
    case "boundarySelection":
      return boundarySelectionValidator();
    case "assumptionsForm":
      return assumptionsFormValidator(formData);
    case "Assumptions":
      return microplanAssumptionsValidator(formData);
    case "formulaConfiguration":
      return formulaConfigurationValidator(formData);
    case "boundary":
      return uploadDataValidator(formData);
    case "facilityWithBoundary":
      return uploadDataValidator(formData);
    case "newColumns":
      return newColumnsValidator(formData);

    default:
      return null;
  }
};

function getCurrentMonth() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthIndex = new Date().getMonth(); // Returns month index (0 for January, 11 for December)
  return monthNames[currentMonthIndex];
}

// function updateUrlParams(params) {
//   const url = new URL(window.location.href);
//   Object.entries(params).forEach(([key, value]) => {
//     url.searchParams.set(key, value);
//   });
//   window.history.replaceState({}, "", url);
// }

const updateUrlParams = (params) => {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history.replaceState({}, "", url);
  const event = new CustomEvent("urlChanged", { detail: url });
  window.dispatchEvent(event);
};

function generateCampaignString(sessionData, t) {

  // Extract details from sessionData
  const diseaseCode = sessionData?.CAMPAIGN_DETAILS?.campaignDetails.disease.code;
  const campaignTypeCode = sessionData?.CAMPAIGN_DETAILS?.campaignDetails.campaignType.i18nKey;
  const resourceDistributionStrategy = sessionData?.CAMPAIGN_DETAILS?.campaignDetails.distributionStrat.resourceDistributionStrategyCode;

  // Get current date details
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0'); // Two-digit day
  const monthAbbr = currentDate.toLocaleString('en-US', { month: 'short' }); // Three-letter month abbreviation
  const yearLastTwoDigits = currentDate.getFullYear().toString().slice(-2); // Last two digits of the year

  // Construct the final string
  const result = `${t(diseaseCode)}-${t(campaignTypeCode)}-${t(resourceDistributionStrategy)}-${day} ${monthAbbr} ${yearLastTwoDigits}`;
  return result;
}

//fn that merges api res and ui inputs for assumptions
//unique code is assumptions key
//last vertical step
const mergeAssumptions = (currentAssumptions, assumptionsToMerge) => {
  // init an empty array result
  // assumptionsToMerge will have all the assumptions selected in UI
  // for each assumption in assumptionsToMerge check if it exists in currentAssumptions
  // first map the CA and check whether they are in ATM(if not mark active to false) -> push to result
  // if yes then update the existing one and push to result
  // if 
}

//per vertical step
const mergeAssumptionsCategory = (currentAssumptions, assumptionsToMerge, category) => {
  // init an empty array
  // filter out currentAssumptions(don't include category)
  // push this filtered + assumptionsToMerge into this and return
}

//this will give data for dependent dropdowns of hierarchy(from selectedData)
function filterSelectedDataByBoundaryCodes(selectedBoundaries, boundaryCodes = []) {
  if (boundaryCodes.length === 0) {
    return []
  }
  // Create an array to store the result
  const result = [];

  // Iterate over the selected data
  selectedBoundaries.forEach(boundary => {
    // Check if the boundary's parent exists in the boundaryCodes list
    if (boundaryCodes.includes(boundary.parent)) {
      result.push(boundary);
    }
  });

  return result;
}

function getFilteredHierarchy(hierarchy, jurisdiction, hierarchyType) {
  // Find the index of the starting boundary type (jurisdiction)
  const filteredHierarchy = [];

  // Helper function to recursively add children boundaries
  function addChildren(parentType) {
    hierarchy.forEach(item => {
      if (item.parentBoundaryType === parentType) {
        filteredHierarchy.push(item);
        // Recursively find children of the current boundary
        addChildren(item.boundaryType);
      }
    });
  }

  // Find the starting boundary type (the provided jurisdiction)
  const startingBoundary = hierarchy.find(item => item.boundaryType === jurisdiction);

  if (startingBoundary) {
    // Add the starting boundary to the result
    filteredHierarchy.push(startingBoundary);
    // Recursively add its children
    addChildren(jurisdiction);
  }


  return filteredHierarchy?.map(row => {
    return {
      ...row,
      i18nKey: Digit.Utils.locale.getTransformedLocale(`${hierarchyType}_${row?.
        boundaryType}`)
    }
  });
}

function filterBoundariesByJurisdiction(boundaries, jurisdictions) {
  const filteredBoundaries = [];

  // Helper function to recursively collect all boundaries under a specific boundary code
  function collectBoundaries(code) {
    // Find the boundary with the provided code
    const boundary = boundaries.find(b => b.code === code);

    if (boundary) {
      // Add the boundary itself
      filteredBoundaries.push(boundary);

      // Find all child boundaries with the current boundary as parent and recursively collect them
      boundaries.forEach(b => {
        if (b.parent === code) {
          collectBoundaries(b.code);
        }
      });
    }
  }

  // For each jurisdiction, collect the boundary and all its children
  jurisdictions.forEach(jurisdictionCode => {
    collectBoundaries(jurisdictionCode);
  });

  return filteredBoundaries;
}

function fetchBoundaryOptions(boundaries = [], selectedBoundaries = [], boundaryType) {
  //basically loop over and check parent and return an array
}

function createBoundaryDataByHierarchy(boundaryData) {
  const hierarchy = {};

  // Helper function to build the reversed materialized path
  function buildMaterializedPath(boundary, boundaryMap) {
    let path = [];
    let currentBoundary = boundary;

    // Build the path from the boundary's parent up to the root
    while (currentBoundary && currentBoundary.parent) {
      currentBoundary = boundaryMap[currentBoundary.parent];
      if (currentBoundary) {
        path.push(currentBoundary.code);
      }
    }

    // Join the reversed path into a single string
    return path.reverse().join('.');
  }

  // First, create a map for easy access to boundaries by code
  const boundaryMap = boundaryData.reduce((map, boundary) => {
    map[boundary.code] = boundary;
    return map;
  }, {});

  // Iterate over all boundaries
  boundaryData.forEach(boundary => {
    const { type, code } = boundary;

    // Initialize type if not already in the hierarchy
    if (!hierarchy[type]) {
      hierarchy[type] = {};
    }

    // Build the reversed materialized path for this boundary
    const materializedPath = buildMaterializedPath(boundary, boundaryMap);

    // Assign the materialized path to the boundary in the hierarchy
    hierarchy[type][code] = materializedPath;
  });

  return hierarchy;
}


function groupByParent(data) {
  // Create a map to hold the grouped structure
  const grouped = {};

  // Iterate through the data array
  data.forEach(item => {
    const parentKey = item.parent;

    // If the parent doesn't exist in the grouped object, create an entry
    if (!grouped[parentKey]) {
      grouped[parentKey] = {
        name: parentKey,
        code: parentKey,
        options: []
      };
    }

    // Push the entire object into the correct parent group as an option
    grouped[parentKey].options.push(item);
  });

  // Convert the grouped object into an array
  return Object.values(grouped);
}


function epochToDateTime(epoch) {
  // Create a new Date object using the epoch time
  const date = new Date(epoch);

  const year = date.getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()]; // Get month name
  const day = String(date.getDate()).padStart(2, "0");

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Determine AM/PM and convert to 12-hour format
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0");

  // Format date and time as "DD MMM YYYY, HH:MM AM/PM"
  const formattedDateTime = `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;

  // Return the formatted date and time
  return formattedDateTime;
}


function filterUniqueByKey(arr, key) {
  const uniqueValues = new Set();
  const result = [];

  arr.forEach((obj) => {
    const value = obj[key];
    if (!uniqueValues.has(value)) {
      uniqueValues.add(value);
      result.push(obj);
    }
  });

  return result;

}
export const PRIMARY_COLOR = "#C84C0E";

function validatePlanConfigForDraftDownload(planConfig) {
  const validationFunctions = [
    validateTenantId,
    validateStatus,
    // validateResourceMapping,
    validateOperations,
    validateAssumptions,
    validateCampaignId,
    validateId,
    validateName,
    validateFiles
  ];

  for (const validationFunction of validationFunctions) {
    if (!validationFunction(planConfig)) {
      return false; // Early return if any validation fails
    }
  }

  return true; // All validations passed
}

// Validation Functions

function validateTenantId(planConfig) {
  return typeof planConfig.tenantId === 'string' && planConfig.tenantId.trim() !== '';
}

function validateStatus(planConfig) {
  return typeof planConfig.status === 'string' && planConfig.status.trim() !== '';
}

function validateResourceMapping(planConfig) {
  return Array.isArray(planConfig.resourceMapping) && planConfig.resourceMapping.length >= 1;
}

function validateOperations(planConfig) {
  return Array.isArray(planConfig.operations) && planConfig.operations.length >= 1;
}

function validateAssumptions(planConfig) {
  return Array.isArray(planConfig.assumptions) && planConfig.assumptions.length >= 1;
}

function validateCampaignId(planConfig) {
  return typeof planConfig.campaignId === 'string' && planConfig.campaignId.trim() !== '';
}

function validateId(planConfig) {
  return typeof planConfig.id === 'string' && planConfig.id.trim() !== '';
}

function validateName(planConfig) {
  return typeof planConfig.name === 'string' && planConfig.name.trim() !== '';
}

function validateFiles(planConfig) {
  if (!Array.isArray(planConfig.files) || planConfig.files.length < 1) {
    return false;
  }

  const hasPopulationTemplate = planConfig.files.some(file => file.templateIdentifier === 'Population');
  const hasFacilitiesTemplate = planConfig.files.some(file => file.templateIdentifier === 'Facilities');

  return hasPopulationTemplate && hasFacilitiesTemplate;
}


export default {
  destroySessionHelper,
  createStatusMap,
  formValidator,
  generateCampaignString,
  updateUrlParams,
  filterSelectedDataByBoundaryCodes,
  getFilteredHierarchy,
  filterBoundariesByJurisdiction,
  createBoundaryDataByHierarchy,
  groupByParent,
  epochToDateTime,
  filterUniqueByKey,
  validatePlanConfigForDraftDownload
  // constructBoundaryOptions
}
