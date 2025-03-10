import React, { useState, useEffect, Fragment, createContext, useContext } from "react";
import Hypothesis from "./Hypothesis";
import { Stepper, TextBlock, ActionBar, Button, Card, Toast, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { concat } from "lodash";

const AssumptionContext = createContext("assumptionContext");

export const useAssumptionContext = () => {
  return useContext(AssumptionContext);
};

const HypothesisWrapper = ({ onSelect, props: customProps }) => {
  const { mutate: updateResources, ...rest } = Digit.Hooks.microplanv1.useCreateUpdatePlanProject();
  const { t } = useTranslation();
  const { state, dispatch } = useMyContext();
  const [hypothesisParams, setHypothesisParams, clearHypothesisParams] = Digit.Hooks.useSessionStorage("HYPOTHESIS_DATA", {});
  const [assumptionValues, setAssumptionValues] = useState(
    // Digit.SessionStorage.get("MICROPLAN_DATA")?.HYPOTHESIS?.Assumptions?.assumptionValues || []
    Digit.SessionStorage.get("HYPOTHESIS_DATA")?.assumptionValues || []
  );
  const assumptionsFormValues = customProps?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm; //array with key and value
  const campaignType = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code;
  const resourceDistributionStrategyCode =
    customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode;
  const searchParams = new URLSearchParams(window.location.search);
  const [internalKey, setInternalKey] = useState(() => {
    const keyParam = searchParams.get("internalKey");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [manualLoader, setManualLoader] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [deletedAssumptions, setDeletedAssumptions] = useState([]);
  const [defautAssumptions, setDefaultAssumptions] = useState(["NEW_ASSUMPTION"]);
  const [executionCount, setExecutionCount] = useState(0);
  const [customAssumption, setCustomAssumption] = useState([]);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const filteredData = state.HypothesisAssumptions.filter((item) => {
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
  const assumptionCategories = filteredData.length > 0 ? filteredData?.[0].assumptionCategories : [];
  const filteredAssumptions = assumptionCategories.length > 0 ? assumptionCategories[internalKey - 1]?.assumptions || [] : [];

  //fetching existing plan object
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
      staleTime:0,
      refetchOnMount: true,
      queryKey:state?.allAssumptions ? state?.allAssumptions.length : "hypothesis_plan" 
    }
  );

  useEffect(() => {
    const curr = Digit.SessionStorage.get("MICROPLAN_DATA")?.HYPOTHESIS?.Assumptions?.assumptionValues;
    if (curr?.length > 0) {
      setHypothesisParams(curr);
      setAssumptionValues(curr);
    }
  }, []);

  useEffect(() => {
    if (planObject?.assumptions?.length > 0) {
      const currentSession = Digit.SessionStorage.get("FORMULA_DATA");
      const assumptionValues = [];
      for (const assumption of planObject?.assumptions) {
        assumptionValues.push({
          source: assumption?.source,
          key: assumption?.key,
          value: assumption?.value,
          category: assumption?.category,
        });
      }
      setHypothesisParams({
        ...currentSession,
        assumptionValues: assumptionValues,
      });
    }
  }, [planObject]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default Enter key behavior globally
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: null });
      Digit.Utils.microplanv1.updateUrlParams({ internalKey: null });
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const tc = assumptionCategories[internalKey - 1]?.category;
    const temp = assumptionValues?.filter((i) => i.category === tc && i.source === "CUSTOM")?.map((i) => i.key) || [];
    setCustomAssumption(temp);
  }, [assumptionValues, internalKey]);
  const moveToPreviousStep = () => {
    if (internalKey > 1) {
      setInternalKey((prevKey) => prevKey - 1);
    }
  };
  const isLastStep = () => {
    //here we should just delete these params instead of updating
    Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: null });
    Digit.Utils.microplanv1.updateUrlParams({ internalKey: null });
  };

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  };
  const handleAssumptionChange = (category, event, item) => {
    const newValue = event.target.value;
  
    // Validation function for range and decimal places
    const isValidValue = (value) => {
      const numericValue = parseFloat(value);
      return (
        numericValue >= 0 &&
        numericValue <= 1000 &&
        /^([0-9]*\.?[0-9]{1,2})$/.test(value) // Check for at most 2 decimals
      );
    };
  
    setAssumptionValues((prevValues) => {
      return prevValues.map((assumption) => {
        // If the key matches, validate and update the value
        if (assumption.key === item) {
          return {
            ...assumption,
            category,
            value: newValue === "" || isValidValue(newValue) ? newValue : assumption.value, // Set to newValue if valid, else keep existing
          };
        }
        return assumption;
      });
    });
  };
  

  const handleNext = () => {
    
    const currentCategory = assumptionCategories?.[internalKey - 1]?.category;
    const currentAssumptions = assumptionCategories[internalKey - 1]?.assumptions || [];
    const existingAssumptionKeys = assumptionValues?.map((assumption) => assumption.key);

    //Filter current assumptions to only those that exist in assumptionValues and are not deleted
    const visibleAssumptions = currentAssumptions.filter((item) => existingAssumptionKeys?.includes(item) && !deletedAssumptions?.includes(item));

    //Validate: Check if any value is empty for visible assumptions
    const atleastOneMDMS = assumptionValues?.filter((j) => j.category === currentCategory)?.filter((i) => i?.source === "MDMS")?.length === 0;
   

    const hasEmptyFields = visibleAssumptions.some((item) => {
      const value = assumptionValues.find((assumption) => assumption.key === item)?.value;
      return !value; // Check if any value is empty
    });

    const hasCustomEmptyFields = assumptionValues?.filter(assumption => assumption.source==="CUSTOM" && assumption.category===currentCategory)?.some(assumption => {
      return !assumption.value
    })

    const hasNaNFields = visibleAssumptions.some((item) => {
      const value = assumptionValues.find((assumption) => assumption.key === item)?.value;
      return !value || isNaN(value) || value <= 0; // Check if any value is NAN
    });
    const hasExceededUpperBound = assumptionValues.some((item) => {
      // const value = assumptionValues.find((assumption) => assumption.key === item)?.value;
      const value = item?.value;
      if(value>1000){
        return true
      }
    });

    const hasMoreDecimalPlaces = assumptionValues.some((item) => {
      const value = item?.value
    
      // Check if the value has more than 2 decimal places
      if (value && value % 1 !== 0 && value.toString().split(".")[1]?.length > 2) {
        return true;
      }
      return false
    });

    if (hasEmptyFields) {
      setShowToast({
        key: "error",
        label: t("ERR_MANDATORY_FIELD"),
        transitionTime: 3000,
      });
      return; // Prevent moving to the next step
    }
    if(hasCustomEmptyFields){
      setShowToast({
        key: "error",
        label: t("ERR_MANDATORY_FIELD"),
        transitionTime: 3000,
      });
      return; // Prevent moving to the next step
    }

    if (atleastOneMDMS) {
      setShowToast({
        key: "error",
        label: t("ATLEAST_ONE_MDMS_ASSUMPTION"),
        transitionTime: 3000,
      });
      return; // Prevent moving to the next step
    }

    // If there are empty fields, show an error and do not allow moving to the next step
    if (hasNaNFields) {
      setShowToast({
        key: "error",
        label: t("ERR_INCORRECT_FIELD"),
        transitionTime: 3000,
      });
      return; // Prevent moving to the next step
    }
   
    if(hasExceededUpperBound && (!hasNaNFields || !hasEmptyFields)){
      setShowToast({
        key: "error",
        label: t("ERR_SHOULD_NOT_EXCEED_999.99"),
        transitionTime: 3000,
      });
      return; // Prevent moving to the next step
    }

    if(hasMoreDecimalPlaces){
      setShowToast({
        key: "error",
        label: t("ERR_DECIMAL_PLACES_LESS_THAN_TWO"),
        transitionTime: 3000,
      });
      return; // Prevent moving to the next step
    }

    // Move to the next step if validation passes
    // if (internalKey < assumptionCategories.length) {
    //     setInternalKey((prevKey) => prevKey + 1); // Update key in URL
    // }

    //after everything is done make an api call and assume it will be successfull(let user go to next screen)
    // API CALL
    const assumptionsToUpdate = assumptionValues?.filter?.((row) => {
      return row.key && row.value && row.category;
    });
    setManualLoader(true);
    updateResources(
      {
        config: {
          name: "SUB_HYPOTHESIS",
        },
        assumptionsToUpdate,
      },
      {
        onSuccess: (data) => {
          setManualLoader(false);
          if (internalKey < assumptionCategories.length) {
            setShowToast(null);
            setInternalKey((prevKey) => prevKey + 1); // Update key in URL
          }
          if (internalKey === assumptionCategories.length) {
            const params = { key: key }; // Replace with your parameters
            const event = new Event("AssumptionsLastPage");
            window.dispatchEvent(event);
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
  };

  //this data is used in formulaConfigWrapper
  useEffect(() => {
    if (assumptionCategories.length > 0 && !state?.allAssumptions?.length > 0) {
      const allAssumptions = assumptionCategories?.flatMap((item) => item.assumptions);
      dispatch({
        type: "MASTER_DATA",
        state: {
          allAssumptions: allAssumptions,
        },
      });
    }
  });

  const handleBack = () => {
    //here check for current assumption values if something is invalid throw a toast
    const currentCategory = assumptionCategories?.[internalKey - 1]?.category;
    // console.log(assumptionValues);
    const currentAssumptions = assumptionValues?.filter(assumption => assumption?.category === currentCategory);

    //if we go back with some invalid value show a toast to correct it
    function hasInvalidValues(currentAssumptions) {
      return currentAssumptions
        .filter((item) => item?.value !== "") // Filter out empty string values
        .some((item) => {
          const value = Number(item?.value); // Parse the value into a number
    
          // Check if the value is invalid
          if (isNaN(value) || value < 0 || value > 1000) {
            return true; // Invalid if not a number or out of range
          }
    
          // Check if the value has more than 2 decimal places
          const decimalPlaces = value.toString().split(".")[1]?.length || 0;
          return decimalPlaces > 2;
        });
    }

    if(hasInvalidValues(currentAssumptions)){
      setShowToast({
        key: "error",
        label: t("ERR_PLS_ENTER_VALID_ASSUMPTION_VALUE"),
        transitionTime: 3000,
      });
      return;
    }


    
    

    
    if (internalKey > 1) {
      setInternalKey((prevKey) => prevKey - 1); // Update key in URL
    } else {
      window.dispatchEvent(new Event("moveToPrevious"));
    }
  };

  const handleStepClick = (step) => {
    // Step is zero-based, so we adjust by adding 1
    const currentStepIndex = internalKey - 1; // Current step index (zero-based)

    // // Check if the clicked step is the next step
    if (step === currentStepIndex + 1) {
      // Validate current step
      const currentAssumptions = assumptionCategories[currentStepIndex]?.assumptions || [];
      const existingAssumptionKeys = assumptionValues.map((assumption) => assumption.key);
      const visibleAssumptions = currentAssumptions.filter((item) => existingAssumptionKeys?.includes(item) && !deletedAssumptions?.includes(item));

      // Check for empty fields in visible assumptions
      const hasEmptyFields = visibleAssumptions.some((item) => {
        const value = assumptionValues.find((assumption) => assumption.key === item)?.value;
        return !value; // Check if any value is empty
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
      setInternalKey(step + 1); // Move to the next step
    }
    // Allow going back to any previous step
    else if (step < currentStepIndex) {
      setInternalKey(step + 1); // Move back to the selected step
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
    window.addEventListener("verticalStepper", moveToPreviousStep);
    window.addEventListener("isLastStep", isLastStep);
    return () => {
      window.removeEventListener("verticalStepper", moveToPreviousStep);
      window.removeEventListener("isLastStep", isLastStep);
    };
  }, [internalKey]);

  useEffect(() => {
    onSelect(customProps.name, { assumptionValues: assumptionValues?.filter((val) => val.category && val.key && val.source && val.value) });
  }, [assumptionValues, internalKey]);
  useEffect(() => {
    if (executionCount < 5) {
      onSelect(customProps.name, { assumptionValues: assumptionValues?.filter((val) => val.category && val.key && val.source && val.value) });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  useEffect(() => {
    updateUrlParams({ internalKey });
  }, [internalKey]);

  useEffect(() => {
    const result = assumptionValues?.filter((item) => filteredAssumptions?.includes(item?.key));

    const initialAssumptions =
      result.length > 0
        ? result.map((item) => ({
            source: item.source,
            category: item.category,
            key: item.key,
            value: item.value,
          }))
        : filteredAssumptions.map((item) => ({
            source: "MDMS",
            category: undefined,
            key: item,
            value: undefined,
          }));

    // Create a set of existing keys for quick lookup
    const existingKeys = new Set(assumptionValues.map((assumption) => assumption.key));

    // Filter out initialAssumptions to avoid duplicates and deleted assumptions
    const newAssumptions = initialAssumptions.filter(
      (assumption) => !existingKeys.has(assumption.key) && !deletedAssumptions.includes(assumption.key)
    );

    // Update state only with non-duplicate assumptions
    setAssumptionValues((prev) => [...prev, ...newAssumptions]);
  }, [filteredAssumptions]);

  //useEffect to support draft functionality deleted ones should not be shown
  useEffect(() => {
    //if planObject.assumptions is there that means already some assumptions were filled
    // in that case don't render the deleted ones because for them session will not be there
    // basically preset the deleted ones
    const currentCategory = assumptionCategories?.[internalKey - 1]?.category;
    if (planObject?.assumptions?.length > 0 && currentCategory) {
      // this is the list of items already filled for this microplan for this category
      const assumptionsFilledForThisCategory = planObject?.assumptions?.filter((row) => row.category === currentCategory)?.map((row) => row.key);
      // if this category is not yet filled
      if (assumptionsFilledForThisCategory.length === 0) {
        return;
      }
      // filteredAssumptions -> this is the current list from master data
      // basically what all is there in filteredAssumptions, some of them could have been deleted so if something is there in assumptionsFilledForThisCategory but not in filteredAssumptions then put that in deleted ones
      const deletedAssumptionsForThisCategory = filteredAssumptions.filter((item) => !assumptionsFilledForThisCategory.includes(item));
      if (deletedAssumptionsForThisCategory.length > 0) {
        setDeletedAssumptions((prev) => [...prev, ...deletedAssumptionsForThisCategory]);
      }
    }
  }, [planObject, filteredAssumptions, isLoadingPlanObject, internalKey]);

  useEffect(() => {
    if (internalKey === assumptionCategories.length) {
      Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: true });
    } else {
      // Assuming 1 is the first step
      Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: false });
    }
  }, [internalKey, assumptionCategories]);

  if (isLoadingPlanObject || manualLoader) {
    return <Loader />;
  }

  return (
    <Fragment>
      <AssumptionContext.Provider
        value={{
          assumptionValues,
          handleAssumptionChange,
          setAssumptionValues,
          deletedAssumptions,
          setDeletedAssumptions,
          defautAssumptions,
          setDefaultAssumptions,
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div className="card-container" style={{ marginBottom: "2.5rem" }}>
            <Card className="card-header-timeline">
              <TextBlock subHeader={t("ESTIMATION_ASSUMPTIONS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
            </Card>
            <Card className="vertical-stepper-card">
              <Stepper
                customSteps={assumptionCategories.map((category) => category.category)}
                currentStep={internalKey}
                onStepClick={() => null}
                direction={"vertical"}
              />
            </Card>
          </div>

          <div
            style={{
              width: "100%",
            }}
          >
            <Hypothesis
              category={assumptionCategories[internalKey - 1]?.category}
              assumptions={
                filteredAssumptions?.filter((i) => assumptionValues?.some((j) => j.key === i))?.length > 0
                  ? [...filteredAssumptions?.filter((i) => assumptionValues?.some((j) => j.key === i)), ...customAssumption]
                  : [...filteredAssumptions.filter((item) => !deletedAssumptions?.includes(item)), ...customAssumption]
              }
              onSelect={onSelect}
              customProps={customProps}
              setShowToast={setShowToast}
              campaignType={campaignType}
              allMdmsAssumptionsForThisCategory={filteredAssumptions}
            />
          </div>
        </div>

        {internalKey > 0 && internalKey < assumptionCategories.length && (
          <ActionBar>
            <Button className="previous-button" variation="secondary" label={t("BACK")} title={t("BACK")} onClick={handleBack} />
            <Button className="previous-button" variation="primary" label={t("NEXT")} title={t("NEXT")} onClick={handleNext} />
          </ActionBar>
        )}
      </AssumptionContext.Provider>

      {showToast && (
        <Toast
          type={showToast.key} // Adjust based on your needs
          label={t(showToast.label)}
          transitionTime={showToast.transitionTime}
          onClose={() => {
            setShowToast(false);
          }}
          isDleteBtn={true}
          style={showToast.style ? showToast.style : {}}
        />
      )}
    </Fragment>
  );
};

export default HypothesisWrapper;
