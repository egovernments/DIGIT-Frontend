import {
  Loader,
  FormComposerV2,
  Header,
  MultiUploadWrapper,
  Button,
  Close,
  LogoutIcon,
  Menu,
  ActionBar,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import {MicroplanConfig} from "../../configs/SetupMicroplanConfig"
import { Stepper, Toast } from "@egovernments/digit-ui-components";
import _ from "lodash";


const SetupMicroplan = () => {
  const history = useHistory()
  const {t} = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalFormData, setTotalFormData] = useState({});
  const [active, setActive] = useState(0);
  const [microplanConfig, setMicroplanConfig] = useState(MicroplanConfig(totalFormData, null, isSubmitting));
  const [currentKey, setCurrentKey] = useState(() => {
    console.log(searchParams,location);
    debugger;
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("MICROPLAN_DATA", {});


  const filterMicroplanConfig = (microplanConfig, currentKey) => {
    return microplanConfig
      .map((config) => {
        return {
          ...config,
          form: config?.form.filter((step) => parseInt(step.key) === currentKey),
        };
      })
      .filter((config) => config.form.length > 0);
  };

  const [filteredConfig, setFilteredConfig] = useState(filterMicroplanConfig(microplanConfig, currentKey));

  useEffect(() => {
    setFilteredConfig(filterMicroplanConfig(microplanConfig, currentKey));
  }, [microplanConfig, currentKey]);

  const config = filteredConfig?.[0];

  // setting the current step when the key is changed on the basis of the config
  useEffect(() => {
    setCurrentStep(Number(filteredConfig?.[0]?.form?.[0]?.stepCount - 1));
    // setShowToast(null);
  }, [currentKey, filteredConfig]);

  useEffect(() => {
    setIsSubmitting(false);
    Digit.Utils.microplan.updateUrlParams({ key: currentKey, summary: false });
    // setSummaryErrors(null);
  }, [currentKey]);

  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

  const onSubmit = (formData) => {
    // setIsSubmittting to true -> to run inline validations within the components
    setIsSubmitting(true);
    const name = filteredConfig?.[0]?.form?.[0]?.name;
    
    
    // run toast level validations 
    // decide whether to call api or not based on config
    // update totalFormData
    setTotalFormData(prev => {
      return {
        ...prev,
        [name]:formData
      }
    })
    // store data in session storage appropriately(basically sync session with totalFormData)
    setParams({
      ...params,
      [name]:formData
    })
    setCurrentStep(prev => prev + 1)
    setCurrentKey(prev => prev + 1)
  }

  const onStepClick = (step) =>{
    // setCurrentStep(prev => prev + 1)
  }

  const onSecondayActionClick = () => {
    //if step is 1 then redirect to home page
    //otherwise go to prev step
    setCurrentKey(prev => prev-1)
    if(currentStep === 0){
      history.push(`/${window.contextPath}/employee`);
    }else{
      setCurrentStep(prev => prev-1)
    }
  }

  return (
    <React.Fragment>
        <Stepper
          customSteps={[
            "HCM_CAMPAIGN_SETUP_DETAILS",
            "MICROPLAN_DETAILS",
            "MP_BOUNDARY_SELECTION",
            "UPLOAD_DATA",
            "MP_USER_CREATION",
            "HYPOTHESIS",
            "FORMULA_CONFIGURATION",
            "SUMMARY"
          ]}
          currentStep={currentStep + 1}
          onStepClick={onStepClick}
          activeSteps={active}
        />
      <FormComposerV2
        config={config?.form.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={onSubmit}
        showSecondaryLabel={true}
        secondaryLabel={t("ES_COMMON_BACK")}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        cardClassName="setup-campaign-card"
        // noCardStyle={currentKey === 4 || currentStep === 7 || currentStep === 0 ? false : true}
        onSecondayActionClick={onSecondayActionClick}
        label={
          t("ES_COMMON_NEXT")
        }
      />
      {/* {actionBar === "true" && (
        <ActionBar style={{ zIndex: "19" }}>
          {displayMenu ? <Menu options={["UPDATE_DATES", "CONFIGURE_APP"]} t={t} onSelect={onActionSelect} /> : null}
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )} */}
      {/* {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          // info={showToast?.key === "info" ? true : false}
          // error={showToast?.key === "error" ? true : false}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )} */}
    </React.Fragment>
  )
}

export default SetupMicroplan