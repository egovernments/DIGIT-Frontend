import React, { useState, useEffect, Fragment, createContext, useContext } from "react";
import FormulaConfiguration from "./FormulaConfiguration";
import { Stepper, TextBlock, ActionBar, Button, Card, Toast, Loader } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";
import { useTranslation } from "react-i18next";

const FormulaContext = createContext("formulaContext");

export const useFormulaContext = () => {
  return useContext(FormulaContext);
};

const FormulaConfigWrapper = ({ onSelect, props: customProps }) => {
  const { mutate: updateResources, ...rest } = Digit.Hooks.microplanv1.useCreateUpdatePlanProject();
  const [manualLoader, setManualLoader] = useState(false);
  const { t } = useTranslation();
  const { state } = useMyContext();
  const [formulaParams, setFormulaParams, clearFormulaParams] = Digit.Hooks.useSessionStorage("FORMULA_DATA", {});
  const [formulaConfigValues, setFormulaConfigValues] = useState(
    // Digit.SessionStorage.get("MICROPLAN_DATA")?.FORMULA_CONFIGURATION?.formulaConfiguration?.formulaConfigValues || []
    Digit.SessionStorage.get("FORMULA_DATA")?.formulaConfigValues || []
  );
  const assumptionsFormValues = customProps?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm; //array with key value pair
  const campaignType = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code;
  const resourceDistributionStrategyCode =
    customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode;
  const searchParams = new URLSearchParams(window.location.search);
  const [formulaInternalKey, setFormulaInternalKey] = useState(() => {
    const keyParam = searchParams.get("formulaInternalKey");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [showToast, setShowToast] = useState(null);
  const [deletedFormulas, setDeletedFormulas] = useState([]);
  const [executionCount, setExecutionCount] = useState(0);
  const [assumptions, setAssumptions] = useState([]);
  const [defautFormula, setDefaultFormula] = useState(["NEW_FORMULA"]);
  const [customFormula, setCustomFormula] = useState([]);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const assumptionsInPlan = Digit.SessionStorage.get("MICROPLAN_DATA")?.HYPOTHESIS?.Assumptions?.assumptionValues
    ? Digit.SessionStorage.get("MICROPLAN_DATA")?.HYPOTHESIS?.Assumptions?.assumptionValues
    : [];
  const { isLoading: isLoadingPlanObject, data: planObject, error: errorPlan, refetch: refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
    {
      PlanConfigurationSearchCriteria: {
        tenantId,
        id: microplanId,
      },
    },
    {
      enabled: microplanId ? true : false,
      cacheTime: 0,
      //   queryKey: currentKey,
    }
  );
  useEffect(() => {
    const curr = Digit.SessionStorage.get("MICROPLAN_DATA")?.FORMULA_CONFIGURATION?.formulaConfiguration?.formulaConfigValues;
    if (curr?.length > 0) {
      setFormulaParams(curr);
      setFormulaConfigValues(curr);
    }
  }, []);

  useEffect(() => {
    if (planObject?.operations?.length > 0 && state?.RuleConfigureOperators?.length > 0) {
      const currentSession = Digit.SessionStorage.get("FORMULA_DATA");
      var formulaConfigValues = [];
      for (const operation of planObject?.operations) {
        formulaConfigValues.push({
          source: operation?.source,
          input: operation?.input,
          output: operation?.output,
          category: operation?.category,
          assumptionValue: operation?.assumptionValue,
          operatorName:
            state?.RuleConfigureOperators?.find((rule) => rule?.operatorCode == operation?.operator)?.operatorName || operation?.operator || null,
          showOnEstimationDashboard: operation?.showOnEstimationDashboard,
        });
      }
      setFormulaParams({
        ...currentSession,
        formulaConfigValues: formulaConfigValues,
      });
    }
  }, [planObject]);

  const filteredAutoFilledRuleConfigurations = state.AutoFilledRuleConfigurations?.filter((item) => {
    const isHouseToHouseOrFixedPost = resourceDistributionStrategyCode === "HOUSE_TO_HOUSE" || resourceDistributionStrategyCode === "FIXED_POST";

    if (isHouseToHouseOrFixedPost) {
      return (
        campaignType === item.campaignType &&
        resourceDistributionStrategyCode === item.resourceDistributionStrategyCode &&
        assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item.isRegistrationAndDistributionHappeningTogetherOrSeparately
      );
    }

    return (
      campaignType === item.campaignType &&
      resourceDistributionStrategyCode === item.resourceDistributionStrategyCode &&
      assumptionsFormValues?.selectedRegistrationProcess?.code === item?.RegistrationProcess &&
      assumptionsFormValues?.selectedDistributionProcess?.code === item.DistributionProcess
    );
  });
  const [filteredFormulas, setFilteredFormulas] = useState([]);
  const ruleConfigurationCategories =
    filteredAutoFilledRuleConfigurations?.length > 0 ? filteredAutoFilledRuleConfigurations[0].ruleConfigurationCategories : [];
  //array of objects each with input, output, operatorName, assumptionValue

  const currentCategoryRuleConfigurations =
    ruleConfigurationCategories?.length > 0 ? ruleConfigurationCategories[formulaInternalKey - 1]?.ruleConfigurations || [] : [];
  const currentCategory = ruleConfigurationCategories[formulaInternalKey - 1]?.category;

  useEffect(() => {
    const temp = formulaConfigValues?.filter((i) => i.category === currentCategory && i.source === "CUSTOM") || [];
    setCustomFormula(temp);
  }, [formulaInternalKey, formulaConfigValues]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default Enter key behavior globally
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigateBack = () => {
    if (formulaInternalKey > 1) {
      setFormulaInternalKey((prevKey) => prevKey - 1);
    }
  };
  const isFormulaLastStep = () => {
    //deleting these params at last step
    Digit.Utils.microplanv1.updateUrlParams({ isFormulaLastVerticalStep: null });
    Digit.Utils.microplanv1.updateUrlParams({ formulaInternalKey: null });
  };

  //  const updateUrlParams = (params) => {
  //     const url = new URL(window.location.href);
  //     Object.entries(params).forEach(([key, value]) => {
  //         url.searchParams.set(key, value);
  //     });
  //     window.history.replaceState({}, "", url);
  // };

  //updating url params
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
  };

  const handleFormulaChange = (output, type, value, category) => {
    //const newValue = event.target.value;
    setFormulaConfigValues((prevValues) => {
      return prevValues.map((formula) => {
        // If the key matches, update the value; otherwise, return the existing assumption
        if (formula.output === output) {
          return {
            ...formula,
            source: formula?.source || "MDMS",
            category,
            [type]: value?.code, // Set to null if input is empty
          };
        }
        return formula;
      });
    });
  };

  useEffect(() => {
    setFilteredFormulas(
      currentCategoryRuleConfigurations?.map((row) => {
        return {
          ...row,
          category: currentCategory,
        };
      })
    );
  }, [currentCategoryRuleConfigurations]);

  const handleNext = () => {
    if (formulaConfigValues?.filter((row) => row?.category === currentCategory)?.length === 0) {
      setShowToast({
        key: "error",
        label: t("ATLEAST_ONE_FORMULA"),
        transitionTime: 3000,
      });
      return;
    } else if (formulaConfigValues.some((i) => i.operatorName === "SUBSTRACTION" && i.input === i.assumptionValue)) {
      setShowToast({
        key: "error",
        label: t("ERR_MANDATORY_FIELD_SAME_OPERAND"),
        transitionTime: 3000,
      });
      return;
      } else if (
        formulaConfigValues
          .filter((row) => row.category === currentCategory)
          .some((row) => !row.assumptionValue || !row.input || !row.output || !row.operatorName)
      ) {
        //will do this on onSuccess
        // if (formulaInternalKey < ruleConfigurationCategories?.length) {
        //   setFormulaInternalKey((prevKey) => prevKey + 1); // Update key in URL
        // }
        setShowToast({
          key: "error",
          label: t("ERR_MANDATORY_FIELD"),
          transitionTime: 3000,
        });
        return;
      } else {
    
    }

    if(formulaConfigValues
      .filter((row) => row.category === currentCategory)
      .some((row) => !row.assumptionValue || !row.input || !row.output || !row.operatorName)){
      setShowToast({
        key: "error",
        label: t("ERR_MANDATORY_FIELD"),
        transitionTime: 3000,
      });
      return;
    }
    // TODO: here update plan config
    setManualLoader(true);
    // const formulasToUpdate = formulaConfigValues.filter(row => row.category === currentCategory)
    const formulasToUpdate = formulaConfigValues;
    updateResources(
      {
        config: {
          name: "SUB_FORMULA",
        },
        formulasToUpdate,
        state,
      },
      {
        onSuccess: (data) => {
          setManualLoader(false);
          if (formulaInternalKey < ruleConfigurationCategories?.length) {
            setShowToast(null);
            setFormulaInternalKey((prevKey) => prevKey + 1); // Update key in URL
          }
          refetchPlan();
          // TODO: here see if session can be updated (refresh)
        },
        onError: (error, variables) => {
          setManualLoader(false);
          console.error(error);
          // setShowToast()

          setShowToast({ key: "error", label: error?.message ? error.message : t("FAILED_TO_UPDATE_RESOURCE") });
        },
      }
    );
    //simply returning from here, rest of the code is not required for now maybe required later
    return;

    //array of objects each with input, output, operatorName, assumptionValue
    const currentRuleConfigurations = ruleConfigurationCategories[formulaInternalKey - 1]?.ruleConfigurations || [];
    const existingFormulaOutputs = formulaConfigValues?.map((formula) => formula.output);

    //Filter current rule Configurations to only those that exist in formulaConfigValues and are not deleted
    const visibleFormulas = currentRuleConfigurations.filter(
      (item) => existingFormulaOutputs?.includes(item.output) && !deletedFormulas?.includes(item.output)
    );

    //Validate: Check if any value is empty for visible Formulas
    const hasEmptyFields = visibleFormulas.some((item) => {
      const formulaConfig = formulaConfigValues.find((formula) => formula.output === item.output);
      return !formulaConfig || !formulaConfig.input || !formulaConfig.operatorName || !formulaConfig.assumptionValue; // Check if any value is empty
    });

    // Move to the next step if validation passes
    if (formulaInternalKey < ruleConfigurationCategories?.length) {
      setFormulaInternalKey((prevKey) => prevKey + 1); // Update key in URL
    }
  };

  const handleBack = () => {
    if (formulaInternalKey > 1) {
      setFormulaInternalKey((prevKey) => prevKey - 1); // Update key in URL
    } else {
      window.dispatchEvent(new Event("revertToPreviousScreenFromFormula"));
    }
  };

  const handleStepClick = (step) => {
    // Step is zero-based, so we adjust by adding 1
    const currentStepIndex = formulaInternalKey - 1; // Current step index (zero-based)

    // // Check if the clicked step is the next step
    if (step === currentStepIndex + 1) {
      // Validate current step
      const currentRuleConfigurations = ruleConfigurationCategories[currentStepIndex]?.ruleConfigurations || [];
      const existingFormulaOutputs = formulaConfigValues?.map((formula) => formula.output);
      const visibleFormulas = currentRuleConfigurations?.filter(
        (item) => existingFormulaOutputs?.includes(item.output) && !deletedFormulas?.includes(item.output)
      );

      // Check for empty fields in visible formulas
      const hasEmptyFields = visibleFormulas.some((item) => {
        const formulaConfig = formulaConfigValues.find((formula) => formula.output === item.output);
        return !formulaConfig || !formulaConfig.input || !formulaConfig.operatorName || !formulaConfig.assumptionValue; // Check if any value is empty
      });

      if (hasEmptyFields) {
        setShowToast({
          key: "error",
          label: t("ERR_MANDATORY_FIELD"),
          transitionTime: 3000,
        });
        return;
      }

      // Move to the next step if validation passes
      setFormulaInternalKey(step + 1); // Move to the next step
    }
    // Allow going back to any previous step
    else if (step < currentStepIndex) {
      setFormulaInternalKey(step + 1); // Move back to the selected step
    }
    // Prevent jumping ahead to a later step if the user hasn't filled the required fields
    else if (step > currentStepIndex + 1) {
      setShowToast({
        key: "error",
        label: t("ERR_SKIP_STEP"),
        transitionTime: 3000,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("verticalStepper", navigateBack);
    return () => {
      window.removeEventListener("verticalStepper", navigateBack);
    };
  }, [formulaInternalKey]);

  useEffect(() => {
    window.addEventListener("isFormulaLastStep", isFormulaLastStep);
    return () => {
      Digit.Utils.microplanv1.updateUrlParams({ isFormulaLastVerticalStep: null });
      Digit.Utils.microplanv1.updateUrlParams({ formulaInternalKey: null });
      window.removeEventListener("isFormulaLastStep", isFormulaLastStep);
    };
  }, []);

  useEffect(() => {
    onSelect(customProps.name, { formulaConfigValues });
  }, [formulaConfigValues, formulaInternalKey]);
  useEffect(() => {
    if (executionCount < 5) {
      onSelect(customProps.name, { formulaConfigValues });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });
  useEffect(() => {
    updateUrlParams({ formulaInternalKey });
  }, [formulaInternalKey]);

  useEffect(() => {
    //TODO:
    // calculate this based on prevOutputs and inputs as well
    // only check for legal values for assumptions only not outputs and inputs
    const legalValuesForAssumptions = assumptionsInPlan?.map((assumption) => assumption.key);
    const prevOutputs = [];
    const prevInputs = [];
    //if item is there in allAssumptions that means it has to be in legalValueForAssumptions if not then set as empty otherwise the autofilled value is not part of the assumption so let it set
    const allAssumptions = state?.allAssumptions?.length > 0 ? state?.allAssumptions : [];
    const initialFormulas = filteredFormulas.map((item) => {
      const updatedObj = {
        source: "MDMS",
        category: currentCategory,
        input: item.input,
        output: item.output,
        operatorName: item.operatorName,
        //check this assumption is there in plan object or not
        assumptionValue: allAssumptions.includes(item.assumptionValue)
          ? legalValuesForAssumptions?.includes(item.assumptionValue) ||
            prevOutputs?.includes(item.assumptionValue) ||
            prevInputs?.includes(item.assumptionValue)
            ? item.assumptionValue
            : ""
          : item.assumptionValue,
        // assumptionValue:item.assumptionValue,
        showOnEstimationDashboard: true,
      };

      prevOutputs.push(item.output);
      return updatedObj;
    });
    const existingOutputs = new Set(formulaConfigValues.map((formula) => formula.output));
    const newFormulas = initialFormulas?.filter((formula) => !existingOutputs.has(formula.output) && !deletedFormulas.includes(formula.output));

    setFormulaConfigValues((prev) => [...prev, ...newFormulas]);
  }, [filteredFormulas]);

  //useEffect to support draft functionality deleted ones should not be shown
  useEffect(() => {
    //if planObject.operations is there that means already some assumptions were filled
    // in that case don't render the deleted ones because for them session will not be there
    // basically preset the deleted ones
    // const currentCategory = assumptionCategories?.[internalKey - 1]?.category
    if (planObject?.operations?.length > 0 && currentCategory && filteredFormulas?.length > 0) {
      // this is the list of items already filled for this microplan for this category
      const formulasFilledForThisCategory = planObject?.operations?.filter((row) => row.category === currentCategory)?.map((row) => row.output);
      // if this category is not yet filled
      if (formulasFilledForThisCategory.length === 0) {
        return;
      }
      // filteredFormulas -> this is the current list from master data
      // basically what all is there in filteredFormulas, some of them could have been deleted so if something is there in formulasFilledForThisCategory but not in filteredFormulas then put that in deleted ones
      const deletedFormulasForThisCategory = filteredFormulas
        ?.filter((item) => item.category === currentCategory)
        ?.map((row) => row.output)
        ?.filter((item) => !formulasFilledForThisCategory.includes(item));
      if (deletedFormulasForThisCategory.length > 0) {
        setDeletedFormulas((prev) => [...prev, ...deletedFormulasForThisCategory]);
        //here set formula config values as well
        setFormulaConfigValues((prev) => {
          return [...prev.filter((prevFormula) => !deletedFormulasForThisCategory.includes(prevFormula.output))];
        });
      }
    }
  }, [planObject, isLoadingPlanObject, formulaInternalKey, filteredFormulas]);

  //to get existing assumptions to provide options for assumptionValue dropdown

  useEffect(() => {
    // Step 1: Filter assumptions based on current category
    if (assumptionsInPlan?.length > 0) {
      // const filteredAssumptions = assumptionsInPlan?.filter((assumption) => assumption.category === currentCategory);

      // Step 2: Extract keys from filtered assumptions
      const keys = assumptionsInPlan?.map((assumption) => assumption.key);
      setAssumptions(keys);
    }
  }, [currentCategory, formulaConfigValues, setFormulaConfigValues]);

  useEffect(() => {
    if (formulaInternalKey === ruleConfigurationCategories?.length) {
      Digit.Utils.microplanv1.updateUrlParams({ isFormulaLastVerticalStep: true });
    } else {
      // Assuming 1 is the first step
      Digit.Utils.microplanv1.updateUrlParams({ isFormulaLastVerticalStep: false });
    }
  }, [formulaInternalKey, ruleConfigurationCategories]);

  //array of objects each with operatorCode and operatorName
  const operators = state.RuleConfigureOperators;
  const filteredRuleConfigureInputs = state.RuleConfigureInputs.filter((item) => {
    const isHouseToHouseOrFixedPost = resourceDistributionStrategyCode === "HOUSE_TO_HOUSE" || resourceDistributionStrategyCode === "FIXED_POST";

    if (isHouseToHouseOrFixedPost) {
      return (
        campaignType === item?.campaignType &&
        resourceDistributionStrategyCode === item?.resourceDistributionStrategyCode &&
        assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item?.isRegistrationAndDistributionHappeningTogetherOrSeparately
      );
    }

    return (
      campaignType === item?.campaignType &&
      resourceDistributionStrategyCode === item?.resourceDistributionStrategyCode &&
      assumptionsFormValues?.selectedRegistrationProcess?.code === item?.RegistrationProcess &&
      assumptionsFormValues?.selectedDistributionProcess?.code === item?.DistributionProcess
    );
  });

  const inputCategories = filteredRuleConfigureInputs?.length > 0 ? filteredRuleConfigureInputs[0].inputCategories : [];
  //array of input labels
  const filteredInputs = inputCategories?.length > 0 ? inputCategories[formulaInternalKey - 1]?.inputs || [] : [];

  const filteredRuleConfigureOutputs = state.RuleConfigureOutput?.filter((item) => {
    const isHouseToHouseOrFixedPost = resourceDistributionStrategyCode === "HOUSE_TO_HOUSE" || resourceDistributionStrategyCode === "FIXED_POST";

    if (isHouseToHouseOrFixedPost) {
      return (
        campaignType === item?.campaignType &&
        resourceDistributionStrategyCode === item?.resourceDistributionStrategyCode &&
        assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item?.isRegistrationAndDistributionHappeningTogetherOrSeparately
      );
    }

    return (
      campaignType === item?.campaignType &&
      resourceDistributionStrategyCode === item?.resourceDistributionStrategyCode &&
      assumptionsFormValues?.selectedRegistrationProcess?.code === item?.RegistrationProcess &&
      assumptionsFormValues?.selectedDistributionProcess?.code === item?.DistributionProcess
    );
  });

  const outputCategories = filteredRuleConfigureOutputs?.length > 0 ? filteredRuleConfigureOutputs[0].outputCategories : [];
  //array of ouput labels
  const filteredOutputs = outputCategories?.length > 0 ? outputCategories[formulaInternalKey - 1]?.outputs || [] : [];

  customProps.filteredInputs = filteredInputs;
  customProps.filteredOutputs = filteredOutputs;
  customProps.operators = operators;
  customProps.assumptions = assumptions;

  if (isLoadingPlanObject || manualLoader) {
    return <Loader />;
  }

  return (
    <Fragment>
      <FormulaContext.Provider
        value={{
          formulaConfigValues,
          handleFormulaChange,
          setFormulaConfigValues,
          deletedFormulas,
          setDeletedFormulas,
          assumptionsInPlan,
          defautFormula,
          setDefaultFormula,
        }}
      >
        <div className="container-full">
          <div className="card-container" style={{ marginBottom: "2.5rem" }}>
            <Card className="card-header-timeline">
              <TextBlock subHeader={t("FORMULA_CONFIGURATION")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
            </Card>
            <Card className="vertical-stepper-card">
              <Stepper
                customSteps={ruleConfigurationCategories.map((category) => `FORMULA_${category.category}`)}
                currentStep={formulaInternalKey}
                onStepClick={() => null}
                direction={"vertical"}
              />
            </Card>
          </div>

          <div className="card-container" style={{ width: "100%", marginBottom: "2.5rem",maxWidth:'100%',overflow:"hidden" }}>
            <FormulaConfiguration
              category={ruleConfigurationCategories[formulaInternalKey - 1]?.category}
              formulas={[...filteredFormulas?.filter((item) => !deletedFormulas?.includes(item.output)), ...customFormula]}
              onSelect={onSelect}
              customProps={customProps}
              setShowToast={setShowToast}
              allMdmsFormulasForThisCategory={ruleConfigurationCategories[formulaInternalKey - 1]?.ruleConfigurations?.map((row) => row.output)}
            />
          </div>
        </div>

        {formulaInternalKey > 0 && formulaInternalKey < ruleConfigurationCategories?.length && (
          <ActionBar>
            <Button className="previous-button" variation="secondary" label={t("BACK")} title={t("BACK")} onClick={handleBack} />
            <Button className="previous-button" variation="primary" label={t("NEXT")} title={t("NEXT")} onClick={handleNext} />
          </ActionBar>
        )}
      </FormulaContext.Provider>

      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"} // Adjust based on your needs
          label={t(showToast.label)}
          transitionTime={showToast.transitionTime}
          onClose={() => {
            setShowToast(false);
          }}
          style={{ zIndex: 9999 }}
          isDleteBtn={true}
        />
      )}
    </Fragment>
  );
};

export default FormulaConfigWrapper;
