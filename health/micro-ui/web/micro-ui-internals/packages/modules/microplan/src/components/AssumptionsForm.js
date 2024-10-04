import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Dropdown, RadioButtons } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";

const AssumptionsForm = ({ onSelect, ...props }) => {
    const { state } = useMyContext();
    const { t } = useTranslation();
    const optionsForProcesses = state.ResourceDistributionStrategy;
    const optionsForRegistrationDistributionMode = state.RegistrationAndDistributionHappeningTogetherOrSeparately;
    const [selectedRegistrationProcess, setSelectedRegistrationProcess] = useState(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedRegistrationProcess || false);
    const [selectedDistributionProcess, setSelectedDistributionProcess] = useState(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedDistributionProcess || false);
    const [selectedRegistrationDistributionMode, setSelectedRegistrationDistributionMode] = useState(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedRegistrationDistributionMode || false);
    const [executionCount, setExecutionCount] = useState(0);
    const resourceDistributionStrategyCode = props?.props?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode;

    useEffect(() => {
        if (executionCount < 5) {
            onSelect(props.props.name, {selectedRegistrationProcess,selectedDistributionProcess,selectedRegistrationDistributionMode})
            setExecutionCount((prevCount) => prevCount + 1);
        }
      });
    

      useEffect(()=>{
    
        if(resourceDistributionStrategyCode === "MIXED"){
            onSelect(props.props.name, {selectedRegistrationProcess,selectedDistributionProcess,selectedRegistrationDistributionMode})
            return;
        }
     
        onSelect(props.props.name,{selectedRegistrationDistributionMode} )
        
      },[selectedDistributionProcess, selectedRegistrationDistributionMode, selectedRegistrationProcess, resourceDistributionStrategyCode])



 
    const filteredOptions = resourceDistributionStrategyCode === "MIXED"
    ? optionsForProcesses.filter(option => option.resourceDistributionStrategyName !== "Fixed post & House-to-House")
        : optionsForProcesses;
   

    return (
        <Card>
            <Header>{t("Provide the following details")}</Header>
            <p className="mp-description">{t("Please answer the following questions with appropriate answers for us to provide an ideal estimate assumption form for you")}</p>

            {/* Show dropdowns only if the code is MIXED */}
            {resourceDistributionStrategyCode === "MIXED" && (
                <>
                    {/* Dropdown for Registration Process */}
                    <Card className="assumptionsForm-card">
                        <LabelFieldPair className="assumptionsForm-label-field">
                            <div style={{ width: "100%" }}>
                                <span>{t("How is the campaign registration process happening?")} </span>
                                <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                            </div>
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={true}
                                option={filteredOptions.map(item => ({
                                    code: item.resourceDistributionStrategyCode,
                                    value: item.resourceDistributionStrategyName,
                                }))}
                                select={(value) => {
                                    setSelectedRegistrationProcess(value);
                                }}
                                selected={selectedRegistrationProcess}
                                optionKey="code"
                                showToolTip={true}
                                style={{ width: "25rem" }}
                            />
                        </LabelFieldPair>
                    </Card>

                    {/* Dropdown for Distribution Process */}
                    <Card className="assumptionsForm-card">
                        <LabelFieldPair className="assumptionsForm-label-field">
                            <div style={{ width: "100%" }}>
                                <span>{t("How is the campaign distribution process happening?")} </span>
                                <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                            </div>
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={true}
                                option={filteredOptions.map(item => ({
                                    code: item.resourceDistributionStrategyCode,
                                    value: item.resourceDistributionStrategyName,
                                }))}
                                select={(value) => {
                                    setSelectedDistributionProcess(value);
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
                <Card className="assumptionsForm-card">
                    <LabelFieldPair className="assumptionsForm-label-field">
                        <div style={{ width: "100%" }}>
                            <span>{t("Is the registration and distribution process happening together or separately?")} </span>
                            <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                        </div>
                        <RadioButtons
                            isMandatory={true}
                            additionalWrapperClass="custom-box"
                            innerStyles={{ borderBottom: "0.063rem solid rgba(214, 213, 212, 1)" }}
                            options={optionsForRegistrationDistributionMode?.map(item => ({
                                code: item.registrationAndDistributionHappeningTogetherOrSeparatelyCode,
                                value: item.registrationAndDistributionHappeningTogetherOrSeparatelyName,
                            }))}
                            optionsKey="code"
                            style={{ display: "flex", gap: "15rem" }}
                            onSelect={(value) => {
                                setSelectedRegistrationDistributionMode(value);
                            }}
                            selectedOption={selectedRegistrationDistributionMode}
                        />
                    </LabelFieldPair>
                </Card>
            )}
        </Card>
    );
};

export default AssumptionsForm;




