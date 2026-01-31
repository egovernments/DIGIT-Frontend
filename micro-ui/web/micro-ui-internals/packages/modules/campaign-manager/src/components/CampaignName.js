import React, { useState, useEffect ,Fragment} from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { ErrorMessage, FieldV1 , Stepper , TextBlock ,Card , HeaderComponent } from "@egovernments/digit-ui-components";

const CampaignName = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();
  
  const [executionCount, setExecutionCount] = useState(0);
  const [startValidation, setStartValidation] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const microplanName = searchParams.get("microName");
  const source = searchParams.get("source");
  const [name, setName] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName || "");
  useEffect(() => { 
    if(source === "microplan"){
          const sessionName = props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName.replace(/&/g, "and");
          if(sessionName === microplanName){
            setName("");
          }
        }
    else setName(props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName);
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_NAME]);
 
  const [currentStep , setCurrentStep] = useState(1);
  const currentKey = searchParams.get("key");
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
    if (props?.props?.isSubmitting && !name) {
      setError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
    } else {
      setError(null);
    }
  }, [props?.props?.isSubmitting]);
  useEffect(() => {
    if (startValidation && !name) {
      setError({ message: "CAMPAIGN_NAME_FIELD_ERROR" });
    } else if (name) {
      setError(null);
      onSelect("campaignName", name);
    }
  }, [name, props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect("campaignName", name);
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
    if (!props?.props?.sessionData?.HCM_CAMPAIGN_NAME){
      if(props?.props?.sessionData?.HCM_CAMPAIGN_TYPE && currentStep === 0){
        setKey(1);
      }
      else return ;
    }
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
        {/* <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_CAMPAIGN_DETAILS")}  subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper
              customSteps={[ "HCM_CAMPAIGN_TYPE","HCM_CAMPAIGN_NAME", "HCM_CAMPAIGN_DATE" ,  "HCM_SUMMARY"]}
              currentStep={currentStep}
              onStepClick={onStepClick}
              direction={"vertical"}
            />
          </Card>
        </div> */}
      
      <div className="card-container2">
        <Card className = "setup-campaign-card">
        <HeaderComponent styles={{ margin: '0px' }}>{t(`HCM_CAMPAIGN_NAME_HEADER`)}</HeaderComponent>
        <p className="name-description">{t(`HCM_CAMPAIGN_NAME_DESCRIPTION`)}</p>
      <LabelFieldPair className="name-container-label" style={{ display: "flex" }}>
        <div className="name-container">
          <span>{`${t("HCM_CAMPAIGN_NAME")}`}</span>
          <span className="mandatory-span">*</span>
        </div>
        <FieldV1
          type="text"
          error={error?.message ? t(error?.message) : ""}
          style={{ width: "-webkit-fill-available", marginBottom: "0" }}
          populators={{ name: "campaignName" }}
          placeholder={t("HCM_CAMPAIGN_NAME_EXAMPLE")}
          value={name}
          onChange={(event) => {
            setStartValidation(true);
            setName(event.target.value);
          }}
        />
      </LabelFieldPair>
      </Card>
      </div>
      </div>
    </>
  );
};

export default CampaignName;
