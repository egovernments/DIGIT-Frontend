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
    const [currentStep, setCurrentStep] = useState(1);
    const { state } = useMyContext();
    const [assumptionValues, setAssumptionValues] = useState(customProps?.sessionData?.HYPOTHESIS?.hypothesis?.Assumptions ||[]);
    const assumptionsFormValues = customProps?.sessionData?.CAMPAIGN_FORM?.campaignForm //array with key and value 
    const campaignType =  customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code
    const resourceDistributionStrategyCode= customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode
    const searchParams = new URLSearchParams(window.location.search);
    const [internalKey, setInternalKey] = useState(() => {
        const keyParam = searchParams.get("internalKey");
        return keyParam ? parseInt(keyParam) : 1;
    });
    const [showToast, setShowToast] = useState(null);




    const filteredData = state.HypothesisAssumptions.filter((item) => {
        // const assumptionsMap = new Map(assumptionsFormValues.map(a => [a.key, a.value]));
        const isHouseToHouseOrFixedPost =  resourceDistributionStrategyCode === "HOUSE_TO_HOUSE" || 
                                            resourceDistributionStrategyCode === "FIXED_POST";
                                                

        
        
        //  console.log("1", campaignType === item.campaignType )
        //  console.log("2",   resourceDistributionStrategyCode === item.resourceDistributionStrategyCode)
        //  console.log("3",  assumptionsFormValues?.selectedRegistrationProcess?.code===item?.RegistrationProcess)
        //  console.log("4",   assumptionsFormValues?.selectedDistributionProcess?.code=== item.DistributionProcess)
        //  console.log("5",  assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item.isRegistrationAndDistributionHappeningTogetherOrSeparately)
       
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
                 assumptionsFormValues?.selectedDistributionProcess?.code=== item.DistributionProcess &&
                 assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item.isRegistrationAndDistributionHappeningTogetherOrSeparately
             )
         });     
    const assumptionCategories = filteredData.length > 0 ? filteredData[0].assumptionCategories : [];
    const filteredAssumptions = assumptionCategories[currentStep - 1]?.assumptions || [];
    console.log(state, "state")

    useEffect(() => {
        console.log('calling onsEelect')
        console.log(customProps.name)
        onSelect(customProps.name, { assumptionValues });
    }, [assumptionValues]);




    const updateUrlParams = (params) => {
        const url = new URL(window.location.href);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        window.history.replaceState({}, "", url);
    };

    useEffect(() => {
        updateUrlParams({ internalKey,});
    }, [internalKey]);
  


    console.log("assumptionValues",assumptionValues )
    console.log(customProps,"configoo")

         

        

            console.log(filteredData, "filter") 
  //this need to be changed bcoz of index filtereddata{0}
    
    console.log(assumptionCategories,"kolop")

    const handleNext = () => {
        const currentAssumptions = assumptionCategories[currentStep - 1]?.assumptions || [];
        const existingAssumptionKeys = assumptionValues.map(assumption => assumption.key);
    

        // Filter current assumptions to only those that exist in assumptionValues
        const visibleAssumptions = currentAssumptions.filter(item => 
            existingAssumptionKeys.includes(item)
        );
        
    
        // Validate: Check if any value is empty for existing assumptions
        const hasEmptyFields = visibleAssumptions.some(item => {
            const value = assumptionValues.find(assumption => assumption.key === item)?.value;
            return !value; // Check if any value is empty
        });
    

    
        if (hasEmptyFields) {
            setShowToast({
                key: "error",
                label: "ERR_MANDATORY_FIELD",
                transitionTime: 3000,
            });
            return; // Prevent moving to the next step
        }
        if (currentStep < assumptionCategories.length) {
            setCurrentStep((prevStep) => prevStep + 1);
            setInternalKey((prevKey) => prevKey + 1); // Update key in URL
        }
        // // Hide action bar on the last step
        // if (currentStep === assumptionCategories.length - 1) {
        //     setInternalKey(assumptionCategories.length);
        //     setCurrentStep(assumptionCategories.length);
        // }
    };
    

    const handleBack = () => {
        if (currentStep >=0) {
            setCurrentStep((prevStep) => prevStep - 1);
            setInternalKey((prevKey) => prevKey - 1); // Update key in URL
        }
    };
    const handleStepClick = (step) => {
        console.log(step,"step")
        setCurrentStep(step + 1); // step is zero-based, so we add 1
        setInternalKey(step + 1); // Update key in URL
    };


    useEffect(() => {
        // Initialize assumptionValues with all assumptions set to null
        const initialAssumptions = filteredAssumptions.map(item => ({
            category:null, 
            key: item, 
            value: null // Initialize with null
        }));
    
        setAssumptionValues(initialAssumptions);
    }, [currentStep]);

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


    console.log("assumption values are", assumptionValues)
    

   

    console.log('filteredAssumptions', filteredAssumptions)
    console.log('assumptionsCatwegroies', assumptionCategories)
    // const handleAssumptionChange = (category, event, item) => {
    //     const newValue = event.target.value;

    //     setAssumptionValues((prevValues) => {
    //         const existingIndex = prevValues.findIndex((assumption) => assumption.key === item);

    //         if (existingIndex >= 0) {
    //             const updatedValues = [...prevValues];
    //             updatedValues[existingIndex] = {
    //                 ...updatedValues[existingIndex],
    //                 value: newValue,
    //             };
    //             return updatedValues;
    //         } else {
    //             return [...prevValues, { category, key: item, value: newValue }];
    //         }
    //     });
    // };

    return (
        <Fragment>
                <AssumptionContext.Provider value={{ assumptionValues, handleAssumptionChange, setAssumptionValues }}>
                  
                    <div style={{ display: "flex",gap:"2rem" }}>
                        <div className="card-container">
                            <Card className="card-header-timeline">
                                <TextBlock subHeader={t("HCM_CAMPAIGN_DETAILS")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
                            </Card>
                            <Card className="stepper-card">
                                <Stepper
                                    customSteps={assumptionCategories.map(category => category.category)}
                                    currentStep={currentStep}
                                    onStepClick={handleStepClick}
                                    direction={"vertical"}
                                />
                            </Card>
                        </div>

                        <div style={{width: '100%'                    
                        }}>
                            <Hypothesis
                                category={assumptionCategories[currentStep - 1]?.category}
                                assumptions={filteredAssumptions}
                                onSelect={(key, value) => {
                                    onSelect(key, value);
                                }}
                                customProps={customProps}
                            />
                        </div>
                    </div>

                    { (currentStep > 0 && currentStep < assumptionCategories.length ) && (
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



























// import React, { useState, useEffect, Fragment } from 'react';
// import Hypothesis from './Hypothesis';
// import { Stepper, TextBlock, ActionBar,SubmitBar, LinkButton } from '@egovernments/digit-ui-components';
// import { Button, Card } from '@egovernments/digit-ui-react-components';
// import { useTranslation } from "react-i18next";


// import { useMyContext } from "../utils/context";




// const HypothesisWrapper = ({ onSelect, props: customProps }) => {

//     const [selectedCategory, setSelectedCategory] = useState('GENERAL_INFORMATION');
//     const { state, dispatch } = useMyContext();
//     const assumptionCategories = state.HypothesisAssumptions[0].assumptionCategories
//     const { t } = useTranslation();

//     const searchParams = new URLSearchParams(location.search);
//     const [currentStep, setCurrentStep] = useState(6);
//     const currentKey = searchParams.get("key");
//     const [key, setKey] = useState(() => {
//         const keyParam = searchParams.get("key");
//         return keyParam ? parseInt(keyParam) : 6;
//     });
//     const [internalKey, setInternalKey] = useState()
//     console.log(state,"state")
//     console.log(customProps,"custompropy")

//     const assumptionsFormValues = customProps?.sessionData?.CAMPAIGN_FORM?.campaignForm //array with key and value 
//              const campaignType =  customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code
//      const resourceDistributionStrategyCode= customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode
//       // console.log(assumptionsFormValues, campaignType, resourceDistributionStrategy)
                                   
//       const filteredData = state.HypothesisAssumptions.filter((item) => {
//        // const assumptionsMap = new Map(assumptionsFormValues.map(a => [a.key, a.value]));
//           console.log(  resourceDistributionStrategyCode === item.resourceDistributionStrategyCode)
//          return (
//             campaignType === item.campaignType &&
//             resourceDistributionStrategyCode === item.resourceDistributionStrategyCode && assumptionsFormValues?.selectedDistributionProcess?.code=== item.DistributionProcess &&
//             assumptionsFormValues?.selectedRegistrationDistributionMode?.code === item.isRegistrationAndDistributionHappeningTogetherOrSeparately
//         )
//     });     
 
//     console.log(filteredData,"filterr")






//     function updateUrlParams(params) {
//         const url = new URL(window.location.href);
//         Object.entries(params).forEach(([key, value]) => {
//           url.searchParams.set(key, value);
//         });
//         window.history.replaceState({}, "", url);
//       }
    
//     useEffect(() => {
//         setKey(currentKey);
//         setCurrentStep(currentKey);
//     }, [currentKey])
//     useEffect(() => {
//         updateUrlParams({ key: key });
//         window.dispatchEvent(new Event("checking"));
//       }, [key]);

//     const onStepClick = (currentStep) => {
    
//         if (currentStep === 0) {
//             setKey(1);
//         }
//         else if (currentStep === 1) {
//             setKey(2);
//         }
//         else if (currentStep === 3) {
//             setKey(4);
//         }
//         else setKey(3);
//     };

//     const filteredAssumptions = assumptionCategories.find(category => category.category === selectedCategory)?.assumptions || [];


//     return <>
//         <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
//             <div className="card-container" >
//                 <Card className="card-header-timeline" >
//                     <TextBlock subHeader={t("HCM_CAMPAIGN_DETAILS")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
//                 </Card>
//                 <Card className="stepper-card">
//                     <Stepper
//                         customSteps={["HCM_CAMPAIGN_TYPE", "HCM_CAMPAIGN_NAME", "HCM_CAMPAIGN_DATE", "HCM_SUMMARY"]}
//                         currentStep={currentStep - 1}
//                         onStepClick={onStepClick}
//                         direction={"vertical"}
//                     />
//                 </Card>
//             </div>

//             <div>
//                 <Hypothesis
//                     category={selectedCategory}
//                     assumptions={filteredAssumptions}
//                     onSelect={onSelect}
//                     customProps={customProps}

//                 />
//             </div>
         
//             <ActionBar >
          
                
                
//                     <Button className="previous-button"  variation="secondary" label={t("BACK")} onButtonClick={()=>{} } />
//                      <Button className="previous-button"  variation="primary" label={t('Save And Proceed')} onButtonClick={()=> {}} />
                
//         {/* <LinkButton style={customProps?.skipStyle} label={customProps?.skiplabel || t(`CS_SKIP_CONTINUE`)} onClick={customProps.onSkip} /> */}
//             </ActionBar>
//         </div>


//     </>

// }

// export default HypothesisWrapper;
