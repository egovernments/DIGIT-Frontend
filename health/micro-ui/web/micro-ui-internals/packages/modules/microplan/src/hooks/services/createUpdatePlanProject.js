import _ from "lodash";
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

function updateFormulasSource(formulasToUpdate, assumptions) {
  // Extract keys of assumptions with source "CUSTOM"
  let customKeys = assumptions.filter((assumption) => assumption.source === "CUSTOM").map((assumption) => assumption.key);

  const customKeysFromFormula = formulasToUpdate?.filter((formula) => formula.source === "CUSTOM")?.map((formula) => formula.output);

  customKeys = [...customKeys, ...customKeysFromFormula];
  // Update the source of formulas based on the conditions
  return formulasToUpdate.map((formula) => {
    if (
      formula.source === "MDMS" && // Check if the formula's source is "MDMS"
      (customKeys.includes(formula.input) || customKeys.includes(formula.assumptionValue)) // Check if input or assumptionValue belongs to "CUSTOM"
    ) {
      // Dynamically add this formula's output to customKeys
      customKeys.push(formula.output);
      return { ...formula, source: "CUSTOM" }; // Update the source to "CUSTOM"
    }
    return formula; // Return unchanged formula otherwise
  });
}

// function updateFormulasSource(formulasToUpdate, assumptions) {
//   // Extract keys of assumptions with source "CUSTOM"
//   let customKeys = assumptions
//     .filter((assumption) => assumption.source === "CUSTOM")
//     .map((assumption) => assumption.key);

//   // Extract outputs from formulas already marked as "CUSTOM"
//   const customKeysFromFormula = formulasToUpdate
//     .filter((formula) => formula.source === "CUSTOM")
//     .map((formula) => formula.output);

//   customKeys = [...customKeys, ...customKeysFromFormula];

//   // Use a mutable approach to ensure only relevant formulas are updated
//   const updatedFormulas = [...formulasToUpdate];

//   updatedFormulas.forEach((formula) => {
//     // Check if the formula's source should be converted to "CUSTOM"
//     if (
//       formula.source === "MDMS" &&
//       (customKeys.includes(formula.input) || customKeys.includes(formula.assumptionValue))
//     ) {
//       // Update the formula's source
//       formula.source = "CUSTOM";

//       // Add the formula's output to customKeys dynamically
//       if (!customKeys.includes(formula.output)) {
//         customKeys.push(formula.output);
//       }
//     }
//   });

//   return updatedFormulas;
// }

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
      startDate: Math.floor(new Date(new Date().setDate(new Date().getDate() + 30)).getTime()),
      //hardcoding this rn to update campaign. Check with admin console team
      resources: [],
      projectType: totalFormData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code,
      additionalDetails: {
        resourceDistributionStrategy: totalFormData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode,
        source: "microplan",
        disease: totalFormData?.CAMPAIGN_DETAILS?.campaignDetails?.disease?.code,
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

/// we will update the name of microplan and and campaign
const UpdateResource = async (req, currentPlanObject, currentCampaignObject) => {
  //creating a microplan and campaign instance here
  const { totalFormData, state, setShowToast, setCurrentKey, setCurrentStep, config, campaignObject, planObject } = req;
  try {
    // Update the campaign object by keeping existing properties and only changing the name
    const updatedCampaignObject = {
      ...currentCampaignObject,
      campaignName: totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName,
    };

    const campaignRes = await Digit.CustomService.getResponse({
      url: "/project-factory/v1/project-type/update",
      body: {
        CampaignDetails: updatedCampaignObject,
      },
    });

    // Update the plan object by keeping existing properties and only changing the name
    const updatedPlanObject = {
      ...currentPlanObject,
      name: totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName,
      additionalDetails: { ...currentPlanObject.additionalDetails, key: req?.config?.key || "2" },
    };

    const planRes = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_update",
      useCache: false,
      method: "POST",
      userService: true,
      body: {
        PlanConfiguration: updatedPlanObject,
      },
    });

    if (campaignRes?.CampaignDetails?.id && planRes?.PlanConfiguration?.[0]?.id) {
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

const searchPlanEmployeeConfig = async (body) => {
  const response = await Digit.CustomService.getResponse({
    url: "/plan-service/employee/_search",
    useCache: false,
    method: "POST",
    userService: false,
    body,
  });
  return response;
};

const searchCampaignConfig = async (body) => {
  const response = await Digit.CustomService.getResponse({
    url: "/project-factory/v1/project-type/search",
    useCache: false,
    method: "POST",
    userService: false,
    body,
  });

  return response?.CampaignDetails?.[0];
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

const addColumnsForPlan=async (req)=>{
  const draftResponse=await Digit.CustomService.getResponse({
    url: "/resource-generator/drafts",
    body: req,
  });
  return draftResponse;
}



const updatePlanEmployee = async (req) => {
  const planEmployeeRes = await Digit.CustomService.getResponse({
    url: "/plan-service/employee/_update",
    body: req,
  });
  return planEmployeeRes;
};

/**
 * Documentation for the createUpdatePlanProject function
 *
 * This function handles creation and updates of plan and project based on different triggers(Triggers are screens' next button).
 *
 * Flow:
 * 1. Function takes a request object containing:
 *    - totalFormData: Form data from different screens
 *    - state: Application state
 *    - setShowToast: Toast notification setter
 *    - setCurrentKey: Current key setter
 *    - setCurrentStep: Current step setter
 *    - config: Configuration object
 *    - invalidateConfig: Config for data invalidation
 *
 * 2. Gets microplanId, campaignId and key from URL query params
 *
 * 3. Gets current tenant ID
 *
 * 4. If microplanId exists:
 *    - Fetches existing plan configuration using searchPlanConfig
 *
 * 5. If campaignId exists:
 *    - Fetches campaign details using searchCampaignConfig
 *
 * 6. Based on triggeredFrom config name:
 *    - CAMPAIGN_DETAILS: Increments key and step
 *    - MICROPLAN_DETAILS: Checks if update needed based on name change
 *    - HYPOTHESIS: Handles assumptions updates
 *    - SUB_HYPOTHESIS: Updates sub-hypothesis assumptions
 *    - FORMULA_CONFIGURATION: Validates and updates formula configurations
 *
 * 7. Returns appropriate response based on the trigger
 *
 * Key APIs Used:
 * - searchPlanConfig: Fetches plan configuration
 * - searchCampaignConfig: Fetches campaign details
 * - updatePlan: Updates plan configuration
 * - updateProject: Updates project details
 * - updatePlanEmployee: Updates plan employee details
 */

const createUpdatePlanProject = async (req) => {
  try {
    //later this object must have an invalidation config which can be used to invalidate data such as files uploaded,assumptions,formulas etc...

    const { totalFormData, state, setShowToast, setCurrentKey, setCurrentStep, config, invalidateConfig } = req;
    const { microplanId, campaignId, key } = Digit.Hooks.useQueryParams();
    // const key=config?.key;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    //now basically we need to decide from which screen this hook was triggered and take action accordingly
    let planObject = {};
    let campaignObject = {};
    if (microplanId) {
      planObject = await searchPlanConfig({
        PlanConfigurationSearchCriteria: {
          tenantId,
          id: microplanId,
        },
      });
    }
    if (campaignId) {
      campaignObject = await searchCampaignConfig({
        CampaignDetails: {
          tenantId: tenantId,
          ids: [campaignId],
        },
      });
    }


    const triggeredFrom = config.name;
    switch (triggeredFrom) {
      case "CAMPAIGN_DETAILS":
        setCurrentKey((prev) => prev + 1);
        setCurrentStep((prev) => prev + 1);
        return {
          triggeredFrom,
        };

      case "MICROPLAN_DETAILS":
        //here just check if microplanId and campaignId is already there then if microplan name is same as old one no need to do anything
        if (microplanId && campaignId && planObject?.name === totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return;
        }

        /// now check if microplan and campaign id is there but name need to be updated
        if (microplanId && campaignId && planObject?.name !== totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName) {
          // check if the name is valid
          const isResourceNameValid = await isValidResourceName(totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName);
          if (!isResourceNameValid) {
            setShowToast({ key: "error", label: "ERROR_MICROPLAN_NAME_ALREADY_EXISTS" });
            return;
          }
          // we will udpate the current planobject and campaign object
          const isResourceCreated = await UpdateResource(req, planObject, campaignObject);
          if (!isResourceCreated) {
            setShowToast({ key: "error", label: "ERROR_CREATING_MICROPLAN" });
            return;
          }
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);

          return {
            triggeredFrom,
          };
        } else {
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
        }

      case "BOUNDARY":
        // call an update to plan
        // also write logic to invalidate

        //fetch fresh campaignObject
        const campaignObjectForBoundary = await searchCampaignConfig({
          CampaignDetails: {
            tenantId: tenantId,
            ids: [campaignId],
          },
        });

        const prevSelectedBoundaries = campaignObjectForBoundary?.boundaries;
        //if both are equal then we don't even have to make any update call and we don't have to invalidate
        if (_.isEqual(prevSelectedBoundaries, totalFormData?.BOUNDARY?.boundarySelection?.selectedData)) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        }

        const updatedCampaignObject = {
          ...campaignObjectForBoundary,
          boundaries: totalFormData?.BOUNDARY?.boundarySelection?.selectedData,
        };
        const campaignResBoundary = await updateProject(updatedCampaignObject);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        //after updating campaign we need to update plan object as well to invalidate files since boundaries got changed

        //fetch fresh plan object
        const fetchedPlanForBoundaryInvalidate = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });
        //invalidate files
        const updatedPlanObjectForBoundaryInvalidate = {
          ...fetchedPlanForBoundaryInvalidate,
          additionalDetails: { ...fetchedPlanForBoundaryInvalidate.additionalDetails, key: key },
          files:
            fetchedPlanForBoundaryInvalidate?.files?.length > 0
              ? fetchedPlanForBoundaryInvalidate?.files?.map((file) => {
                  return {
                    ...file,
                    active: false,
                  };
                })
              : [],
        };

        const fetchedPlanEmployeeForBoundaryInvalidate = await searchPlanEmployeeConfig({
          PlanEmployeeAssignmentSearchCriteria: {
            tenantId: tenantId,
            planConfigurationId: microplanId,
            active: true,
          },
        });

        const updatedPlanEmployeeObjectForBoundaryInvalidate = {
          ...fetchedPlanEmployeeForBoundaryInvalidate,
          PlanEmployeeAssignment:
            fetchedPlanEmployeeForBoundaryInvalidate?.PlanEmployeeAssignment?.length > 0
              ? fetchedPlanEmployeeForBoundaryInvalidate.PlanEmployeeAssignment.map((employee) => ({
                  ...employee,
                  active: false,
                }))
              : [],
        };

        // update plan object
        const planUpdateForBoundaryInvalidation = await updatePlan(updatedPlanObjectForBoundaryInvalidate);
        // Call updatePlanEmployee for each item
        const planEmployeeAssignments = updatedPlanEmployeeObjectForBoundaryInvalidate.PlanEmployeeAssignment;
        let allEmployeesUpdated = true; // Flag to track employee update status

        if (planEmployeeAssignments.length > 0) {
          try {
            // Use Promise.all to update all employees concurrently
            await Promise.all(
              planEmployeeAssignments.map(async (employee) => {
                const employeeUpdateObject = {
                  ...fetchedPlanEmployeeForBoundaryInvalidate,
                  PlanEmployeeAssignment: employee, // Only update this specific employee
                };
                try {
                  const planEmployeeUpdateResponse = await updatePlanEmployee(employeeUpdateObject);
                } catch (error) {
                  allEmployeesUpdated = false; // Mark as false if any employee update fails
                }
              })
            );
          } catch (error) {
            allEmployeesUpdated = false;
          }
        }

        if (planUpdateForBoundaryInvalidation && allEmployeesUpdated) {
          // doing this after invalidating the session
          // setCurrentKey((prev) => prev + 1);
          // setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
            invalidateSession: true,
          };
        } else if (!planUpdateForBoundaryInvalidation) {
          setShowToast({ key: "error", label: "ERR_PLAN_UPDATE_FAILED" });
        } else if (!allEmployeesUpdated) {
          setShowToast({ key: "error", label: "ERR_EMPLOYEE_UPDATE_FAILED" });
        } else {
          setShowToast({ key: "error", label: "ERR_BOUNDARY_UPDATE" });
        }

      case "ASSUMPTIONS_FORM":
        // here we have to invalidate the existing assumptions in update call if there is a change in assumptionsForm
        // check whether the currentAssumptionsForm is equal to prev assumptionsForm (if so then skip this update call)

        if (
          _.isEqual(planObject?.additionalDetails?.assumptionsForm, totalFormData?.ASSUMPTIONS_FORM?.assumptionsForm) &&
          Object.keys(planObject?.additionalDetails?.assumptionsForm).length > 0
        ) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        }

        //otherwise update with invalidating assumptions and formula(operations)
        const invalidatedAssumptions =
          planObject.assumptions.length > 0
            ? planObject.assumptions.map((row) => {
                return {
                  ...row,
                  active: false,
                };
              })
            : [];
        const invalidatedOperations =
          planObject.operations.length > 0
            ? planObject.operations.map((row) => {
                return {
                  ...row,
                  active: false,
                };
              })
            : [];
        const updatedPlanObjAssumptionsForm = {
          ...planObject,
          assumptions: invalidatedAssumptions,
          operations: invalidatedOperations,
          additionalDetails: {
            ...planObject?.additionalDetails,
            assumptionsForm: totalFormData.ASSUMPTIONS_FORM.assumptionsForm,
            campaignType: totalFormData.CAMPAIGN_DETAILS.campaignDetails.campaignType.code,

            DistributionProcess: totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedDistributionProcess
              ? totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedDistributionProcess.code
              : totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode,

            RegistrationProcess: totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedRegistrationProcess
              ? totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedRegistrationProcess.code
              : totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode,

            resourceDistributionStrategyCode: totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode,

            isRegistrationAndDistributionHappeningTogetherOrSeparately:
              totalFormData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyCode === "MIXED"
                ? "SEPARATELY"
                : totalFormData.ASSUMPTIONS_FORM.assumptionsForm.selectedRegistrationDistributionMode?.code,
            key: key,
          },
        };
        const planResAssumptionsForm = await updatePlan(updatedPlanObjAssumptionsForm);
        if (planResAssumptionsForm?.PlanConfiguration?.[0]?.id) {
          // setCurrentKey((prev) => prev + 1);
          // setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
            invalidateSession: true,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_ASSUMPTIONS_FORM_UPDATE" });
        }

      case "HYPOTHESIS":
        //fetch current plan
        const fetchedPlanForHypothesis = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });
        //here we can always invalidate prev assumptions
        const prevAssumptions = fetchedPlanForHypothesis?.assumptions?.map((row) => {
          const updatedRow = {
            ...row,
            active: false,
          };
          return updatedRow;
        });
        const assumptionsToUpdate = totalFormData?.HYPOTHESIS?.Assumptions?.assumptionValues?.filter((row) => {
          return row.category && row.key && row.value;
        });
        const upatedPlanObjHypothesis = {
          ...fetchedPlanForHypothesis,
          assumptions: [...prevAssumptions, ...assumptionsToUpdate],
          additionalDetails: { ...fetchedPlanForHypothesis.additionalDetails, key: key },
        };

        const planResHypothesis = await updatePlan(upatedPlanObjHypothesis);
        if (planResHypothesis?.PlanConfiguration?.[0]?.id) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          window.dispatchEvent(new Event("isLastStep"));
          Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: null });
          Digit.Utils.microplanv1.updateUrlParams({ internalKey: null });
          return {
            triggeredFrom,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_ASSUMPTIONS_FORM_UPDATE" });
        }

      case "SUB_HYPOTHESIS":
        //first fetch current plan object
        const fetchedPlanForSubHypothesis = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });
        const prevAssumptionsForSubHypothesis =
          fetchedPlanForSubHypothesis?.assumptions.length > 0
            ? fetchedPlanForSubHypothesis?.assumptions?.map((row) => {
                const updatedRow = {
                  ...row,
                  active: false,
                };
                return updatedRow;
              })
            : [];

        //get the list of assumptions from UI
        const assumptionsToUpdateFromUI = req?.assumptionsToUpdate;
        //mix the current + api res
        const upatedPlanObjSubHypothesis = {
          ...fetchedPlanForSubHypothesis,
          assumptions: [...prevAssumptionsForSubHypothesis, ...assumptionsToUpdateFromUI],
          additionalDetails: { ...fetchedPlanForSubHypothesis.additionalDetails, key: key },
        };

        await updatePlan(upatedPlanObjSubHypothesis);
        return;

      case "FORMULA_CONFIGURATION":
        if (
          !totalFormData?.FORMULA_CONFIGURATION?.formulaConfiguration?.formulaConfigValues.every(
            (row) => row.category && row.output && row.input && row.operatorName && row.assumptionValue
          )
        ) {
          setShowToast({ key: "error", label: "ERR_FORMULA_MANDATORY" });
          return;
        }
        //fetch current plan
        const fetchedPlanForFormula = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });

        //here we can always invalidate prev assumptions
        const prevFormulas = fetchedPlanForFormula?.operations?.map((row) => {
          const updatedRow = {
            ...row,
            active: false,
          };
          return updatedRow;
        });
        const formulasToUpdate = totalFormData?.FORMULA_CONFIGURATION?.formulaConfiguration?.formulaConfigValues
          ?.filter((row) => {
            return row.category && row.output && row.input && row.operatorName && row.assumptionValue;
          })
          ?.map((row) => {
            const updatedRow = { ...row };
            const operatorName = row?.operatorName;
            delete updatedRow?.operatorName;
            updatedRow.operator = state?.RuleConfigureOperators?.find((operation) => operation.operatorName === operatorName)?.operatorCode;
            return updatedRow;
          });
        const formulasToUpdateWithUpdatedSource = updateFormulasSource(formulasToUpdate, fetchedPlanForFormula?.assumptions);
        //here we need to update the source of operations
        const updatedPlanObjFormula = {
          ...fetchedPlanForFormula,
          additionalDetails: { ...fetchedPlanForFormula.additionalDetails, key: key },
          operations: [...prevFormulas, ...formulasToUpdateWithUpdatedSource],
        };

        const planResFormula = await updatePlan(updatedPlanObjFormula);
        if (planResFormula?.PlanConfiguration?.[0]?.id) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          window.dispatchEvent(new Event("isFormulaLastStep"));
          Digit.Utils.microplanv1.updateUrlParams({ isFormulaLastVerticalStep: null });
          Digit.Utils.microplanv1.updateUrlParams({ formulaInternalKey: null });
          return {
            triggeredFrom,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_ASSUMPTIONS_FORM_UPDATE" });
        }

      case "SUB_FORMULA":
        //first fetch current plan object
        const fetchedPlanForSubFormula = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });
        // const currentCategory =
        const prevFormulaValues =
          fetchedPlanForSubFormula?.operations.length > 0
            ? fetchedPlanForSubFormula?.operations?.map((row) => {
                const updatedRow = {
                  ...row,
                  active: false,
                };
                return updatedRow;
              })
            : [];

        //get the list of assumptions from UI
        const formulasToUpdateFromUIForSubFormula = req?.formulasToUpdate
          ?.filter((row) => {
            return row.category && row.output && row.input && row.operatorName && row.assumptionValue;
          })
          ?.map((row) => {
            const updatedRow = { ...row };
            const operatorName = row?.operatorName;
            delete updatedRow?.operatorName;
            updatedRow.operator = state?.RuleConfigureOperators?.find((operation) => operation.operatorName === operatorName)?.operatorCode;
            return updatedRow;
          });
        //mix the current + api res
        const upatedPlanObjSubFormula = {
          ...fetchedPlanForSubFormula,
          operations: [...prevFormulaValues, ...formulasToUpdateFromUIForSubFormula],
          additionalDetails: { ...fetchedPlanForSubFormula.additionalDetails, key: key },
        };
        await updatePlan(upatedPlanObjSubFormula);
        return;

      case "UPLOADBOUNDARYDATA":
        const fetchedPlanForBoundary = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });
        let files = fetchedPlanForBoundary?.files || [];
        const boundaryFileStoreId = totalFormData?.UPLOADBOUNDARYDATA?.boundary?.uploadedFile?.[0]?.filestoreId;

        const populationFileIndex = files.findIndex((file) => file.templateIdentifier === "Population");

        // If a file with "Population" exists, update its filestoreId
        if (populationFileIndex !== -1) {
          files = files.map((file) => (file.templateIdentifier === "Population" ? { ...file, filestoreId: boundaryFileStoreId } : file));
        } else {
          // If no such file exists, add a new element to the files array
          files.push({
            filestoreId: boundaryFileStoreId,
            inputFileType: "Excel",
            templateIdentifier: "Population",
          });
        }
        const updatedPlanObjForBoundary = {
          ...fetchedPlanForBoundary,
          files,
          additionalDetails: { ...fetchedPlanForBoundary.additionalDetails, key: key },
        };

        const planResBoundary = await updatePlan(updatedPlanObjForBoundary);
        if (planResBoundary?.PlanConfiguration?.[0]?.id) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_BOUNDARY_FORM_UPDATE" });
        }

      case "UPLOADFACILITYDATA":
        const fetchedPlanForFacility = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });

        let filesForFacility = fetchedPlanForFacility?.files || [];
        const facilityFileStoreId = totalFormData?.UPLOADFACILITYDATA?.facilityWithBoundary?.uploadedFile?.[0]?.filestoreId;

        const facilityFileIndex = filesForFacility.findIndex((file) => file.templateIdentifier === "Facilities");

        // If a file with "Facility" exists, update its filestoreId
        if (facilityFileIndex !== -1) {
          filesForFacility = filesForFacility.map((file) =>
            file.templateIdentifier === "Facilities" ? { ...file, filestoreId: facilityFileStoreId } : file
          );
        } else {
          // If no such file exists, add a new element to the filesForFacility array
          filesForFacility.push({
            filestoreId: facilityFileStoreId,
            inputFileType: "Excel",
            templateIdentifier: "Facilities",
          });
        }
        const updatedPlanObjForFacility = {
          ...fetchedPlanForFacility,
          files: filesForFacility,
          additionalDetails: { ...fetchedPlanForFacility.additionalDetails, key: key },
        };

        const planResFacility = await updatePlan(updatedPlanObjForFacility);

        if (planResFacility?.PlanConfiguration?.[0]?.id) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_FACILITY_FORM_UPDATE" });
        }

      case "SUMMARY_SCREEN":
        //here we need to take complete setup action
        //update plan-config with workflow action
        const fetchedPlanForSummary = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });

        //Commenting update logic since setup completed is converting to draft complete
        //TODO: @Abishek do this upon freezing microplan
        // const updatedReqForCompleteSetup = {
        //   ...fetchedPlanForSummary,
        //   workflow: {
        //     action: "INITIATE",
        //     // "assignes": null,
        //     // "comments": null,
        //     // "verificationDocuments": null,
        //     // "rating": null
        //   },
        //   additionalDetails: {
        //     ...fetchedPlanForSummary.additionalDetails,
        //     setupCompleted: true, //we can put this in url when we come from microplan search screen to disable routing to other screens -> Only summary screen should show, or only allowed screens should show
        //   },
        // };
        //omitting the update call
        // const planResForCompleteSetup = await updatePlan(updatedReqForCompleteSetup);
        // const updatedReqForCompleteSetupNextAction = {
        //   ...fetchedPlanForSummary,
        //   workflow: {
        //     action: "START_DATA_APPROVAL",
        //     // "assignes": null,
        //     // "comments": null,
        //     // "verificationDocuments": null,
        //     // "rating": null
        //   },
        //   additionalDetails:{
        //     ...fetchedPlanForSummary.additionalDetails,
        //     setupCompleted:true,//we can put this in url when we come from microplan search screen to disable routing to other screens -> Only summary screen should show, or only allowed screens should show
        //   }
        // };
        // const planResForCompleteSetupNextAction = await updatePlan(updatedReqForCompleteSetupNextAction);

        //here do cleanup activity and go to next screen

        if (fetchedPlanForSummary?.id && Digit.Utils.microplanv1.validatePlanConfigForDraftDownload(fetchedPlanForSummary)) {
          // setCurrentKey((prev) => prev + 1);
          // setCurrentStep((prev) => prev + 1);
          return {
            triggeredFrom,
            redirectTo: `/${window.contextPath}/employee/microplan/draft-completed-response`,
            isState: true,
            state: {
              message: "DRAFT_COMPLETED",
              back: "BACK_TO_HOME",
              backlink: `/${window.contextPath}/employee`,
              responseId: fetchedPlanForSummary?.name,
              info: "DRAFT_MICROPLAN_SUCCESS_NAME",
              showDraftDownload:true,
              actionLabel: "DOWNLOAD_DRAFT_MICROPLAN",
              planObject : fetchedPlanForSummary
              // description: "SETUP_MICROPLAN_SUCCESS_RESPONSE_DESC",
            },
          };
        } else {
          setShowToast({ key: "error", label: "ERR_FAILED_TO_COMPLETE_DRAFT" });
        }

        case "NEW_COLUMNS": {
          // Fetch the current plan configuration
          const fetchedPlan = await searchPlanConfig({
            PlanConfigurationSearchCriteria: {
              tenantId,
              id: microplanId,
            },
          });
        
          // Safely extract existing plan columns (default to empty array)
          const existingColumns = fetchedPlan?.additionalDetails?.addColumns || [];
        
          // Safely extract new column values from form data
          const newColumnValues = Array.isArray(totalFormData?.NEW_COLUMNS?.newColumns)
            ? totalFormData.NEW_COLUMNS.newColumns.filter(item => item !== "")
            : [];
        
          // Function to compare existing and new columns based on 'value'
          const areColumnsSame = () => {
            if (existingColumns.length !== newColumnValues.length) return false;
        
            return existingColumns.every((existingItem, index) => {
              const newItem = newColumnValues[index];
              return existingItem?.value === newItem?.value;
            });
          };
        
          // Skip updatePlan if both sets of columns are the same
          if (areColumnsSame()) {
            setCurrentKey(prev => prev + 1);
            setCurrentStep(prev => prev + 1);
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: null });
            Digit.Utils.microplanv1.updateUrlParams({ internalKey: null });
            return { triggeredFrom };
          }
        
          // Otherwise, prepare updated plan object
          const updatedPlanObject = {
            ...fetchedPlan,
            additionalDetails: {
              ...fetchedPlan.additionalDetails,
              key: key,
              newColumns:  newColumnValues.filter(
                item => item !== null && item !== undefined && item !== ''
              )
            },
          };
        
          // Update the plan only if there's a difference
          const response = await updatePlan(updatedPlanObject);
        
          if (response?.PlanConfiguration?.[0]?.id) {
            setCurrentKey(prev => prev + 1);
            setCurrentStep(prev => prev + 1);
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: null });
            Digit.Utils.microplanv1.updateUrlParams({ internalKey: null });
            
          } else {
            setShowToast({ key: "error", label: "ERR_FAILED_TO_UPDATE_PLAN" });
          }

          const draftResponse = await addColumnsForPlan({
            DraftDetails: { planConfigurationId: microplanId, tenantId }
          });
          if (!draftResponse) {
            setShowToast({ key: "error", label: "ERR_FAILED_TO_UPDATE_DRAFT_PLAN" });
            return;
          }
          return { triggeredFrom };
        
        }
        

      case "ROLE_ACCESS_CONFIGURATION": {
        const fetchedPlan = await searchPlanConfig({
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        });
        const updatedPlanObject = {
          ...fetchedPlan,
          additionalDetails: { ...fetchedPlan.additionalDetails, key: key },
        };

        const response = await updatePlan(updatedPlanObject);
        // Return as expected
        if (response) {
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          window.dispatchEvent(new Event("isLastStep"));
          Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: null });
          Digit.Utils.microplanv1.updateUrlParams({ internalKey: null });
          return {
            triggeredFrom,
          };
        } else {
          setShowToast({ key: "error", label: "ERR_FAILED_TO_UPDATE_PLAN" });
        }
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
