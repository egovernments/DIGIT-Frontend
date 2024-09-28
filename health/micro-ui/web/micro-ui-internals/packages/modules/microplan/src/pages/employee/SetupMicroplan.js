//http://localhost:3000/microplan-ui/employee/microplan/setup-microplan?key=1&summary=false&microplanId=cc3751e8-da9a-4743-a239-ada7facacd76&campaignId=afbffd11-57bc-4008-ad40-d26a30432f72
import {
  Loader,
  FormComposerV2,
  Header,
  MultiUploadWrapper,
  Close,
  LogoutIcon,
  Menu,
  ActionBar,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { MicroplanConfig } from "../../configs/SetupMicroplanConfig";
import { Stepper, Toast, PopUp, CardText, InfoCard,Button } from "@egovernments/digit-ui-components";
import _ from "lodash";
import { useMyContext } from "../../utils/context";

const SetupMicroplan = ({ hierarchyType, hierarchyData }) => {
  const { dispatch, state } = useMyContext();
  const history = useHistory();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalFormData, setTotalFormData] = useState({});
  const [active, setActive] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [currentKey, setCurrentKey] = useState(() => {
    return key ? parseInt(key) : 1;
  });
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("MICROPLAN_DATA", {});
  const [microplanConfig, setMicroplanConfig] = useState(MicroplanConfig(params, null, isSubmitting, null, hierarchyData));

  //fetch existing campaign object
  const {
    isLoading: isLoadingCampaignObject,
    data: campaignObject,
    error: errorCampaign,
    refetch: refetchCampaign,
  } = Digit.Hooks.microplanv1.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId,
        ids: [campaignId],
      },
    },
    {
      enabled: campaignId ? true : false,
      queryKey: currentKey,
    }
  );

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
      queryKey: currentKey,
    }
  );

  //Generic mutation to handle creation and updation of resources(plan/project)
  const { mutate: updateResources, ...rest } = Digit.Hooks.microplanv1.useCreateUpdatePlanProject();
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

  useEffect(() => {
    setMicroplanConfig(MicroplanConfig(params, null, isSubmitting, null, hierarchyData));
  }, [totalFormData, isSubmitting]);

  // setting the current step when the key is changed on the basis of the config
  useEffect(() => {
    setCurrentStep(Number(filteredConfig?.[0]?.form?.[0]?.stepCount - 1));
    // setShowToast(null);
  }, [currentKey, filteredConfig]);

  useEffect(() => {
    setIsSubmitting(false);
    Digit.Utils.microplanv1.updateUrlParams({ key: currentKey });
    // setSummaryErrors(null);
  }, [currentKey]);

  //sync session with state
  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

  const handleUpdates = (propsForMutate) => {
    updateResources(propsForMutate, {
      onSuccess: (data) => {
        
      },
      onError: (error, variables) => {
        
        setShowToast(({ key: "error", label: error?.message ? error.message : t("FAILED_TO_UPDATE_RESOURCE") }))
      },
    });
  };

  const onSubmit = (formData) => {
    // setIsSubmittting to true -> to run inline validations within the components
    setIsSubmitting(true);

    //config
    const name = filteredConfig?.[0]?.form?.[0]?.name;
    const currentConfBody = filteredConfig?.[0]?.form?.[0]?.body?.[0];

    //Run sync validations on formData based on the screen(key)
    const toastObject = Digit.Utils.microplanv1.formValidator(formData?.[currentConfBody?.key], currentConfBody?.key, state);
    if (toastObject) {
      setShowToast(toastObject);
      return;
    }

    // run toast level validations
    // decide whether to call api or not based on config
    // update totalFormData
    setTotalFormData((prev) => {
      return {
        ...prev,
        [name]: formData,
      };
    });
    // store data in session storage appropriately(basically sync session with totalFormData)
    setParams({
      ...params,
      [name]: formData,
    });

    //if reach till here then call mutate with requiredDetails
    const propsForMutate = {
      totalFormData: { ...totalFormData, [name]: formData },
      state,
      config: filteredConfig?.[0]?.form?.[0],
      setCurrentKey,
      setCurrentStep,
      setShowToast,
      campaignObject,
      planObject,
    };

    if (currentConfBody.showPopupOnSubmission && (!microplanId && !campaignId)) {
      setShowPopUp(true);
      //handle updates is called in popup's confirmation button
      return;
    }
    handleUpdates(propsForMutate);

    //for now on every next click updating this later we'll remove
    // setCurrentStep((prev) => prev + 1);
    // setCurrentKey((prev) => prev + 1);
  };

  const onStepClick = (step) => {
    // setCurrentStep(prev => prev + 1)
  };

  const onSecondayActionClick = () => {
    //if step is 1 then redirect to home page
    //otherwise go to prev step
    setCurrentKey((prev) => prev - 1);
    if (currentStep === 0) {
      history.push(`/${window.contextPath}/employee`);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (isLoadingCampaignObject || isLoadingPlanObject) {
    return <Loader />;
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
          "SUMMARY",
        ]}
        currentStep={currentStep + 1}
        onStepClick={onStepClick}
        activeSteps={active}
      />
      <FormComposerV2
        config={filteredConfig?.[0]?.form.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={onSubmit}
        showSecondaryLabel={true}
        secondaryLabel={t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        cardClassName="setup-campaign-card"
        noCardStyle={true}
        onSecondayActionClick={onSecondayActionClick}
        label={t("HCM_NEXT")}
      />
      {/* {actionBar === "true" && (
        <ActionBar style={{ zIndex: "19" }}>
          {displayMenu ? <Menu options={["UPDATE_DATES", "CONFIGURE_APP"]} t={t} onSelect={onActionSelect} /> : null}
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )} */}
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={() => {
            setShowToast(false);
          }}
        />
      )}

      {/* Popup for alert but onClick of footerChildren not working */}
      {showPopUp && (
        <PopUp
          alertHeading={t(`${filteredConfig?.[0]?.form?.[0]?.body?.[0]?.showPopupOnSubmission?.alertHeader}`)}
          equalWidthButtons={true}
          alertMessage={t(" ")}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("SAVE_PROCEED")}
              onClick={() => {
                setShowPopUp(false);
                //passing props for mutate
                handleUpdates(
                  {
                    totalFormData: { ...totalFormData },
                    state,
                    config: filteredConfig?.[0]?.form?.[0],
                    setCurrentKey,
                    setCurrentStep,
                    setShowToast,
                    campaignObject,
                    planObject,
                  }
                )
              }}
            />,
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("CANCEL")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
          ]}
          maxFooterButtonsAllowed={5}
          onClose={() => setShowPopUp(false)}
          onOverlayClick={() => setShowPopUp(false)}
          type="alert"
        >
          <div>{t(`${filteredConfig?.[0]?.form?.[0]?.body?.[0]?.showPopupOnSubmission?.alertMessage}`)}</div>
        </PopUp>
      )}
      {/* Default popup */}
      {/* {showPopUp && (<PopUp
            className={"boundaries-pop-module"}
            onClose={()=> setShowPopUp(false)}
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
            footerChildren={[
              <Button
                className={"campaign-type-alert-button"}
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("Heloo")}
                onClick={() => {
                  setShowPopUp(false);
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
                  // setCanUpdate(false);
                }}
              />,
            ]}
            sortFooterChildren={true}
          ></PopUp>)} */}
    </React.Fragment>
  );
};

export default SetupMicroplan;
