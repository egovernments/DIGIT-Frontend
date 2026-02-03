import React, { useState, useMemo, useRef, useEffect, Fragment } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { AlertCard, LabelFieldPair, Button, CardText, Dropdown, ErrorMessage, PopUp, Stepper,HeaderComponent, TextBlock, Card } from "@egovernments/digit-ui-components";

const CampaignSelection = ({ onSelect, formData, formState, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-PROJECT-TYPES", [{ name: "projectTypes" }],{select:(MdmsRes)=>MdmsRes}, { schemaCode: `${"HCM-PROJECT-TYPES"}.projectTypes` });
  const [type, setType] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType || {});
  const [beneficiaryType, setBeneficiaryType] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType || "");
  const [showBeneficiary, setShowBeneficiaryType] = useState(Boolean(props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType));
  const [executionCount, setExecutionCount] = useState(0);
  const [error, setError] = useState(null);
  const [startValidation, setStartValidation] = useState(null);
  const [showPopUp, setShowPopUp] = useState(null);
  const [canUpdate, setCanUpdate] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const [currentStep, setCurrentStep] = useState(1);
  const currentKey = searchParams.get("key");
  const source = searchParams.get("source");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  useEffect(() => {
    if (props?.props?.isSubmitting && !type) {
      setError({ message: "CAMPAIGN_FIELD_MANDATORY" });
    }
  }, [props?.props?.isSubmitting]);
  useEffect(() => {
    setType(props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType);
    setBeneficiaryType(props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType);
    setShowBeneficiaryType(Boolean(props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType));
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType]);

  const handleChange = (data) => {
    setType(data);
    setBeneficiaryType(data?.beneficiaryType);
    setShowBeneficiaryType(true);
  };

  useEffect(() => {
    if (!type && startValidation) {
      setError({ message: "CAMPAIGN_FIELD_MANDATORY" });
    } else {
      setError(null);
      onSelect("projectType", type);
    }
  }, [type]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect("projectType", type);
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  useEffect(() =>{
    setKey(currentKey);
    setCurrentStep(currentKey);
  }, [currentKey])

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  const onStepClick = (currentStep) => {
    if (!props?.props?.sessionData?.HCM_CAMPAIGN_TYPE) return;
    if(currentStep === 0){
      setKey(1);
    }
    else if(currentStep === 1){
      setKey(2);
    }
    else if(currentStep === 3){
      setKey(4);
    }
    else setKey(3);
  };

  return (
    <>
      <div className="container">
        <div className="card-container" >
          <Card className="card-header-timeline" >
            <TextBlock subHeader={t("HCM_CAMPAIGN_DETAILS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper
              customSteps={["HCM_CAMPAIGN_TYPE","HCM_CAMPAIGN_NAME",  "HCM_CAMPAIGN_DATE" , "HCM_SUMMARY"]}
              currentStep={currentStep }
              onStepClick={onStepClick}
              direction={"vertical"}
            />
          </Card>
        </div>

        <div className="card-container2">
          <Card className = "setup-campaign-card">
            <HeaderComponent styles={{ margin: '0px' }}>{t(`HCM_CAMPAIGN_TYPE_HEADER`)}</HeaderComponent>
            <p className="description-type">{t(`HCM_CAMPAIGN_TYPE_DESCRIPTION`)}</p>
            <LabelFieldPair style={{ display: "flex", marginBottom:"-0.8rem" }}>
              <div className="campaign-type">
                <span>{`${t("HCM_CAMPAIGN_TYPE")}`}</span>
                <span className="mandatory-span">*</span>
              </div>
              <div
                className="campaign-type-wrapper"
                onClick={(e) => {
                  if (props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType && !canUpdate && source!=="microplan") {
                    setShowPopUp(true);
                    return;
                  }
                  return;
                }}
                onFocus={(e) => {
                  if (props?.props?.sessionData?.HCM_CAMPAIGN_TYPE?.projectType && !canUpdate) {
                    setShowPopUp(true);
                    return;
                  }
                  return;
                }}
              >
                <Dropdown
                  style={!showBeneficiary ? { width: "40rem", paddingBottom: 0, marginBottom: 0 } : { width: "40rem", paddingBottom: "1rem" }}
                  variant={error ? "error" : ""}
                  t={t}
                  option={projectType?.["HCM-PROJECT-TYPES"]?.projectTypes}
                  optionKey={"code"}
                  selected={type}
                  select={(value) => {
                    setStartValidation(true);
                    handleChange(value);
                  }}
                  disabled = {source === "microplan"}
                  
                />
                {error?.message && <ErrorMessage message={t(error?.message)} showIcon={true} />}
              </div>
            </LabelFieldPair>
            {showBeneficiary && (
              <LabelFieldPair style={{ alignItems: "center" , display: "flex" , marginBottom: "0rem" }} >
                <div className="beneficiary-type">{`${t("HCM_BENEFICIARY_TYPE")}`}</div>
                <div>{t(`CAMPAIGN_TYPE_${beneficiaryType}`)}</div>
              </LabelFieldPair>
            )}
          </Card>
           <AlertCard
                        populators={{
                          name: "infocard",
                        }}
                        variant="info"
                        text={t("HCM_UPDATE_CAMPAIGN_TYPE_INFO")}
                        style={{ marginTop: "1rem", maxWidth: "100%" }}
                      />
        </div>
        {showPopUp && (
          <PopUp
            className={"boundaries-pop-module"}
            type={"default"}
            heading={t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_HEADER")}
            children={[
              <div>
                <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_TEXT") + " "}</CardText>
              </div>,
            ]}
            onOverlayClick={() => {
              setShowPopUp(false);
            }}
            onClose={() => {
              setShowPopUp(false);
            }}
            footerChildren={[
              <Button
                className={"campaign-type-alert-button"}
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("ES_CAMPAIGN_BOUNDARY_MODAL_BACK")}
                onClick={() => {
                  setShowPopUp(false);
                  setCanUpdate(true);
                }}
              />,
              <Button
                className={"campaign-type-alert-button"}
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("ES_CAMPAIGN_BOUNDARY_MODAL_SUBMIT")}
                onClick={() => {
                  setShowPopUp(false);
                  setCanUpdate(false);
                }}
              />,
            ]}
            sortFooterChildren={true}
          ></PopUp>
        )}
      </div>
    </>
  );
};

export default CampaignSelection;
