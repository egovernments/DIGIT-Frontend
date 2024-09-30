            import React, { useState, useEffect, Fragment } from "react";
            import { useTranslation } from "react-i18next";
            import { Card, Header, LabelFieldPair } from "@egovernments/digit-ui-react-components";
            import { Dropdown, RadioButtons } from "@egovernments/digit-ui-components";
            import { useMyContext } from "../utils/context";

            const CampaignForm = ({ onSelect, ...props }) => {
                const { state } = useMyContext();
                const optionsForProcesses = state.ResourceDistributionStrategy;
             
                const optionsForRegistrationDistributionMode = state.RegistrationAndDistributionHappeningTogetherOrSeparately;

                const { t } = useTranslation();
                const initialAssumptions = props.props.sessionData.CAMPAIGN_FORM?.campaignForm || [];


                const [selectedRegistrationProcess, setSelectedRegistrationProcess] = useState(initialAssumptions?.selectedRegistrationProcess || null);
                const [selectedDistributionProcess, setSelectedDistributionProcess] = useState(initialAssumptions?.selectedDistributionProcess || null);
                const [selectedRegistrationDistributionMode, setSelectedRegistrationDistributionMode] = useState(initialAssumptions?.selectedRegistrationDistributionMode || null);
              

                const [executionCount, setExecutionCount] = useState(0);
                const [assumptionsFormValues, setAssumptionsFormValues] = useState([])

                const resourceDistributionStrategyCode = props.props.sessionData?.CAMPAIGN_DETAILS?.campaignDetails.distributionStrat?.resourceDistributionStrategyCode;

              

                  useEffect(()=>{
                 
                        onSelect(props.props.name, {selectedDistributionProcess, selectedRegistrationProcess, selectedRegistrationDistributionMode})
                  },[selectedDistributionProcess, selectedRegistrationDistributionMode, selectedRegistrationProcess])
                const updateSelectedValues = (key, value) => {
                    
                    // setAssumptionsFormValues(prevValues => {
                    //     const newValues = [...prevValues];
                    //     const existingIndex = newValues.findIndex(item => item.key === key);
                        
                    //     if (existingIndex >= 0) {   
                    //         newValues[existingIndex].value = value?.code;
                    //         newValues[existingIndex].code = value?.code;
                    //     } else {
                    //         newValues.push({ key, value: value?.code , code:value?.code});
                    //     }
                    //     return newValues;
                    // });
        
                };
            
             
                const filteredOptions = resourceDistributionStrategyCode === "MIXED"
                ? optionsForProcesses.filter(option => option.resourceDistributionStrategyName !== "Fixed post & House-to-House")
                    : optionsForProcesses;
                        
                // useEffect(()=>{
                //     onSelect(props.props.name, { assumptionsFormValues })
                // },[assumptionsFormValues, props.props.sessionData])

                // useEffect(() => {
                //     if (executionCount < 5) {
                //       onSelect(props.props.name, { assumptionsFormValues })
                //       setExecutionCount((prevCount) => prevCount + 1);
                //     }
                //   });

                return (
                    <Card>
                        <Header>{t("Provide the following details")}</Header>
                        <p className="mp-description">{t("Please answer the following questions with appropriate answers for us to provide an ideal estimate assumption form for you")}</p>

                        {/* Show dropdowns only if the code is MIXED */}
                        {resourceDistributionStrategyCode === "MIXED" && (
                            <>
                                {/* Dropdown for Registration Process */}
                                <Card className="campaignForm-card">
                                    <LabelFieldPair className="campaignForm-label-field">
                                        <div style={{ width: "100%" }}>
                                            <span>{t("How is the campaign registration process happening?")} </span>
                                            <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                                        </div>
                                        <Dropdown
                                            variant="select-dropdown"
                                            t={t}
                                            isMandatory={false}
                                            option={filteredOptions.map(item => ({
                                                code: item.resourceDistributionStrategyCode,
                                                value: item.resourceDistributionStrategyName,
                                            }))}
                                            select={(value) => {
                                                
                                                setSelectedRegistrationProcess(value);
                                                 updateSelectedValues("RegistrationProcess", value);
                                            }}
                                            selected={selectedRegistrationProcess}
                                            optionKey="code"
                                            showToolTip={true}
                                            style={{ width: "25rem" }}
                                        />
                                    </LabelFieldPair>
                                </Card>

                                {/* Dropdown for Distribution Process */}
                                <Card className="campaignForm-card">
                                    <LabelFieldPair className="campaignForm-label-field">
                                        <div style={{ width: "100%" }}>
                                            <span>{t("How is the campaign distribution process happening?")} </span>
                                            <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                                        </div>
                                        <Dropdown
                                            variant="select-dropdown"
                                            t={t}
                                            isMandatory={false}
                                            option={filteredOptions.map(item => ({
                                                code: item.resourceDistributionStrategyCode,
                                                value: item.resourceDistributionStrategyName,
                                            }))}
                                            select={(value) => {
                                        
                                                setSelectedDistributionProcess(value);
                                                updateSelectedValues("DistributionProcess", value);
                                            }}
                                            selected={selectedDistributionProcess}
                                            optionKey="code"
                                            showToolTip={true}
                                            style={{ width: "25rem" }}
                                        />
                                    </LabelFieldPair>
                                </Card>
                            </>
                        )}

                        {/* Show radio buttons only if the code is HOUSE_TO_HOUSE or FIXED_POST */}
                        {["HOUSE_TO_HOUSE", "FIXED_POST", "MIXED"].includes(resourceDistributionStrategyCode) && (
                            <Card className="campaignForm-card">
                                <LabelFieldPair className="campaignForm-label-field">
                                    <div style={{ width: "100%" }}>
                                        <span>{t("Is the registration and distribution process happening together or separately?")} </span>
                                        <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                                    </div>
                                    <RadioButtons
                                        additionalWrapperClass="custom-box"
                                        innerStyles={{ borderBottom: "0.063rem solid rgba(214, 213, 212, 1)" }}
                                        options={optionsForRegistrationDistributionMode.map(item => ({
                                            code: item.registrationAndDistributionHappeningTogetherOrSeparatelyCode,
                                            value: item.registrationAndDistributionHappeningTogetherOrSeparatelyName,
                                        }))}
                                        optionsKey="code"
                                        style={{ display: "flex", gap: "15rem" }}
                                        onSelect={(value) => {
                                          
                                            setSelectedRegistrationDistributionMode(value);
                                            updateSelectedValues("isRegistrationAndDistributionHappeningTogetherOrSeparately", value);
                                        }}
                                        selectedOption={selectedRegistrationDistributionMode}
                                    />
                                </LabelFieldPair>
                            </Card>
                        )}
                    </Card>
                );
            };

            export default CampaignForm;







//code works fine but missing some things from original code
// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Card, Header, LabelFieldPair } from "@egovernments/digit-ui-react-components";
// import { Dropdown, RadioButtons } from "@egovernments/digit-ui-components";
// import { useMyContext } from "../utils/context";

// const CampaignForm = ({ onSelect, ...props }) => {
//     const { state } = useMyContext();
//     const optionsForProcesses = state.ResourceDistributionStrategy;
//     const optionsForRegistrationDistributionMode = state.RegistrationAndDistributionHappeningTogetherOrSeparately;

//     const { t } = useTranslation();
//     const initialAssumptions = props.props.sessionData.CAMPAIGN_FORM?.campaignForm?.assumptionsFormValues || [];
    
//     // Initialize states
//     const [selectedRegistrationProcess, setSelectedRegistrationProcess] = useState(initialAssumptions[0] || null);
//     const [selectedDistributionProcess, setSelectedDistributionProcess] = useState(initialAssumptions[1] || null);
//     const [selectedRegistrationDistributionMode, setSelectedRegistrationDistributionMode] = useState(initialAssumptions[2]?.value || null);
    
//     const updateSelectedValues = (key, value) => {
//         const valueName = value?.value || ""; // Extract name from selected object
//         // Store in session or state
//         const updatedValues = [
//             { key: "How is the campaign registration process happening?", value: selectedRegistrationProcess?.value },
//             { key: "How is the campaign distribution process happening?", value: selectedDistributionProcess?.value },
//             { key: "Is the registration and distribution process happening together or separately?", value: valueName },
//         ];
//         onSelect(props.props.name, { assumptionsFormValues: updatedValues });
//     };

//     // Update assumptions form values on change
//     useEffect(() => {
//         const updatedValues = [
//             { key: "How is the campaign registration process happening?", value: selectedRegistrationProcess?.value },
//             { key: "How is the campaign distribution process happening?", value: selectedDistributionProcess?.value },
//             { key: "Is the registration and distribution process happening together or separately?", value: selectedRegistrationDistributionMode },
//         ];
//         onSelect(props.props.name, { assumptionsFormValues: updatedValues });
//     }, [selectedRegistrationProcess, selectedDistributionProcess, selectedRegistrationDistributionMode]);


//     const filteredOptions = resourceDistributionStrategyCode === "MIXED"
//      ? optionsForProcesses.filter(option => option.resourceDistributionStrategyName !== "Fixed post & House-to-House")
//         : optionsForProcesses;

//     return (
//         <Card>
//             <Header>{t("Provide the following details")}</Header>
//             <p className="mp-description">{t("Please answer the following questions with appropriate answers for us to provide an ideal estimate assumption form for you")}</p>

//             {/* Dropdown for Registration Process */}
//             <Card className="campaignForm-card">
//                 <LabelFieldPair className="campaignForm-label-field">
//                     <div style={{ width: "100%" }}>
//                         <span>{t("How is the campaign registration process happening?")} </span>
//                         <span className="mandatory-span">*</span>
//                     </div>
//                     <Dropdown
//                         variant="select-dropdown"
//                         t={t}
//                         isMandatory={false}
//                         option={filteredOptions.map(item => ({
//                             code: item.resourceDistributionStrategyCode,
//                             value: item.resourceDistributionStrategyName,
//                         }))}
//                         select={(value) => {
//                             setSelectedRegistrationProcess(value);
//                             updateSelectedValues("How is the campaign registration process happening?", value);
//                         }}
//                         selected={selectedRegistrationProcess}
//                         optionKey="value"
//                         showToolTip={true}
//                         style={{ width: "25rem" }}
//                     />
//                 </LabelFieldPair>
//             </Card>

//             {/* Dropdown for Distribution Process */}
//             <Card className="campaignForm-card">
//                 <LabelFieldPair className="campaignForm-label-field">
//                     <div style={{ width: "100%" }}>
//                         <span>{t("How is the campaign distribution process happening?")} </span>
//                         <span className="mandatory-span">*</span>
//                     </div>
//                     <Dropdown
//                         variant="select-dropdown"
//                         t={t}
//                         isMandatory={false}
//                         option={filteredOptions.map(item => ({
//                             code: item.resourceDistributionStrategyCode,
//                             value: item.resourceDistributionStrategyName,
//                         }))}
//                         select={(value) => {
//                             setSelectedDistributionProcess(value);
//                             updateSelectedValues("How is the campaign distribution process happening?", value);
//                         }}
//                         selected={selectedDistributionProcess}
//                         optionKey="value"
//                         showToolTip={true}
//                         style={{ width: "25rem" }}
//                     />
//                 </LabelFieldPair>
//             </Card>

//             {/* Radio Buttons */}
//             <Card className="campaignForm-card">
//                 <LabelFieldPair className="campaignForm-label-field">
//                     <div style={{ width: "100%" }}>
//                         <span>{t("Is the registration and distribution process happening together or separately?")} </span>
//                         <span className="mandatory-span">*</span>
//                     </div>
//                     <RadioButtons
//                         additionalWrapperClass="custom-box"
//                         innerStyles={{ borderBottom: "0.063rem solid rgba(214, 213, 212, 1)" }}
//                         options={optionsForRegistrationDistributionMode.map(item => ({
//                             code: item.registrationAndDistributionHappeningTogetherOrSeparatelyCode,
//                             value: item.registrationAndDistributionHappeningTogetherOrSeparatelyName,
//                         }))}
//                         optionsKey="value"
//                         style={{ display: "flex", gap: "15rem" }}
//                         onSelect={(value) => {
//                             setSelectedRegistrationDistributionMode(value);
//                             updateSelectedValues("Is the registration and distribution process happening together or separately?", value);
//                         }}
//                         selectedOption={selectedRegistrationDistributionMode}
//                     />
//                 </LabelFieldPair>
//             </Card>
//         </Card>
//     );
// };

// export default CampaignForm;





//original code

// import React, { useState, Fragment, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Card, Header, LabelFieldPair } from "@egovernments/digit-ui-react-components";
// import { Dropdown, RadioButtons } from "@egovernments/digit-ui-components";
// import { useMyContext } from "../utils/context";
// import { value } from "jsonpath";

// const CampaignForm = ({ onSelect, ...props }) => {
//     const { state } = useMyContext();
//     const optionsForProcesses = state.ResourceDistributionStrategy;
//     const optionsForRegistrationDistributionMode = state.RegistrationAndDistributionHappeningTogetherOrSeparately;
//     const resourceDistributionStrategyName = props.props.sessionData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyName;
//     const  resourceDistributionStrategyCode = props.props.sessionData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat?.resourceDistributionStrategyCode;
    
    
    
//     const initialAssumptions = props.props.sessionData.CAMPAIGN_FORM?.campaignForm?.assumptionsFormValues || [];
//     const { t } = useTranslation();
//     const [selectedRegistrationProcess, setSelectedRegistrationProcess] = useState(props.props.sessionData.CAMPAIGN_FORM?.campaignForm?.assumptionsFormValues[0] || null);
//     const [selectedDistributionProcess, setSelectedDistributionProcess] = useState(props.props.sessionData.CAMPAIGN_FORM?.campaignForm?.assumptionsFormValues[1] || null);
//     const [selectedRegistrationDistributionMode, setSelectedRegistrationDistributionMode] = useState(initialAssumptions[2].value|| null);
//     const [assumptionsFormValues, setAssumptionsFormValues] = useState([])
//    // console.log(props.props.sessionData.CAMPAIGN_FORM.campaignForm.assumptionsFormValues[0],'ll ')

//     console.log(props)
   

//     console.log(assumptionsFormValues,'ll')

    
     

    
//     const updateSelectedValues = (key, value) => {
//         const valueName = value?.value || ""; // Extract name from selected object
//         setAssumptionsFormValues(prev => {
//             const existingIndex = prev.findIndex(item => item.key === key);
//             if (existingIndex >= 0) {
//                 // Update existing value
//                 const updatedValues = [...prev];
//                 updatedValues[existingIndex].value = valueName; // Update value to just the name
//                 return updatedValues;
//             } else {
//                 // Add new value
//                 return [...prev, { key, value: valueName }];
//             }
//         });
//     };


//     useEffect(()=>{
//         onSelect(props.props.name, { assumptionsFormValues });
//       },[assumptionsFormValues])

//       console.log(props)

//       useEffect(() => {
//         const updatedValues = [
//             { key: "How is the campaign registration process happening?", value: selectedRegistrationProcess?.value },
//             { key: "How is the campaign distribution process happening?", value: selectedDistributionProcess?.value },
//             { key: "Is the registration and distribution process happening together or separately?", value: selectedRegistrationDistributionMode?.value },
//         ];
//         setAssumptionsFormValues(updatedValues);
//     }, [selectedRegistrationProcess, selectedDistributionProcess, selectedRegistrationDistributionMode]);
   
//     useEffect(() => {
//         const campaignForm = props.props.sessionData.CAMPAIGN_FORM?.campaignForm || {};
//         setSelectedRegistrationProcess(campaignForm.assumptionsFormValues[0] || null);
//         setSelectedDistributionProcess(campaignForm.assumptionsFormValues[1] || null);
//         setSelectedRegistrationDistributionMode(campaignForm.assumptionsFormValues[2] || null);
//         setAssumptionsFormValues(campaignForm.assumptionsFormValues || []);
//     }, [props.props.sessionData]);
    

//     const filteredOptions = resourceDistributionStrategyCode === "MIXED"
//         ? optionsForProcesses.filter(option => option.resourceDistributionStrategyName !== "Fixed post & House-to-House")
//         : optionsForProcesses;


//     return (
//         <>
//             <Card>
//                 <Header>{t("Provide the following details")}</Header>
//                 <p className="mp-description">{t(`Please answer the following questions with appropriate answers for us to provide an ideal estimate assumption form for you `)}</p>

//                 {/* Dropdown for Registration Process */}
//                 {resourceDistributionStrategyCode === "MIXED" && (
//                     <Card className="campaignForm-card">
//                         <LabelFieldPair className="campaignForm-label-field">
//                             <div style={{ width: "100%" }}>
//                                 <span>{`${t("How is the campaign registration process happening?")}`} </span>
//                                 <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
//                             </div>
//                             <Dropdown
//                                 variant="select-dropdown"
//                                 t={t}
//                                 isMandatory={false}
//                                 option={filteredOptions.map(item => ({
//                                     code: item.resourceDistributionStrategyCode,
//                                     value: item.resourceDistributionStrategyName
//                                 }))}
//                                 select={(value) => {
//                                     console.log(value)
//                                     setSelectedRegistrationProcess(value)
//                                     updateSelectedValues("How is the campaign registration process happening?", value);
//                                 }}
//                                 selected={selectedRegistrationProcess}
//                                 optionKey="value"
//                                 showToolTip={true}
//                                 style={{ width: "25rem" }}
//                             />
//                         </LabelFieldPair>
//                     </Card>
//                 )}

//                 {/* Dropdown for Distribution Process */}
//                 {resourceDistributionStrategyCode === "MIXED" && (
//                     <Card className="campaignForm-card">
//                         <LabelFieldPair className="campaignForm-label-field">
//                             <div style={{ width: "100%" }}>
//                                 <span>{`${t("How is the campaign distribution process happening?")}`} </span>
//                                 <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
//                             </div>
//                             <Dropdown
//                                 variant="select-dropdown"
//                                 t={t}
//                                 isMandatory={false}
//                                 option={filteredOptions.map(item => ({
//                                     code: item.resourceDistributionStrategyCode,
//                                     value: item.resourceDistributionStrategyName
//                                 }))}
//                                 select={(value) => {
//                                     setSelectedDistributionProcess(value)
//                                     updateSelectedValues("How is the campaign distribution process happening?", value);
//                                 }}
//                                 selected={selectedDistributionProcess}
//                                 optionKey="value"
//                                 showToolTip={true}
//                                 style={{ width: "25rem" }}
//                             />
//                         </LabelFieldPair>
//                     </Card>
//                 )}

//                 {/* Radio Buttons */}
//                 {["HOUSE_TO_HOUSE", "FIXED_POST", "MIXED"].includes(resourceDistributionStrategyCode) && (
//                     <Card className="campaignForm-card">
//                         <LabelFieldPair className="campaignForm-label-field">
//                             <div style={{ width: "100%" }}>
//                                 <span>{`${t("Is the registration and distribution process happening together or separately?")}`} </span>
//                                 <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
//                             </div>
//                             <RadioButtons
//                                 additionalWrapperClass="custom-box"
//                                 innerStyles={{ borderBottom: "0.063rem solid rgba(214, 213, 212, 1)" }}
//                                 options={optionsForRegistrationDistributionMode.map(item => ({
//                                     code: item.registrationAndDistributionHappeningTogetherOrSeparatelyCode,
//                                     value: item.registrationAndDistributionHappeningTogetherOrSeparatelyName
//                                 }))}
//                                 optionsKey={"value"}
//                                 style={{ display: "flex", gap: "15rem" }}
//                                 onSelect={(value) => {
//                                     console.log(value);
//                                     setSelectedRegistrationDistributionMode(value);
//                                     updateSelectedValues("Is the registration and distribution process happening together or separately?", value);
//                                 }}
//                                 selectedOption={selectedRegistrationDistributionMode}
//                             />
//                         </LabelFieldPair>
//                     </Card>
//                 )}
//             </Card>
//         </>
//     );
// };

// export default CampaignForm;


















// import React, { useState, useEffect,Fragment} from "react";
// import { useTranslation } from "react-i18next";
// import { Card, Header, LabelFieldPair} from "@egovernments/digit-ui-react-components";
// import { Dropdown, RadioButtons, } from "@egovernments/digit-ui-components";
// import { useMyContext } from "../utils/context";


// const CampaignForm = ({onSelect, ...props})=>{
//     const {state} = useMyContext()
//     console.log(state)
//    // console.log(props)

//    const optionsForProcesses= state.ResourceDistributionStrategy
//    const optionsForRegistartionDistributionMode =  state.RegistrationAndDistributionHappeningTogetherOrSeparately
                              

//    const resourceDistributionStrategyName = props.props.sessionData.CAMPAIGN_DETAILS.campaignDetails.distributionStrat.resourceDistributionStrategyName
//    console.log(props)
//    console.log(resourceDistributionStrategyName)
//     const { t } = useTranslation();
//     const [options, setOptions] = useState(optionsForProcesses)
//     const [selectedRegistrationProcess, setSelectedRegistrationProcess] = useState(null);
//     const [selectedDistributionProcess, setSelectedDistributionProcess] = useState(null);
//     const [selectedregistrationDistributionMode, setSelectedRegistrationDistributionMode] = useState(null);



       
//      return <>
           
//            <Card>
//                 <Header>{t("Provide the following details")}</Header>
//                 <p className="mp-description">{t(`Please answer the following questions with appropriate answers for us to provide an ideal estimate assumption form for you `)}</p>

//                 <Card className="campaignForm-card">
//                   <LabelFieldPair className="campaignForm-label-field">
//                     <div style={{width:"100%"}}>
//                     <span>{`${t("How is the campaign registration process happening?")}`} </span>
//                     <span className="mandatory-span" style={{marginLeft:"0rem"}}>*</span>
//                     </div>
                      
                     
//                             <Dropdown
//                                 variant="select-dropdown"
//                                 t={t}
//                                 isMandatory={false}
//                                 option={options.map(item => ({
//                                     code: item.resourceDistributionStrategyCode,
//                                     name: item.resourceDistributionStrategyName
//                                   })) }
//                                 select={(value)=> setSelectedRegistrationProcess(value)}
//                                 selected={selectedRegistrationProcess}
//                                 optionKey="name"
//                                 showToolTip={true}
//                                 style={{width:"25rem",}}
//                             />
//                   </LabelFieldPair>
//                 </Card>

//                 <Card className="campaignForm-card">
//                   <LabelFieldPair className="campaignForm-label-field">
//                     <div style={{width:"100%"}}>
//                     <span>{`${t("How is the campaign distribution process happening?")}`} </span>
//                     <span className="mandatory-span" style={{marginLeft:"0rem"}}>*</span>
//                     </div>
                      
                     
//                             <Dropdown
//                                 variant="select-dropdown"
//                                 t={t}
//                                 isMandatory={false}
//                                 option={options.map(item => ({
//                                     code: item.resourceDistributionStrategyCode,
//                                     name: item.resourceDistributionStrategyName
//                                   })) }
//                                 select={(value)=> setSelectedDistributionProcess(value)}
//                                 selected={selectedDistributionProcess}
//                                 optionKey="name"
//                                 showToolTip={true}
//                                 style={{width:"25rem",}}
//                             />
//                   </LabelFieldPair>
//                 </Card>

//                 <Card className="campaignForm-card">
//                   <LabelFieldPair className="campaignForm-label-field">
//                     <div style={{width:"100%"}}>
//                     <span>{`${t("Is the registration and distribution process happening together or separately?")}`} </span>
//                     <span className="mandatory-span" style={{marginLeft:"0rem"}}>*</span>
//                     </div>
                      
                     
//                     <RadioButtons   
//                          additionalWrapperClass="custom-box"
//                         innerStyles={{ borderBottom: "0.063rem solid rgba(214, 213, 212, 1)" }}
//                          options={optionsForRegistartionDistributionMode.map(item =>({
//                              code:item.registrationAndDistributionHappeningTogetherOrSeparatelyCode,
//                              name:item.registrationAndDistributionHappeningTogetherOrSeparatelyName
//                          }))}
//                          optionsKey={"name"}
//                          style={{ display:"flex", gap:"15rem" }}
//                          onSelect={(value)=>{
//                             console.log(value)
//                             setSelectedRegistrationDistributionMode(value)
//                          }}
//                         selectedOption={selectedregistrationDistributionMode}
//               />
//                   </LabelFieldPair>
//                 </Card>
//            </Card>   
     
//            </>
// }

// export default CampaignForm;