import _ from "lodash"
const requestBodyGenerator = () => { };

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

    if (campaignRes?.CampaignDetails?.id && planRes?.PlanConfiguration?.[0]?.id) {
      Digit.Utils.microplanv1.updateUrlParams({
        microplanId: planRes?.PlanConfiguration?.[0]?.id,
        campaignId: campaignRes?.CampaignDetails?.id,
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

const searchPlanConfig = async (body) => {
  //assuming it will be success
  const response = await Digit.CustomService.getResponse({
    url: "/plan-service/config/_search",
    useCache: false,
    method: "POST",
    userService: true,
    body,
  });
  return response?.PlanConfiguration?.[0];
};

const updateProject = async (req) => {
  const planRes = await Digit.CustomService.getResponse({
    url: "/project-factory/v1/project-type/update",
    body: {
      CampaignDetails: req,
    },
  });

  return planRes;
};

const updatePlan = async (req) => {
  const planRes = await Digit.CustomService.getResponse({
    url: "/plan-service/config/_update",
    body: {
      PlanConfiguration: req,
    },
  });
  return planRes;
};

const createUpdatePlanProject = async (req) => {
  try {
    //later this object must have an invalidation config which can be used to invalidate data such as files uploaded,assumptions,formulas etc...

    const { totalFormData, state, setShowToast, setCurrentKey, setCurrentStep, config, campaignObject, planObject,invalidateConfig } = req;
    const { microplanId, campaignId } = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getCurrentTenantId()
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
        setCurrentKey((prev) => prev + 1);
        setCurrentStep((prev) => prev + 1);

        return {
          triggeredFrom,
        };

      case "BOUNDARY":
        // call an update to plan
        // also write logic to invalidate
        const updatedCampaignObject = {
          ...campaignObject,
          boundaries: totalFormData?.BOUNDARY?.boundarySelection?.selectedData,
          startDate: Math.floor(new Date(new Date().setDate(new Date().getDate() + 100)).getTime())
          //hardcoding this rn to update campaign. Check with admin console team
        };
        const campaignResBoundary = await updateProject(updatedCampaignObject);
        if (campaignResBoundary?.CampaignDetails?.id) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_BOUNDARY_UPDATE" });
        }

      case "ASSUMPTIONS_FORM":
        // here we have to invalidate the existing assumptions in update call if there is a change in assumptionsForm
        // check whether the currentAssumptionsForm is equal to prev assumptionsForm (if so then skip this update call)

        
        if(_.isEqual(planObject?.additionalDetails?.assumptionsForm,totalFormData?.ASSUMPTIONS_FORM?.
          assumptionsForm
          )){
            setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        }
        //otherwise update with invalidating assumptions and formula(operations)
        const invalidatedAssumptions = planObject.assumptions.length>0 ? planObject.assumptions.map(row =>{
          return {
            ...row,
            active:false
          }
        }) : []
        const invalidatedOperations = planObject.operations.length>0 ? planObject.assumptions.map(row =>{
          return {
            ...row,
            active:false
          }
        }) : []
        const updatedPlanObjAssumptionsForm = {
          ...planObject,
          assumptions:invalidatedAssumptions,
          operations:invalidatedOperations,
          additionalDetails:{
            ...planObject?.additionalDetails,
            assumptionsForm:totalFormData.ASSUMPTIONS_FORM.assumptionsForm,
            campaignType: totalFormData.CAMPAIGN_DETAILS.campaignDetails.campaignType.code,

            DistributionProcess:totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedDistributionProcess ? totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedDistributionProcess.code :  totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode,

            RegistrationProcess:totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedRegistrationProcess?totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedRegistrationProcess.code :totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode,

            resourceDistributionStrategyCode: totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode,

            isRegistrationAndDistributionHappeningTogetherOrSeparately: totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode==="MIXED" ?"SEPARATELY": totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedRegistrationDistributionMode?.code,

          }
        }
        const planResAssumptionsForm = await updatePlan(updatedPlanObjAssumptionsForm);
        if(planResAssumptionsForm?.PlanConfiguration?.[0]?.id){
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        }else {
          setShowToast({ key: "error", label: "ERR_ASSUMPTIONS_FORM_UPDATE" });
        }
       




      case "HYPOTHESIS":
        //fetch current plan
        const fetchedPlanForHypothesis = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        })
        //here we can always invalidate prev assumptions
        const prevAssumptions = fetchedPlanForHypothesis?.assumptions?.map(row => {
          const updatedRow = {
            ...row,
            active:false
          }
          return updatedRow
        })
        const assumptionsToUpdate = totalFormData?.HYPOTHESIS?.Assumptions?.assumptionValues?.filter(row => {
          return row.category && row.key && row.value
        })
        const upatedPlanObjHypothesis = {
          ...fetchedPlanForHypothesis,
          assumptions:[
            ...prevAssumptions,
            ...assumptionsToUpdate
          ]
        }

        const planResHypothesis = await updatePlan(upatedPlanObjHypothesis);
        if(planResHypothesis?.PlanConfiguration?.[0]?.id){
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          window.dispatchEvent(new Event("isLastStep"))
          return {
            triggeredFrom,
          };
        }else {
          setShowToast({ key: "error", label: "ERR_ASSUMPTIONS_FORM_UPDATE" });
        }
      case "SUB_HYPOTHESIS":
        //first fetch current plan object
        const fetchedPlanForSubHypothesis = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        })
        const prevAssumptionsForSubHypothesis = fetchedPlanForSubHypothesis?.assumptions?.map(row => {
          const updatedRow = {
            ...row,
            active:false
          }
          return updatedRow
        })
        //get the list of assumptions from UI
        const assumptionsToUpdateFromUI = req?.assumptionsToUpdate
        //mix the current + api res
        const upatedPlanObjSubHypothesis = {
          ...fetchedPlanForSubHypothesis,
          assumptions:[
            ...prevAssumptionsForSubHypothesis,
            ...assumptionsToUpdateFromUI
          ]
        }

        await updatePlan(upatedPlanObjSubHypothesis);
        return;
      case "UPLOADDATA":
        setCurrentKey((prev) => prev + 1);
        setCurrentStep((prev) => prev + 1);
        return {
          triggeredFrom,
        };

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
