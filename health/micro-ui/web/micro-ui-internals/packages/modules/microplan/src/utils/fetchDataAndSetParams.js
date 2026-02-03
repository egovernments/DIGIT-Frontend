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

export const fetchDataAndSetParams = (  state, setParams, campaignObject, planObject) => {
    var draftFormData = {}
    const campaignDetails = {
      campaignDetails: {
        distributionStrat: {
          resourceDistributionStrategyCode: campaignObject?.additionalDetails?.resourceDistributionStrategy,
        },
        disease: {
          code: campaignObject?.additionalDetails?.disease,
        },
        campaignType: {
          code: campaignObject?.projectType,
          i18nKey: Digit.Utils.locale.getTransformedLocale(`CAMPAIGN_TYPE_${campaignObject?.projectType}`),
        },
      },
    };
    if (campaignObject?.additionalDetails?.resourceDistributionStrategy && campaignObject?.additionalDetails?.disease && campaignObject?.projectType) {
      draftFormData.CAMPAIGN_DETAILS = campaignDetails;
    }

    const microplanDetails = {
      microplanDetails: {
        microplanName: planObject?.name,
      },
    };
    if (planObject?.name) {
      draftFormData.MICROPLAN_DETAILS = microplanDetails;
    }

    const boundaryData = createBoundaryDataByHierarchy(campaignObject?.boundaries);
    const boundarySelection = {
      boundarySelection: {
        boundaryData: boundaryData,
        selectedData: campaignObject?.boundaries,
      },
    }

    if (campaignObject?.boundaries) {
      draftFormData.BOUNDARY = boundarySelection;
    }

    const uploadBoundaryData = {
      boundary: {
        uploadedFile: [],
        "isError": false,
        "isValidation": false,
        "apiError": null,
        "isSuccess": false
      },
    };

    const uploadFacilityData = {
      facilityWithBoundary: {
        uploadedFile: [],
        "isError": false,
        "isValidation": false,
        "apiError": null,
        "isSuccess": false
      },
    };

    // Assuming planObject.files contains the files array
    const files = planObject?.files || []; // Replace with actual source of files

    // Find the file for boundary (templateIdentifier: "Population")
    const boundaryFile = files.find(file => file.templateIdentifier === "Population");

    // Find the file for facility (templateIdentifier: "Facilities")
    const facilityFile = files.find(file => file.templateIdentifier === "Facilities");

    // Enrich uploadBoundaryData if the boundary file exists
    if (boundaryFile) {
      uploadBoundaryData.boundary.uploadedFile.push({
        filestoreId: boundaryFile.filestoreId,
        inputFileType: "xlsx",
        templateIdentifier: "Population",
        type: "boundaryWithTarget",
        filename: "Population Template.xlsx",
      });
      uploadBoundaryData.boundary.isSuccess = true;
    }

    // Enrich uploadFacilityData if the facility file exists
    if (facilityFile) {
      uploadFacilityData.facilityWithBoundary.uploadedFile.push({
        filestoreId: facilityFile.filestoreId,
        inputFileType: "xlsx",
        templateIdentifier: "Facilities",
        type: "facilityWithBoundary",
        filename: "Facility Template.xlsx",
      });
      uploadFacilityData.facilityWithBoundary.isSuccess = true;
    }
    if (boundaryFile) {
      draftFormData.UPLOADBOUNDARYDATA = uploadBoundaryData;
    }
    if (facilityFile) {
      draftFormData.UPLOADFACILITYDATA = uploadFacilityData;
    }

    const strategies = state?.ResourceDistributionStrategy;
    const togetherOrSeparately = state.RegistrationAndDistributionHappeningTogetherOrSeparately;
    const assumptionsForm = {
      assumptionsForm: {
        selectedRegistrationDistributionMode:{
          code : planObject?.additionalDetails?.isRegistrationAndDistributionHappeningTogetherOrSeparately,
          value : togetherOrSeparately?.find((mode) => mode.registrationAndDistributionHappeningTogetherOrSeparatelyCode === planObject?.additionalDetails?.isRegistrationAndDistributionHappeningTogetherOrSeparately)?.registrationAndDistributionHappeningTogetherOrSeparatelyName || null
        },
        selectedRegistrationProcess: {
          code: planObject?.additionalDetails?.RegistrationProcess,
          value: strategies?.find(
            (strategy) =>
              strategy.resourceDistributionStrategyCode ===
              planObject?.additionalDetails?.RegistrationProcess
          )?.resourceDistributionStrategyName || null,
        },
        selectedDistributionProcess: {
          code: planObject?.additionalDetails?.DistributionProcess,
          value: strategies?.find(
            (strategy) =>
              strategy.resourceDistributionStrategyCode ===
              planObject?.additionalDetails?.DistributionProcess
          )?.resourceDistributionStrategyName || null,
        },
      },
    };

    if (
      strategies && togetherOrSeparately && 
      (planObject?.additionalDetails?.RegistrationProcess ||
        planObject?.additionalDetails?.DistributionProcess || planObject?.additionalDetails?.isRegistrationAndDistributionHappeningTogetherOrSeparately)
    ) {
      draftFormData.ASSUMPTIONS_FORM = assumptionsForm;
    }

    const assumptionValues = [];
    if(planObject?.assumptions?.length > 0){
      for(const assumption of planObject?.assumptions){
        assumptionValues.push({
           source: assumption?.source,
           key: assumption?.key,
           value: assumption?.value,
           category: assumption?.category
        });
      }
      draftFormData.HYPOTHESIS = { Assumptions : {assumptionValues :  assumptionValues} };
    }

    if(planObject?.operations?.length > 0 && state?.RuleConfigureOperators?.length > 0){
      var formulaConfigValues = [];
      for(const operation of planObject?.operations){
        formulaConfigValues.push({
           source: operation?.source,
           input: operation?.input,
           output: operation?.output,
           category: operation?.category,
           assumptionValue : operation?.assumptionValue,
           operatorName : state?.RuleConfigureOperators?.find((rule) => rule?.operatorCode == operation?.operator)?.operatorName || operation?.operator || null,
           showOnEstimationDashboard:operation?.showOnEstimationDashboard 
        });
      }
      draftFormData.FORMULA_CONFIGURATION = { formulaConfiguration : {formulaConfigValues :  formulaConfigValues} };
    }
    const newColumns=planObject?.additionalDetails?.newColumns;
    if (newColumns) {
      if (!draftFormData["NEW_COLUMNS"]) {
        draftFormData["NEW_COLUMNS"] = {};
      }
    
      draftFormData["NEW_COLUMNS"]["newColumns"] = newColumns;
    }
    
    setParams(draftFormData);
  };
