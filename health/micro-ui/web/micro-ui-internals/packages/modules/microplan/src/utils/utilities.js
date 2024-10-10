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

  const areFieldsValid = (fields) => {
    if(fields.length === 0){
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
       if(formData?.selectedRegistrationProcess && formData?.selectedDistributionProcess){
        requiredFields = [
          formData?.selectedRegistrationProcess,
          formData?.selectedDistributionProcess,
        ]
          if (!areFieldsValid(requiredFields)) {
            return { key: "error", label: "ERROR_MANDATORY_FIELDS" }; 
          }
       }else if(formData?.selectedRegistrationDistributionMode){
        requiredFields = [
          formData?.selectedRegistrationDistributionMode,
        ]
        if (!areFieldsValid(requiredFields)) {
          return { key: "error", label: "ERROR_MANDATORY_FIELDS" }; 
        }
       }

    const processesAreValid = formData?.selectedRegistrationProcess?.code && formData?.selectedDistributionProcess?.code;
    if (processesAreValid && (formData?.selectedRegistrationProcess.code === formData?.selectedDistributionProcess.code)) {
        return { key: "error", label: "ERROR_REGISTRATION_AND_DISTRIBUTION_ARE_SAME" }; // Customize as needed
    }
    
    if (!areFieldsValid(requiredFields)) {
      return { key: "error", label: "ERROR_MANDATORY_FIELDS" }; 
    }
  
    return null; // Return null if all validations pass
  };




  const microplanAssumptionsValidator = (formData)=>{
      
        if(!areFieldsValid(formData.assumptionValues)){
           return { key: "error", label: "ERROR_MANDATORY_FIELDS" }; 
        }

      return null
  }
  
  

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

function updateUrlParams(params) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.history.replaceState({}, "", url);
}

function generateCampaignString(sessionData,t) {
  
  // Extract details from sessionData
  const diseaseCode = sessionData.CAMPAIGN_DETAILS.campaignDetails.disease.code;
  const campaignTypeCode = sessionData.CAMPAIGN_DETAILS.campaignDetails.campaignType.i18nKey;
  const resourceDistributionStrategy = sessionData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode;
  
  // Get current year and take the last two digits
  const currentYear = new Date().getFullYear();
  const yearLastTwoDigits = currentYear.toString().slice(-2);
  const currentMonth = getCurrentMonth()
  // Construct the final string
  const result = `${t(diseaseCode)}-${t(campaignTypeCode)}-${t(resourceDistributionStrategy)}-${currentMonth} ${yearLastTwoDigits}`;
  return result;
}

export default {
  destroySessionHelper,
  createStatusMap,
  formValidator,
  generateCampaignString,
  updateUrlParams
};
export const PRIMARY_COLOR = "#C84C0E";
