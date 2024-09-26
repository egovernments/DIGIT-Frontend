import _ from "lodash";

const destroySessionHelper = (currentPath, pathList, sessionName) => {
  if (!pathList.includes(currentPath)) {
    sessionStorage.removeItem(`Digit.${sessionName}`);
  }
};

function createStatusMap(data, boundaryHierarchy) {
  // Initialize an empty map to store counts of each type
  const statusMap = {};
  boundaryHierarchy.forEach((boundary) => {
    statusMap[boundary.boundaryType] = 0;
  });

  if (data.length === 0) return statusMap;
  // Iterate over each object in the array
  data?.forEach((item) => {
    // If the type already exists in the map, increment the count
    if (statusMap[item.type]) {
      statusMap[item.type]++;
    } else {
      // Otherwise, initialize the count for this type
      statusMap[item.type] = 1;
    }
  });

  return statusMap;
}

const formValidator = (formData, key, state) => {
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
      const microplanNamingRegxString = state?.MicroplanNamingRegx?.[0]?.data;
      const namePattern = new RegExp(microplanNamingRegxString);
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

    default:
      return null;
  }
};

export default {
  destroySessionHelper,
  createStatusMap,
  formValidator,
};
