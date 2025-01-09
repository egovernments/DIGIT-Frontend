import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Header, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Dropdown, PopUp, RadioButtons, CardText, Button, Loader, Card } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";

const AssumptionsForm = ({ onSelect, ...props }) => {
    const { state } = useMyContext();
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getStateId();
    const optionsForProcesses = state.ResourceDistributionStrategy;
    const optionsForRegistrationDistributionMode = state.RegistrationAndDistributionHappeningTogetherOrSeparately;
    const [selectedRegistrationProcess, setSelectedRegistrationProcess] = useState(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedRegistrationProcess || false);
    const [selectedDistributionProcess, setSelectedDistributionProcess] = useState(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedDistributionProcess || false);
    const [selectedRegistrationDistributionMode, setSelectedRegistrationDistributionMode] = useState(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedRegistrationDistributionMode || false);
    const [executionCount, setExecutionCount] = useState(0);
    const resourceDistributionStrategyCode = props?.props?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode;

    const [showPopup, setShowPopup] = useState(false)

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
            cacheTime: 0
            //   queryKey: currentKey,
        }
    );

    //to show alert
    useEffect(() => {
        //if there are any assumptions filled show this popup by default
        if (planObject?.assumptions?.length > 0) {
            setShowPopup(true)
        }
    }, [planObject, isLoadingPlanObject])


    useEffect(() => {
        if (executionCount < 5) {
            if (resourceDistributionStrategyCode === "MIXED") {
                onSelect(props.props.name, { selectedRegistrationProcess, selectedDistributionProcess })
                setExecutionCount((prevCount) => prevCount + 1);
                return;
            }

            onSelect(props.props.name, { selectedRegistrationDistributionMode })
            setExecutionCount((prevCount) => prevCount + 1);
        }
    });


    useEffect(() => {

        if (resourceDistributionStrategyCode === "MIXED") {
            onSelect(props.props.name, { selectedRegistrationProcess, selectedDistributionProcess })
            return;
        }

        onSelect(props.props.name, { selectedRegistrationDistributionMode })

    }, [selectedDistributionProcess, selectedRegistrationDistributionMode, selectedRegistrationProcess, resourceDistributionStrategyCode])

    
    useEffect(()=>{
        setSelectedRegistrationDistributionMode(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedRegistrationDistributionMode);
        setSelectedDistributionProcess(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedDistributionProcess);
        setSelectedRegistrationProcess(props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm?.selectedRegistrationProcess);
    },[props?.props?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm])


    if (isLoadingPlanObject) {
        return <Loader />
    }


    return (
        <Card>
            <Header className="uploader-sub-heading">{t("PROVIDE_DETAILS")}</Header>
            <p className="mp-description">{t("ANSWER_TO_PROVIDE_ESTIMATE")}</p>

            {/* Show dropdowns only if the code is MIXED */}
            {resourceDistributionStrategyCode === "MIXED" && (
                <>
                    {/* Dropdown for Registration Process */}
                    <Card type="secondary" className="assumptionsForm-card">
                        <LabelFieldPair className="assumptionsForm-label-field">
                            <div style={{ width: "100%" }}>
                                <span>{t("REGISTRATION_PROCESS")} </span>
                                <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                            </div>
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={true}
                                option={optionsForProcesses.map(item => ({
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
                    <Card type="secondary" className="assumptionsForm-card">
                        <LabelFieldPair className="assumptionsForm-label-field">
                            <div style={{ width: "100%" }}>
                                <span>{t("DISTRIBUTION_PROCESS")} </span>
                                <span className="mandatory-span" style={{ marginLeft: "0rem" }}>*</span>
                            </div>
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={true}
                                option={optionsForProcesses.map(item => ({
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
            {["HOUSE_TO_HOUSE", "FIXED_POST"].includes(resourceDistributionStrategyCode) && (
                <Card type="secondary">
                    <LabelFieldPair className="assumptionsForm-label-field">
                        <div style={{ width: "100%" }}>
                            <span>{t("REGISTRATION_AND_DISTRIBUTION")} </span>
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
                            style={{ display: "flex", gap: "15rem", marginBottom: 0 }}
                            onSelect={(value) => {
                                setSelectedRegistrationDistributionMode(value);
                            }}
                            selectedOption={selectedRegistrationDistributionMode}
                        />
                    </LabelFieldPair>
                </Card>
            )}

            {showPopup && <PopUp
                className={"boundaries-pop-module"}
                type={"alert"}
                alertHeading={t("MP_WARNING_ASSUMPTIONS_FORM")}
                alertMessage={t("MP_ASSUMPTIONS_INVALIDATION_MESSAGE")}
                // heading={t("MP_ASSUMTI")}
                // children={[
                //   <div>
                //     <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_TEXT") + " "}</CardText>
                //   </div>,
                // ]}
                onOverlayClick={() => {
                    setShowPopup(false);
                }}
                onClose={() => {
                    setShowPopup(false);
                }}
                footerChildren={[
                    <Button
                        className={"campaign-type-alert-button"}
                        type={"button"}
                        size={"large"}
                        variation={"secondary"}
                        label={t("MP_ACK")}
                        title={t("MP_ACK")}
                        onClick={() => {
                            setShowPopup(false);
                            //   setCanUpdate(true);
                        }}
                    />
                ]}
            // sortFooterChildren={true}
            ></PopUp>}
        </Card>
    );
};

export default AssumptionsForm;




