//http://localhost:3000/microplan-ui/employee/microplan/setup-microplan?key=1&summary=false&microplanId=cc3751e8-da9a-4743-a239-ada7facacd76&campaignId=afbffd11-57bc-4008-ad40-d26a30432f72
import { Loader, FormComposerV2, Header, MultiUploadWrapper, Close, LogoutIcon, Menu, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { MicroplanConfig } from "../../configs/SetupMicroplanConfig";
import { Stepper, Toast, PopUp, CardText, InfoCard, Button, ActionBar } from "@egovernments/digit-ui-components";
import _ from "lodash";
import { useMyContext } from "../../utils/context";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { fetchDataAndSetParams } from "../../utils/fetchDataAndSetParams";
import useThrottle from "../../hooks/useThrottle";

const SetupMicroplan = ({ hierarchyType, hierarchyData }) => {
  const { dispatch, state } = useMyContext();
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalFormData, setTotalFormData] = useState({});
  const [active, setActive] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();

  const [isLastVerticalStep, setIsLastVerticalStep] = useState(() => {
    const { isLastVerticalStep:isLastVerticalStepParam } = Digit.Hooks.useQueryParams();
    return isLastVerticalStepParam;
  });
  const [isFormulaLastVerticalStep, setIsFormulaLastVerticalStep] = useState(() => {
    const { isFormulaLastVerticalStep:isFormulaLastVerticalStepParam } = Digit.Hooks.useQueryParams();
    return isFormulaLastVerticalStepParam;
  });
  const setupCompleted = queryParams?.["setup-completed"];
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [currentKey, setCurrentKey] = useState(() => {
    return key ? parseInt(key) : 1;
  });
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("MICROPLAN_DATA", {});
  const [microplanConfig, setMicroplanConfig] = useState(MicroplanConfig(totalFormData, null, isSubmitting, null, hierarchyData));

  const handleUrlChange = (event) => {
    const { isLastVerticalStep, isFormulaLastVerticalStep, ...queryParams } = Digit.Hooks.useQueryParams();
    setIsLastVerticalStep(isLastVerticalStep);
    setIsFormulaLastVerticalStep(isFormulaLastVerticalStep);
  };
  useEffect(() => {
    // Add event listener for popstate to detect URL changes
    window.addEventListener("urlChanged", handleUrlChange);

    // Clean up the event listener when the component unmounts or on URL change
    return () => {
      window.removeEventListener("urlChanged", handleUrlChange);
    };
  }, []);

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
      // queryKey: currentKey,
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
      enabled: !!microplanId ,
      // enabled:false
      // queryKey: currentKey,
    }
  );

  // useEffect(() => {
  //   if (Object.keys(params).length > 0) {
  //     return;
  //   }
  //   else if (!isLoadingPlanObject && !isLoadingCampaignObject && campaignObject && planObject) {
  //     fetchDataAndSetParams(  state, setParams, campaignObject, planObject);
  //   }
  // }, [params, isLoadingPlanObject, isLoadingCampaignObject, campaignObject, planObject]);

  useEffect(() => {
    if (isLoadingPlanObject || isLoadingCampaignObject) return;
    if (Object.keys(params)?.length !== 0) return;
    if (!campaignObject || !planObject) return;
    fetchDataAndSetParams(state, setParams, campaignObject, planObject);
  }, [params, isLoadingPlanObject, isLoadingCampaignObject, campaignObject, planObject]);

  //Generic mutation to handle creation and updation of resources(plan/project)
  const { mutate: updateResources, ...rest } = Digit.Hooks.microplanv1.useCreateUpdatePlanProject();

  const throttledUpdateResources = useThrottle(updateResources,250)

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
    setMicroplanConfig(MicroplanConfig(totalFormData, null, isSubmitting, null, hierarchyData));
  }, [totalFormData, isSubmitting]);

  useEffect(() => {
    const handleCheckingEvent = () => {
      const newKey = parseInt(new URLSearchParams(window.location.search).get("key")) || 1;
      setCurrentKey(newKey);
    };

    window.addEventListener("checking", handleCheckingEvent);

    return () => {
      window.removeEventListener("checking", handleCheckingEvent);
    };
  }, []);

  useEffect(() => {
    const handleAssumptionsSubmitEvent = () => {
      const newKey = parseInt(new URLSearchParams(window.location.search).get("key")) || 1;
      setCurrentKey(newKey + 1);
    };

    window.addEventListener("AssumptionsLastPage", handleAssumptionsSubmitEvent);

    return () => {
      window.removeEventListener("AssumptionsLastPage", handleAssumptionsSubmitEvent);
    };
  }, []);

  // setting the current step when the key is changed on the basis of the config
  useEffect(() => {
    setCurrentStep(Number(filteredConfig?.[0]?.form?.[0]?.stepCount - 1));
    // setting the toast to null when moving to next step successfully
    // if any issue comes related to Toast, update here 
    // setShowToast(null);
    // this null was causing toast to immediatealy go to null since filteredConfig gets affected
  }, [currentKey, filteredConfig]);

  useEffect(() => {
     // setting the toast to null when moving to next step successfully
    // if any issue comes related to Toast, update here 
      setShowToast(null)
  }, [currentKey])
  

  useEffect(() => {
    setIsSubmitting(false);
    Digit.Utils.microplanv1.updateUrlParams({ key: currentKey });
    // setSummaryErrors(null);
  }, [currentKey]);

  //sync session with state
  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

  const handleUpdates =(propsForMutate) => {
    setLoader(true);
    throttledUpdateResources(propsForMutate, {
      onSuccess: (data) => {
        // Check if there is a redirectTo property in the response
        if (data?.redirectTo) {
          history.push(data?.redirectTo, data?.state);
          return; // Navigate to the specified route
        }

        //invalidation of files session
        if (data?.invalidateSession && data?.triggeredFrom === "BOUNDARY") {
          // setTotalFormData((prev) => {
          //   return {
          //     ...prev,
          //     UPLOADBOUNDARYDATA: {},
          //   };
          // })
          const currentSession = Digit.SessionStorage.get("MICROPLAN_DATA");
          setParams({
            ...currentSession,
            UPLOADBOUNDARYDATA: null,
            UPLOADFACILITYDATA: null,
          });
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
        }

        //invalidation of formula and hypothesis session
        if (data?.invalidateSession && data?.triggeredFrom === "ASSUMPTIONS_FORM") {
          // setTotalFormData((prev) => {
          //   return {
          //     ...prev,
          //     HYPOTHESIS: {},
          //     FORMULA_CONFIGURATION:{}
          //   };
          // })
          const currentSession = Digit.SessionStorage.get("MICROPLAN_DATA");
          setParams({
            ...currentSession,
            HYPOTHESIS: null,
            FORMULA_CONFIGURATION: null,
          });
          Digit.SessionStorage.del("HYPOTHESIS_DATA");
          Digit.SessionStorage.del("FORMULA_DATA");

          
          setCurrentKey((prev) => prev + 1);
          setCurrentStep((prev) => prev + 1);
          

          //since we are invalidating we need to update this global state
          dispatch({
            type: "MASTER_DATA",
            state: {
              allAssumptions: [],
            },
          });
        }
        refetchPlan();
        setLoader(false);
      },
      onError: (error, variables) => {
        setLoader(false);
        // Display error toast if update fails
        setShowToast({
          key: "error",
          label: error?.message ? t("SETUP_COMPLETE_FAILED_DUE_TO_API_INTEGRATION") : t("FAILED_TO_UPDATE_RESOURCE"),
        });
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

    const toastObject = Digit.Utils.microplanv1.formValidator(formData?.[currentConfBody?.key], currentConfBody?.key, state, t);
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

    if (currentConfBody.showPopupOnSubmission && !microplanId && !campaignId) {
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
    if (setupCompleted) {
      return;
    }
    if (step > currentStep) return;
    const filteredSteps = microplanConfig?.[0].form.filter((item) => item.stepCount === String(step + 1));
    const minKeyStep = filteredSteps.reduce((min, step) => {
      return parseInt(step.key) < parseInt(min.key) ? step : min;
    });
    setCurrentKey(parseInt(minKeyStep?.key));
  };

  const moveToPreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
    setCurrentKey((prev) => prev - 1);
  };

  const goToPreviousScreenFromFormula = () => {
    setCurrentStep((prev) => prev - 1);
    setCurrentKey((prev) => prev - 1);
  };

  useEffect(() => {
    window.addEventListener("moveToPrevious", moveToPreviousStep);

    return () => {
      window.removeEventListener("moveToPrevious", moveToPreviousStep);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("revertToPreviousScreenFromFormula", goToPreviousScreenFromFormula);
    return () => {
      window.removeEventListener("revertToPreviousScreenFromFormula", goToPreviousScreenFromFormula);
    };
  }, []);

  const onSecondayActionClick = () => {
    if (currentKey === 1) {
      Digit.SessionStorage.del("MICROPLAN_DATA");
      Digit.SessionStorage.del("HYPOTHESIS_DATA");
      Digit.SessionStorage.del("FORMULA_DATA");
      history.push(`/${window.contextPath}/employee`);
    }

    if (isLastVerticalStep === "true" || isFormulaLastVerticalStep === "true") {
      window.dispatchEvent(new Event("verticalStepper"));
      return;
    }

    setCurrentStep((prev) => prev - 1);
    setCurrentKey((prev) => prev - 1);
  };

  if (isLoadingCampaignObject || isLoadingPlanObject) {
    return <Loader />;
  }

  const getNextActionLabel = () => {
    if ((currentKey === 7 || currentKey === 10) && isLastVerticalStep && isLastVerticalStep === "false") {
      return null;
    } else if (currentKey === 8 && isFormulaLastVerticalStep && isFormulaLastVerticalStep === "false") {
      return null;
    } else if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.isLast) {
      return t("MP_COMPLETE_DRAFT");
    } else {
      return t("MP_SAVE_PROCEED");
    }
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Stepper
        customSteps={[
          "MICROPLAN_DETAILS",
          "MP_BOUNDARY_SELECTION",
          "MP_MANAGING_DATA",
          "MICROPLAN_ASSUMPTIONS",
          "FORMULA_CONFIGURATION",
          "MP_DATA_VALIDATION",
          "ROLE_ACCESS_CONFIGURATION",
          "SUMMARY",
        ]}
        onStepClick={onStepClick}
        currentStep={currentStep + 1}
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
        secondaryLabel={t("MP_BACK")}
        actionClassName={"actionBarClass microplan-actionbar"}
        className="setup-campaign"
        cardClassName="setup-compaign-card"
        noCardStyle={true}
        onSecondayActionClick={onSecondayActionClick}
        label={getNextActionLabel()}
      />
      {setupCompleted ? (
        <ActionBar
          style={{ zIndex: "19" }}
          setactionFieldsToRight
          actionFields={[
            <Button
              label={t("GO_BACK_TO_MY_MICROPLAN")}
              title={t("GO_BACK_TO_MY_MICROPLAN")}
              // onClick={() => history.goBack()}
              onClick={() => history.push(`/${window.contextPath}/employee/microplan/microplan-search`)}
            />,
          ]}
        />
      ) : null}
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
              title={t("SAVE_PROCEED")}
              onClick={() => {
                setShowPopUp(false);
                //passing props for mutate
                handleUpdates({
                  totalFormData: { ...totalFormData },
                  state,
                  config: filteredConfig?.[0]?.form?.[0],
                  setCurrentKey,
                  setCurrentStep,
                  setShowToast,
                  campaignObject,
                  planObject,
                });
              }}
            />,
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("CANCEL")}
              title={t("CANCEL")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
          ]}
          maxFooterButtonsAllowed={5}
          onClose={() => setShowPopUp(false)}
          onOverlayClick={() => setShowPopUp(false)}
          type="alert"
          className={"alert-popup-setup-microplan"}
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
