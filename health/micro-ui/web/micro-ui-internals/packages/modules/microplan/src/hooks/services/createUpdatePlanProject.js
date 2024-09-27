const requestBodyGenerator = () => {};

//checking for duplicates
const isValidResourceName = async (name) => {
  try {
    if (!name) {
      console.error("Pls provide a name for microplan");
      throw new Error("Pls provide a name for microplan");
    }
    //search project
    const projectRes = await Digit.CustomService.getResponse({
      url: "/project-factory/v1/project-type/search",
      useCache: false,
      method: "POST",
      userService: false,
      body: {
        CampaignDetails: {
          campaignName: name,
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
      },
    });
    if (projectRes?.CampaignDetails.filter((row) => row.campaignName === name).length >= 1) {
      return false;
    }
    //search plan
    const planRes = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_search",
      useCache: false,
      method: "POST",
      userService: true,
      body: {
        PlanConfigurationSearchCriteria: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          name,
        },
      },
    });
    if (planRes?.PlanConfiguration.filter((row) => row.name === name).length >= 1) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error(error);
  }
};
//generating campaign and microplan
//this will only be called on first time create so it doesn't have to be generic
const CreateResource = async (req) => {
  //creating a microplan and campaign instance here
  const { totalFormData, state, setShowToast, setCurrentKey, setCurrentStep, config, campaignObject, planObject } = req;
  try {
    const campaignObject = {
      hierarchyType: state.hierarchyType,
      tenantId: Digit.ULBService.getCurrentTenantId(),
      action: "draft",
      parentId: null,
      campaignName: totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName,
      resources: [],
      projectType: totalFormData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code,
      additionalDetails: {
        source: "microplan",
      },
    };
    const campaignRes = await Digit.CustomService.getResponse({
      url: "/project-factory/v1/project-type/create",
      body: {
        CampaignDetails: campaignObject,
      },
    });
    const planRes = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_create",
      useCache: false,
      method: "POST",
      userService: true,
      body: {
        PlanConfiguration: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          name: totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName,
          campaignId: campaignRes?.CampaignDetails?.id,
          status: "DRAFT",
          files: [],
          assumptions: [],
          operations: [],
          resourceMapping: [],
          additionalDetails: {
            key: config.key,
          },
        },
      },
    });
    if (camapaignRes?.CampaignDetails?.id && planRes?.PlanConfiguration?.id) {
      Digit.Utils.microplanv1.updateUrlParams({
        microplanId: camapaignRes?.CampaignDetails?.id,
        campaignId: planRes?.PlanConfiguration?.id,
      });
      return true;
    }
    return false;
  } catch (error) {
    if (!error?.response?.data?.Errors[0].description) {
      throw new Error(error?.response?.data?.Errors[0].code);
    } else {
      throw new Error(error?.response?.data?.Errors[0].description);
    }
  }
};

const updatePlan = async (req) => {
  const planRes = await Digit.CustomService.getResponse({
    url: "/project-factory/v1/project-type/update",
    body: {
      CampaignDetails: req,
    },
  });

  return planRes;
};

const createUpdatePlanProject = async (req) => {
  try {
    //later this object must have an invalidation config which can be used to invalidate data such as files uploaded,assumptions,formulas etc...
    const { totalFormData, state, setShowToast, setCurrentKey, setCurrentStep, config, campaignObject, planObject } = req;
    const { microplanId, campaignId } = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    //now basically we need to decide from which screen this hook was triggered and take action accordingly

    const triggeredFrom = config.name;

    switch (triggeredFrom) {
      case "CAMPAIGN_DETAILS":
        setCurrentKey((prev) => prev + 1);
        setCurrentStep((prev) => prev + 1);
        return {
          triggeredFrom,
        };

      case "MICROPLAN_DETAILS":
        //both the screens will be freezed so don't need to do anything
        //here just check if microplanId and campaignId is already there then don't do anything (details will be freezed so only create will be required no update)
        if (microplanId && campaignId) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return;
        }
        //if we reach here then we need to create a plan and project instance
        // validate campaign and microplan name feasible or not -> search campaign + search plan
        const isResourceNameValid = await isValidResourceName(totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName);
        if (!isResourceNameValid) {
          setShowToast({ key: "error", label: "ERROR_MICROPLAN_NAME_ALREADY_EXISTS" });
          return;
        }
        const isResourceCreated = await CreateResource(req);
        if (!isResourceCreated) {
          setShowToast({ key: "error", label: "ERROR_CREATING_MICROPLAN" });
          return;
        }

        return {
          triggeredFrom,
        };

      case "BOUNDARY":
        // call an update to plan
        // also write logic to invalidate
        const updatedCampaignObject = {
          ...campaignObject,
          boundaries: totalFormData?.BOUNDARY?.boundarySelection?.selectedData,
        };
        const planRes = await updatePlan(updatedCampaignObject);
        if (planRes?.CampaignDetails?.id) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_BOUNDARY_UPDATE" });
        }

      default:
        setShowToast({ key: "error", label: "ERROR_UNHANDLED_NEXT_OPERATION" });
        return {
          triggeredFrom,
        };
    }

    //req will have{totalFormData,contextData,config,...additionalData}
    //config will have information about from which part of the UI this API call was triggered and what all to update/create(based on key we can decide)
    // we'll have a function that translates totalFormData to plan object
    // we'll have a function that translates totalFormData to campaign object
    // this hook only should decide what all to create/invalidate/update
    // here only we should generate req bodies
    // validate campaign name
    // validate microplan name
    // create/update draft campaign
    // create/update draft microplan

    //if trigger from "MICROPLAN_DETAILS" -> update/create

    return {
      toastObject: { key: "error", label: "ERROR_BOUNDARY_SELECTION" },
    };
    // try {
    //   const response = await Digit.CustomService.getResponse({
    //     url: "/project-factory/v1/project-type/create",
    //     body: {
    //       CampaignDetails: req,
    //     },
    //   });
    //   return response;
    // } catch (error) {
    //   if (!error?.response?.data?.Errors[0].description) {
    //     throw new Error(error?.response?.data?.Errors[0].code);
    //   } else {
    //     throw new Error(error?.response?.data?.Errors[0].description);
    //   }
    // }
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error(error);
  }
};

export default createUpdatePlanProject;
