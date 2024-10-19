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
//customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues 
const HypothesisWrapper = ({ onSelect, props: customProps }) => {

    const { mutate: updateResources, ...rest } = Digit.Hooks.microplanv1.useCreateUpdatePlanProject();
    const { t } = useTranslation();
    const { state } = useMyContext();
    const [assumptionValues, setAssumptionValues] = useState(customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues || []);
    console.log("filteredAssumptionssession assumptions", JSON.stringify(assumptionValues[assumptionValues.length - 1]));

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
    const [executionCount, setExecutionCount] = useState(0);

    const tenantId = Digit.ULBService.getCurrentTenantId();

    const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
    const { isLoading: isLoadingPlanObject, data: planObject, error: errorPlan, refetch: refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
        {
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        },
        {
          enabled: microplanId ? true : false,
          cahcheTime:0,
         queryKey: internalKey,
        }
      );


  
      

     
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

    const handleAssumptionChange = (category, event, key) => {
        const newValue = event.target.value;
       console.log('setAssumptionValues called 1')
        setAssumptionValues(prevValues =>{
            console.log("hereeeeeeee", prevValues)
            return prevValues?.map(value =>
                value.key === key ? { ...value, value: newValue, category } : value
            )
        }
        );
        
        
      
    };

    useEffect(()=>{
     refetchPlan()
    },[ internalKey])

    const handleNext = () => {
        // debugger;
        let newAssumptions = assumptionValues.filter((assumption) => assumption.value != null)
        console.log('setAssumptionValues called 2')
        setAssumptionValues(newAssumptions)
        const apiAssumptions = Array.isArray(planObject?.assumptions) && planObject?.assumptions.length > 0 
    ? planObject?.assumptions
        ?.filter(item => item.category === currentCategory) // Filter by current category
        ?.map(item => item.key) 
    : [];
        const currentAssumptions = assumptionCategories[internalKey - 1]?.assumptions || [];
       const assumptionsToValidate = apiAssumptions.length > 0 ? apiAssumptions : currentAssumptions;
        const existingAssumptionKeys = assumptionValues?.map(assumption => assumption.key);

        //Filter current assumptions to only those that exist in assumptionValues and are not deleted
        const visibleAssumptions = assumptionsToValidate.filter(item => 
            existingAssumptionKeys?.includes(item) && !deletedAssumptions?.includes(item)
        );
        console.log("visible assumptions", visibleAssumptions)
    
        //Validate: Check if any value is empty for visible assumptions
        const hasEmptyFields = visibleAssumptions.some(item => {
            const value = assumptionValues.find(assumption => assumption.key === item)?.value;
            return !value; // Check if any value is empty
        });
    
        // If there are empty fields, show an error and do not allow moving to the next step
        if (hasEmptyFields) {
            setShowToast({
                key: "error",
                label: t("ERR_MANDATORY_FIELD"),
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

        if (internalKey < assumptionCategories.length) {
            setInternalKey((prevKey) => prevKey + 1); // Update key in URL
        }

        // updateResources({
        //     config:{
        //         name:"SUB_HYPOTHESIS"
        //     },
        //     assumptionsToUpdate
        // },{
        //     onSuccess: (data) => {
        //         if (internalKey < assumptionCategories.length) {
        //             setInternalKey((prevKey) => prevKey + 1); // Update key in URL
        //         }
        //         refetchPlan();
        //     },
        //     onError: (error, variables) => {
        //         console.error(error.message, "error rorrrrr")
        //         setShowToast({key:"error", 
        //             label: error?.message ? error.message :  t("FAILED_TO_UPDATE_RESOURCE")  })
                
        //     // setShowToast(({ key: "error", label: error?.message ? error.message : t("FAILED_TO_UPDATE_RESOURCE") }))
        //     },
        // })


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
        //some code was newly added here 
    const assumptionCategories = filteredData.length > 0 ? filteredData[0].assumptionCategories : [];
   
    const filteredAssumptions = assumptionCategories.length > 0 ? (assumptionCategories[internalKey - 1]?.assumptions || []) : [];
    const currentCategory = assumptionCategories[internalKey - 1]?.category;
    const apiAssumptions = Array.isArray(planObject?.assumptions) && planObject?.assumptions.length > 0 
    ? planObject?.assumptions
        .filter(item => item.category === currentCategory) // Filter by current category
        .map(item => item.key) 
    : [];
    const assumptionsToPass = (apiAssumptions.length > 0 && !isLoadingPlanObject) ? apiAssumptions :  filteredAssumptions;
    
    // console.log("isLoadingplanObject", isLoadingPlanObject)
    // console.log("api assumptions", apiAssumptions)
    
    // let assumptionsToPass;

    // else{
    //     assumptionsToPass = (apiAssumptions.length > 0 && !isLoadingPlanObject) ? apiAssumptions :  filteredAssumptions;
    // }
   
    const handleBack = () => {
        if (internalKey >1) {
            setInternalKey((prevKey) => prevKey - 1); // Update key in URL
        }else{
            window.dispatchEvent(new Event("moveToPrevious"))
        }
    };


  

  const handleStepClick = (step)=>{
       
    // Step is zero-based, so we adjust by adding 1
    const currentStepIndex = internalKey - 1; // Current step index (zero-based)
    
    // // Check if the clicked step is the next step
    if (step === currentStepIndex + 1) {
        // Validate current step

            const apiAssumptions = Array.isArray(planObject?.assumptions) && planObject?.assumptions.length > 0 
        ? planObject?.assumptions
            ?.filter(item => item.category === currentCategory) // Filter by current category
            ?.map(item => item.key) 
        : [];
        const currentAssumptions = assumptionCategories[currentStepIndex]?.assumptions || [];
        const assumptionsToValidate = apiAssumptions.length > 0 ? apiAssumptions : currentAssumptions;
        const existingAssumptionKeys = assumptionValues?.map(assumption => assumption.key);
        const visibleAssumptions = assumptionsToValidate?.filter(item => 
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
        onSelect(customProps.name, { assumptionValues });
    }, [assumptionValues, internalKey]);
    useEffect(() => {
        if (executionCount < 5) {
            onSelect(customProps.name, {assumptionValues})
            setExecutionCount((prevCount) => prevCount + 1);
        }
      }); 



    useEffect(() => {

        updateUrlParams({ internalKey,});
    }, [internalKey]);

  console.log("assumption valueii", assumptionValues)



useEffect(() => {
    const initialAssumptions = filteredAssumptions?.map(item => ({
        source: "MDMS",
        category: currentCategory,
        key: item,
        value: null,
    }));
    debugger;
    const existingKeys = new Set(assumptionValues?.map(assumption => assumption.key));
    const newAssumptions = initialAssumptions?.filter(assumption => 
        !existingKeys.has(assumption.key) &&
        !deletedAssumptions.includes(assumption.key) 
      
    );
    
    //console.log("New assumptions to add:", newAssumptions);
    setAssumptionValues(prev => [...prev, ...newAssumptions]);
    //console.log("assumption values intially", assumptionValues)
}, [filteredAssumptions]);





useEffect(() => {
    if (planObject?.assumptions.length>0) {
        debugger;
        
        console.log("filtered assums before filtering ", assumptionValues)
        console.log("non deleted", planObject.assumptions)
        // Create an array of valid assumptions based on key and category
        const filteredAssumptions = assumptionValues.filter(item =>
            planObject.assumptions.some(planItem =>
                planItem.key === item.key && planItem.category === item.category
            )
        );

        // Update assumptionValues to only include filtered assumptionsbbhbghutinjyu
        
       console.log("filtered assums after filtering in planobject", filteredAssumptions)
        //setAssumptionValues(filteredAssumptions);
        console.log('setAssumptionValues called 4')
        setAssumptionValues(prevValues => [
            ...filteredAssumptions,
            // ...prevValues.filter(item => !filteredAssumptions.some(f => f.key === item.key))
          ]);
        
          
     
    

    }
}, [planObject?.assumptions]);

const { isLastVerticalStep } = Digit.Hooks.useQueryParams();
// useEffect(()=>{
//        if(isLastVerticalStep){
//            let ass = assumptionValues.filter((assumption)=> assumption.value!==null)
//            setAssumptionValues(ass)
//        }
// }, [isLastVerticalStep])





    useEffect(() => {
        if (internalKey === assumptionCategories.length) {
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: true });
        }else{ // Assuming 1 is the first step
            Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: false });
        }
    }, [internalKey]);
    
   
    // useEffect(()=>{

    //     console.log("internalKey---",internalKey);
    //     console.log(filteredData[0].assumptionCategories)
    //     if( filteredData.length > 0 && internalKey >=(filteredData.length > 0 ? filteredData[0].assumptionCategories : []).length){
    //         console.log(assumptionValues);
    // //  let newAssumptions = assumptionValues.filter((asssumption)=> asssumption.value!==null)

    // //  setAssumptionValues(newAssumptions);
    //     }   


    // },[internalKey  ])

    //console.log("assumptionsToPass", assumptionsToPass)
    
    if(isLoadingPlanObject){
        return <Loader/>
    }   

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
                                    customSteps={assumptionCategories?.map(category => category.category)}
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
                                planObject={planObject}
                                //assumptions={filteredAssumptions.filter(item => !deletedAssumptions?.includes(item))}
                                assumptions={assumptionsToPass?.filter(item => !deletedAssumptions?.includes(item))} // Pass correctly
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






















