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
  const { t } = useTranslation();
  const { state } = useMyContext();
  const [formulaConfigValues, setFormulaConfigValues] = useState(
    Digit.SessionStorage.get("MICROPLAN_DATA")?.FORMULA_CONFIGURATION?.formulaConfiguration?.formulaConfigValues || []
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
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const assumptionsInPlan = Digit.SessionStorage.get("MICROPLAN_DATA")?.HYPOTHESIS.Assumptions.assumptionValues
  // const { isLoading: isLoadingPlanObject, data: planObject, error: errorPlan, refetch: refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
  //   {
  //     PlanConfigurationSearchCriteria: {
  //       tenantId,
  //       id: microplanId,
  //     },
  //   },
  //   {
  //     enabled: microplanId ? true : false,
  //     //   queryKey: currentKey,
  //   }
  // );

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
            source: "MDMS",
            category,
            [type]: value.code, // Set to null if input is empty
          };
        }
        return formula;
      });
    });
  };

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
    setFilteredFormulas(currentCategoryRuleConfigurations);
  }, [currentCategoryRuleConfigurations]);

  const handleNext = () => {
    //here just check formulConfigValues
    if(formulaConfigValues.filter(row => row.category === currentCategory).every(row=>{
      return row.assumptionValue && row.input && row.output && row.operatorName
    })){
      if (formulaInternalKey < ruleConfigurationCategories?.length) {
        setFormulaInternalKey((prevKey) => prevKey + 1); // Update key in URL
      }
    }else{
      setShowToast({
        key: "error",
        label: t("ERR_MANDATORY_FIELD"),
        transitionTime: 3000,
      });
    }
    // TODO:
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
    // calculate this based on prevOutputs also
    const legalValuesForAssumptions = assumptionsInPlan?.map(assumption => assumption.key)
    const prevOutputs = []
  
    const initialFormulas = filteredFormulas.map((item) => {
      const updatedObj =  {
      source: "MDMS",
      category: currentCategory,
      input: item.input,
      output: item.output,
      operatorName: item.operatorName,
      //check this assumption is there in plan object or not
      assumptionValue:legalValuesForAssumptions?.includes(item.assumptionValue) || prevOutputs?.includes(item.assumptionValue) ? item.assumptionValue : "",
      // assumptionValue:item.assumptionValue,
      showOnEstimationDashboard: true,
    }

    prevOutputs.push(item.output)
    return updatedObj;
  });
    const existingOutputs = new Set(formulaConfigValues.map((formula) => formula.output));
    const newFormulas = initialFormulas?.filter((formula) => !existingOutputs.has(formula.output) && !deletedFormulas.includes(formula.output));

    setFormulaConfigValues((prev) => [...prev, ...newFormulas]);
  }, [filteredFormulas]);

  //to get existing assumptions to provide options for assumptionValue dropdown

  useEffect(() => {
    // Step 1: Filter assumptions based on current category
    if (assumptionsInPlan?.length > 0 ) {
      const filteredAssumptions = assumptionsInPlan?.filter((assumption) => assumption.category === currentCategory);

      // Step 2: Extract keys from filtered assumptions
      const keys = filteredAssumptions?.map((assumption) => assumption.key);
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
  }, [formulaInternalKey]);

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


  return (
    <Fragment>
      <FormulaContext.Provider
        value={{ formulaConfigValues, handleFormulaChange, setFormulaConfigValues, deletedFormulas, setDeletedFormulas, assumptionsInPlan }}
      >
        <div style={{ display: "flex", gap: "2rem" }}>
          <div className="card-container">
            <Card className="card-header-timeline">
              <TextBlock subHeader={t("FORMULA_CONFIGURATION")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
            </Card>
            <Card className="stepper-card">
              <Stepper
                customSteps={ruleConfigurationCategories.map((category) => category.category)}
                currentStep={formulaInternalKey}
                onStepClick={() => null}
                direction={"vertical"}
              />
            </Card>
          </div>

          <div style={{ width: "100%" }}>
            <FormulaConfiguration
              category={ruleConfigurationCategories[formulaInternalKey - 1]?.category}
              formulas={filteredFormulas?.filter((item) => !deletedFormulas?.includes(item.output))}
              onSelect={onSelect}
              customProps={customProps}
            />
          </div>
        </div>

        {formulaInternalKey > 0 && formulaInternalKey < ruleConfigurationCategories?.length && (
          <ActionBar>
            <Button className="previous-button" variation="secondary" label={t("BACK")} onClick={handleBack} />
            <Button className="previous-button" variation="primary" label={t("NEXT")} onClick={handleNext} />
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
          isDleteBtn={true}
        />
      )}
    </Fragment>
  );
};

export default FormulaConfigWrapper;
