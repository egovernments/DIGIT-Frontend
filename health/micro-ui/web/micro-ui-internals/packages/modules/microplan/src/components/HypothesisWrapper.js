import React, { useState, useEffect, Fragment, createContext, useContext } from 'react';
import Hypothesis from './Hypothesis';
import { Stepper, TextBlock, ActionBar, Button, Card, Toast } from '@egovernments/digit-ui-components';
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { concat } from 'lodash';


const AssumptionContext = createContext('assumptionContext');

export const useAssumptionContext = () => {
    return useContext(AssumptionContext);
};

const HypothesisWrapper = ({ onSelect, props: customProps }) => {
    const { t } = useTranslation();
    const { state } = useMyContext();
    const [assumptionValues, setAssumptionValues] = useState(customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues ||[]);
    const assumptionsFormValues = customProps?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm //array with key and value 
    const campaignType =  customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code
    const resourceDistributionStrategyCode= customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode
    const searchParams = new URLSearchParams(window.location.search);
    const [internalKey, setInternalKey] = useState(() => {
        const keyParam = searchParams.get("internalKey");
        return keyParam ? parseInt(keyParam) : 1;
    });
    const [showToast, setShowToast] = useState(null);
    const [deletedAssumptions, setDeletedAssumptions] = useState([]);

    const moveToPreviousStep = () => {
        if(internalKey >1){
            setInternalKey((prevKey) => prevKey - 1); 
        }  
      };
     const isLastStep = () => {
        Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep:false }); 
        Digit.Utils.microplanv1.updateUrlParams({ internalKey:internalKey }); 
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
        
        // Filter current assumptions to only those that exist in assumptionValues and are not deleted
        const visibleAssumptions = currentAssumptions.filter(item => 
            existingAssumptionKeys.includes(item) && !deletedAssumptions?.includes(item)
        );
        
        // Validate: Check if any value is empty for existing assumptions
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
            return; // Prevent moving to the next step
        }
        if (internalKey < assumptionCategories.length) {
            setInternalKey((prevKey) => prevKey + 1); // Update key in URL
        }
    };

    const filteredData = state.HypothesisAssumptions.filter((item) => {
        const isHouseToHouseOrFixedPost =  resourceDistributionStrategyCode === "HOUSE_TO_HOUSE" || 
                                            resourceDistributionStrategyCode === "FIXED_POST";
       
         if(isHouseToHouseOrFixedPost){
             return (
                campaignType === item.campaignType &&
                resourceDistributionStrategyCode === item.resourceDistributionStrategyCode &&
                assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item.isRegistrationAndDistributionHappeningTogetherOrSeparately

             ) 
         }

        return (
                 campaignType === item.campaignType &&
                 resourceDistributionStrategyCode === item.resourceDistributionStrategyCode &&
                 assumptionsFormValues?.selectedRegistrationProcess?.code===item?.RegistrationProcess && 
                 assumptionsFormValues?.selectedDistributionProcess?.code=== item.DistributionProcess 
             )
         });     
    const assumptionCategories = filteredData.length > 0 ? filteredData[0].assumptionCategories : [];
    const filteredAssumptions = assumptionCategories.length > 0 ? (assumptionCategories[internalKey - 1]?.assumptions || []) : [];
  

    

    const handleBack = () => {
        if (internalKey >1) {;
            setInternalKey((prevKey) => prevKey - 1); // Update key in URL
        }else{
            window.dispatchEvent(new Event("moveToPrevious"))
        }
    };
    const handleStepClick = (step) => {
        if (step < internalKey) {
            setInternalKey(step + 1);  //Adjust for zero-based index and Update key in URL
            return;
        }
        const currentAssumptions = assumptionCategories[internalKey - 1]?.assumptions || [];
        const existingAssumptionKeys = assumptionValues.map(assumption => assumption.key);
        const visibleAssumptions = currentAssumptions.filter(item => 
            existingAssumptionKeys.includes(item) && !deletedAssumptions?.includes(item) 
        );
        const hasEmptyFields = visibleAssumptions.some(item => {
            const value = assumptionValues.find(assumption => assumption.key === item)?.value;
            return !value; // Check if any value is empty
        });
        if(hasEmptyFields) return; 
        setInternalKey(step + 1); // step is zero-based, so we add 1 and Update key in URL
    };  



   

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
        onSelect(customProps.name, { assumptionValues });
    }, [assumptionValues, internalKey]);


    useEffect(() => {
        updateUrlParams({ internalKey,});
    }, [internalKey]);


    useEffect(() => {
        // Initialize assumptionValues with all assumptions set to null
        const initialAssumptions = filteredAssumptions.map(item => ({
            category: null,
            key: item,
            value: null
        }));
    
        // Create a set of existing keys for quick lookup
        const existingKeys = new Set(assumptionValues.map(assumption => assumption.key));
    
        // Filter out initialAssumptions to avoid duplicates
        const newAssumptions = initialAssumptions.filter(assumption => !existingKeys.has(assumption.key));
    
        // Update state only with non-duplicate assumptions
        setAssumptionValues(prev => [...prev, ...newAssumptions]);
    }, [filteredAssumptions]);

   



    useEffect(() => {
        if (internalKey === assumptionCategories.length) {
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: true });
        }else{ // Assuming 1 is the first step
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: false });
        }
    }, [internalKey]);
    
    

    return (
        <Fragment>
                <AssumptionContext.Provider value={{ assumptionValues, handleAssumptionChange, setAssumptionValues, deletedAssumptions,setDeletedAssumptions }}>
                  
                    <div style={{ display: "flex",gap:"2rem" }}>
                        <div className="card-container">
                            <Card className="card-header-timeline">
                                <TextBlock subHeader={t("ESTIMATION_ASSUMPTIONS")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
                            </Card>
                            <Card className="stepper-card">
                                <Stepper
                                    customSteps={assumptionCategories.map(category => category.category)}
                                    currentStep={internalKey}
                                    onStepClick={handleStepClick}
                                    direction={"vertical"}
                                />
                            </Card>
                        </div>

                        <div style={{width: '100%'                    
                        }}>
                            <Hypothesis
                                category={assumptionCategories[internalKey - 1]?.category}
                                 assumptions={filteredAssumptions.filter(item => !deletedAssumptions.includes(item))}
                                onSelect={onSelect}
                                customProps={customProps}
                            />
                        </div>
                    </div>

                    { (internalKey > 0 && internalKey < assumptionCategories.length ) && (
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






















