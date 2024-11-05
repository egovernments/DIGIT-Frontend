import React, { useState, useEffect, Fragment, createContext, useContext } from 'react';
import Hypothesis from './Hypothesis';
import { Stepper, TextBlock, ActionBar, Button, Card, Toast, Loader } from '@egovernments/digit-ui-components';
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { concat } from 'lodash';


const AssumptionContext = createContext('assumptionContext');

export const useAssumptionContext = () => {
    return useContext(AssumptionContext);
};

const HypothesisWrapper = ({ onSelect, props: customProps }) => {

    const { mutate: updateResources, ...rest } = Digit.Hooks.microplanv1.useCreateUpdatePlanProject();
    const { t } = useTranslation();
    const { state,dispatch } = useMyContext();
    const [assumptionValues, setAssumptionValues] = useState(Digit.SessionStorage.get("MICROPLAN_DATA")?.HYPOTHESIS?.Assumptions?.assumptionValues || []);
    const assumptionsFormValues = customProps?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm //array with key and value 
    const campaignType = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code
    const resourceDistributionStrategyCode = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode
    const searchParams = new URLSearchParams(window.location.search);
    const [internalKey, setInternalKey] = useState(() => {
        const keyParam = searchParams.get("internalKey");
        return keyParam ? parseInt(keyParam) : 1;
    });
    const [manualLoader, setManualLoader] = useState(false)
    const [showToast, setShowToast] = useState(null);
    const [deletedAssumptions, setDeletedAssumptions] = useState([]);
    const [executionCount, setExecutionCount] = useState(0);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();

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
            //   queryKey: currentKey,
        }
    );


    const moveToPreviousStep = () => {
        if (internalKey > 1) {
            setInternalKey((prevKey) => prevKey - 1);
        }
    };
    const isLastStep = () => {
        //here we should just delete these params instead of updating
        Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: null });
        Digit.Utils.microplanv1.updateUrlParams({ internalKey: null });
    }

    const updateUrlParams = (params) => {
        const url = new URL(window.location.href);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        window.history.replaceState({}, "", url);
    };
    const handleAssumptionChange = (category, event, item) => {
        const newValue = event.target.value;

        setAssumptionValues((prevValues) => {
            return prevValues.map((assumption) => {
                // If the key matches, update the value; otherwise, return the existing assumption
                if (assumption.key === item) {
                    return {
                        ...assumption,
                        category,
                        value: newValue === "" ? null : newValue, // Set to null if input is empty
                    };
                }
                return assumption;
            });
        });
    };

    const handleNext = () => {
        const currentAssumptions = assumptionCategories[internalKey - 1]?.assumptions || [];
        const existingAssumptionKeys = assumptionValues?.map(assumption => assumption.key);

        //Filter current assumptions to only those that exist in assumptionValues and are not deleted
        const visibleAssumptions = currentAssumptions.filter(item =>
            existingAssumptionKeys?.includes(item) && !deletedAssumptions?.includes(item)
        );

        //Validate: Check if any value is empty for visible assumptions
        const hasEmptyFields = visibleAssumptions.some(item => {
            const value = assumptionValues.find(assumption => assumption.key === item)?.value;
            return !value; // Check if any value is empty
        });

        // If there are empty fields, show an error and do not allow moving to the next step
        if (hasEmptyFields) {
            setShowToast({
                key: "error",
                label: t("HYP_ERR_MANDATORY_FIELD"),
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
        const assumptionsToUpdate = assumptionValues?.filter?.(row => {
            return row.key && row.value && row.category
        })
        setManualLoader(true)
        updateResources({
            config: {
                name: "SUB_HYPOTHESIS"
            },
            assumptionsToUpdate
        }, {
            onSuccess: (data) => {
                setManualLoader(false)
                if (internalKey < assumptionCategories.length) {
                    setInternalKey((prevKey) => prevKey + 1); // Update key in URL
                }
                refetchPlan();
                // TODO: here see if session can be updated (refresh)
            },
            onError: (error, variables) => {
                setManualLoader(false)
                console.error(error)
                // setShowToast()

                setShowToast(({ key: "error", label: error?.message ? error.message : t("FAILED_TO_UPDATE_RESOURCE") }))
            },
        })


    };

    const filteredData = state.HypothesisAssumptions.filter((item) => {
        const isHouseToHouseOrFixedPost = resourceDistributionStrategyCode === "HOUSE_TO_HOUSE" ||
            resourceDistributionStrategyCode === "FIXED_POST";

        if (isHouseToHouseOrFixedPost) {
            return (
                campaignType === item.campaignType &&
                resourceDistributionStrategyCode === item.resourceDistributionStrategyCode &&
                assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item.isRegistrationAndDistributionHappeningTogetherOrSeparately

            )
        }

        return (
            campaignType === item.campaignType &&
            resourceDistributionStrategyCode === item.resourceDistributionStrategyCode &&
            assumptionsFormValues?.selectedRegistrationProcess?.code === item?.RegistrationProcess &&
            assumptionsFormValues?.selectedDistributionProcess?.code === item.DistributionProcess
        )
    });
    const assumptionCategories = filteredData.length > 0 ? filteredData[0].assumptionCategories : [];
    const filteredAssumptions = assumptionCategories.length > 0 ? (assumptionCategories[internalKey - 1]?.assumptions || []) : [];

    //this data is used in formulaConfigWrapper
    useEffect(() => {
      if(assumptionCategories.length > 0 && !state?.allAssumptions?.length>0) {
        const allAssumptions = assumptionCategories?.flatMap((item) => item.assumptions);
        dispatch({
            type: "MASTER_DATA",
            state: {
                allAssumptions:allAssumptions,
            },
          });
      }
    })
    


    const handleBack = () => {
        if (internalKey > 1) {
            setInternalKey((prevKey) => prevKey - 1); // Update key in URL
        } else {
            window.dispatchEvent(new Event("moveToPrevious"))
        }
    };

    const handleStepClick = (step) => {

        // Step is zero-based, so we adjust by adding 1
        const currentStepIndex = internalKey - 1; // Current step index (zero-based)

        // // Check if the clicked step is the next step
        if (step === currentStepIndex + 1) {
            // Validate current step
            const currentAssumptions = assumptionCategories[currentStepIndex]?.assumptions || [];
            const existingAssumptionKeys = assumptionValues.map(assumption => assumption.key);
            const visibleAssumptions = currentAssumptions.filter(item =>
                existingAssumptionKeys?.includes(item) && !deletedAssumptions?.includes(item)
            );

            // Check for empty fields in visible assumptions
            const hasEmptyFields = visibleAssumptions.some(item => {
                const value = assumptionValues.find(assumption => assumption.key === item)?.value;
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

    }




    useEffect(() => {
        window.addEventListener("verticalStepper", moveToPreviousStep);
        return () => {
            window.removeEventListener("verticalStepper", moveToPreviousStep);
        };
    }, [internalKey]);

    useEffect(() => {
        window.addEventListener("isLastStep", isLastStep);
        return () => {
            window.removeEventListener("isLastStep", isLastStep);
        };
    }, [internalKey]);



    useEffect(() => {
        onSelect(customProps.name, { assumptionValues: assumptionValues?.filter(val => val.category && val.key && val.source && val.value) });
    }, [assumptionValues, internalKey]);
    useEffect(() => {
        if (executionCount < 5) {
            onSelect(customProps.name, { assumptionValues: assumptionValues?.filter(val => val.category && val.key && val.source && val.value) })
            setExecutionCount((prevCount) => prevCount + 1);
        }
    });



    useEffect(() => {
        updateUrlParams({ internalKey, });
    }, [internalKey]);

    useEffect(() => {
        const initialAssumptions = filteredAssumptions.map(item => ({
            source: "MDMS",
            category: undefined,
            key: item,
            value: undefined
        }));

        // Create a set of existing keys for quick lookup
        const existingKeys = new Set(assumptionValues.map(assumption => assumption.key));

        // Filter out initialAssumptions to avoid duplicates and deleted assumptions
        const newAssumptions = initialAssumptions.filter(assumption =>
            !existingKeys.has(assumption.key) &&
            !deletedAssumptions.includes(assumption.key)
        );

        // Update state only with non-duplicate assumptions
        setAssumptionValues(prev => [...prev, ...newAssumptions]);
    }, [filteredAssumptions]);

    //useEffect to support draft functionality deleted ones should not be shown
    useEffect(() => {
        //if planObject.assumptions is there that means already some assumptions were filled
        // in that case don't render the deleted ones because for them session will not be there
        // basically preset the deleted ones
        const currentCategory = assumptionCategories?.[internalKey - 1]?.category
        if (planObject?.assumptions?.length > 0 && currentCategory) {
            // this is the list of items already filled for this microplan for this category
            const assumptionsFilledForThisCategory = planObject?.assumptions?.filter(row => row.category === currentCategory)?.map(row => row.key)
            // if this category is not yet filled
            if (assumptionsFilledForThisCategory.length === 0) {
                return
            }
            // filteredAssumptions -> this is the current list from master data
            // basically what all is there in filteredAssumptions, some of them could have been deleted so if something is there in assumptionsFilledForThisCategory but not in filteredAssumptions then put that in deleted ones
            const deletedAssumptionsForThisCategory = filteredAssumptions.filter(item => !assumptionsFilledForThisCategory.includes(item));
            if (deletedAssumptionsForThisCategory.length > 0) {
                setDeletedAssumptions(prev => [...prev, ...deletedAssumptionsForThisCategory])
            }

        }
    }, [planObject, isLoadingPlanObject, internalKey])


    useEffect(() => {
        if (internalKey === assumptionCategories.length) {
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: true });
        } else { // Assuming 1 is the first step
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: false });
        }
    }, [internalKey]);



    if (isLoadingPlanObject || manualLoader) {
        return <Loader />
    }

    return (
        <Fragment>
            <AssumptionContext.Provider value={{ assumptionValues, handleAssumptionChange, setAssumptionValues, deletedAssumptions, setDeletedAssumptions }}>

                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <div className="card-container" style={{ marginBottom: "2.5rem" }}>
                        <Card className="card-header-timeline">
                            <TextBlock subHeader={t("ESTIMATION_ASSUMPTIONS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
                        </Card>
                        <Card className="vertical-stepper-card">
                            <Stepper
                                customSteps={assumptionCategories.map(category => category.category)}
                                currentStep={internalKey}
                                onStepClick={() => null}
                                direction={"vertical"}
                            />
                        </Card>
                    </div>

                    <div style={{
                        width: '100%'
                    }}>
                        <Hypothesis
                            category={assumptionCategories[internalKey - 1]?.category}
                            assumptions={filteredAssumptions.filter(item => !deletedAssumptions?.includes(item))}
                            onSelect={onSelect}
                            customProps={customProps}
                            setShowToast={setShowToast}
                            allMdmsAssumptionsForThisCategory={filteredAssumptions}
                        />
                    </div>
                </div>

                {(internalKey > 0 && internalKey < assumptionCategories.length) && (
                    <ActionBar>
                        <Button className="previous-button" variation="secondary" label={t("BACK")} onClick={handleBack} />
                        <Button className="previous-button" variation="primary" label={t("NEXT")} onClick={handleNext} />
                    </ActionBar>
                )}



            </AssumptionContext.Provider>

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

export default HypothesisWrapper;






















