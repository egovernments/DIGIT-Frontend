import { ActionBar, Stepper, Toast } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-react-components";
import { ArrowBack, ArrowForward } from "@egovernments/digit-ui-svg-components";

/**
 *
 * @param { config: Object, checkDataCompleteness: boolean, components: Object, childProps: Object, stepNavigationActive: boolean, nextEventAddon: function, setCurrentPageExternally: function, completeNavigation } props
 * @returns
 *
 */
// Main component for creating a microplan
const Navigator = (props) => {
  // States
  const [currentPage, setCurrentPage] = useState();
  const [toast, setToast] = useState();
  const [navigationEvent, setNavigationEvent] = useState();
  /**
   * checkDataCompletion
   * "true": check for data completeness
   * "false": do nothing
   * "valid": data is present
   * "invalid": whole or a part of the data is missing
   * "perform-action": move to the respective step ( had to add this as mutate addons need some buffer time)
   */
  const [checkDataCompletion, setCheckDataCompletion] = useState("false");

  const { t } = useTranslation();

  // Effect to set initial current page when timeline options change
  useEffect(() => {
    if (!props.config || props.config.length === 0) return;
    let response;
    if (props.setCurrentPageExternally) {
      response = props.setCurrentPageExternally({ setCurrentPage, method: "set" });
    }
    if (!response) setCurrentPage(props.config[0]);
  }, [props.config]);

  // Might need it later
  // Effect to handle data completion validation and show toast
  // useEffect(() => {
  //   if (checkDataCompletion === "false" || checkDataCompletion === "true" || checkDataCompletion === "valid") return;
  //   if (checkDataCompletion === "invalid") setToast(t("COMMON_PLEASE_FILL_ALL_THE_FIELDS"));
  //   setCheckDataCompletion("false");
  // }, [checkDataCompletion]);

  // Effect to handle navigation events and transition between steps
  useEffect(() => {
    // if (checkDataCompletion !== "valid" || navigationEvent === undefined) return;
    if (checkDataCompletion === "valid" || checkDataCompletion === "invalid") {
      if (typeof props.nextEventAddon === "function") {
        if (LoadCustomComponent({ component: props.components[currentPage?.component] }) !== null)
          props.nextEventAddon(currentPage, checkDataCompletion, setCheckDataCompletion);
        else props.nextEventAddon(currentPage, true, setCheckDataCompletion);
      } else {
        setCheckDataCompletion("perform-action");
      }
    }
  }, [navigationEvent, checkDataCompletion, props.nextEventAddon]);

  useEffect(() => {
    // if (checkDataCompletion === "perform-action") {
    //   if (navigationEvent && navigationEvent.name === "next") {
    //     if (currentPage?.id >= props.config.length - 1 && typeof props?.completeNavigation == "function") {
    //       return props?.completeNavigation();
    //     }
    //     nextStep();
    //   } else if (navigationEvent && navigationEvent.name === "step" && navigationEvent.step != undefined) onStepClick(navigationEvent.step);
    //   else if (navigationEvent && navigationEvent.name === "previousStep") previousStep();
    //   setCheckDataCompletion("false");
    //   setNavigationEvent(undefined);
    // }
    handleNavigationEvent(checkDataCompletion, navigationEvent, currentPage,setCheckDataCompletion,setNavigationEvent, onStepClick, nextStep, previousStep, props);
  }, [checkDataCompletion, navigationEvent]);

  // Function to navigate to the next step
  const nextStep = useCallback(() => {
    if (!currentPage) return;
    changeCurrentPage(props.config[currentPage?.id + 1]);
    if (currentPage?.id + 1 > props.config.length - 1) return;
    setCurrentPage((previous) => props.config[previous?.id + 1]);
  }, [currentPage]);

  // Function to navigate to the previous step
  const previousStep = useCallback(() => {
    changeCurrentPage(props.config[currentPage?.id - 1]);
    setCurrentPage((previous) => props.config[previous?.id - 1]);
  }, [currentPage]);

  // Function to handle step click and navigate to the selected step
  const onStepClick = useCallback((index) => {
    const newCurrentPage = props.config.find((item) => item.id === index);
    changeCurrentPage(newCurrentPage);
    setCurrentPage(newCurrentPage);
  });

  // Function to handle next button click
  const previousbuttonClickHandler = useCallback(() => {
    if (
      props.checkDataCompleteness &&
      props?.config[currentPage?.id]?.checkForCompleteness &&
      LoadCustomComponent({ component: props.components[currentPage?.component] }) !== null
    ) {
      setCheckDataCompletion("true");
      setNavigationEvent({ name: "previousStep" });
    } else nextStep();
  }, [props.checkDataCompleteness, previousStep]);

  // Function to handle next button click
  const nextbuttonClickHandler = useCallback(() => {
    if (
      props.checkDataCompleteness &&
      props?.config[currentPage?.id]?.checkForCompleteness &&
      LoadCustomComponent({ component: props.components[currentPage?.component] }) !== null
    ) {
      setCheckDataCompletion("true");
      setNavigationEvent({ name: "next" });
    } else nextStep();
  }, [props.checkDataCompleteness, nextStep]);

  // Function to handle step click
  const stepClickHandler = useCallback(
    (index) => {
      if (!props.stepNavigationActive) return;
      if (
        props.checkDataCompleteness &&
        props?.config[currentPage?.id]?.checkForCompleteness &&
        LoadCustomComponent({ component: props.components[currentPage?.component] }) !== null
      ) {
        setCheckDataCompletion("true");
        setNavigationEvent({ name: "step", step: index });
      } else {
        onStepClick(index);
      }
    },
    [props.checkDataCompleteness, props.stepNavigationActive, onStepClick]
  );

  // Function to set current page
  const changeCurrentPage = (newPage) => {
    if (props.setCurrentPageExternally) {
      props.setCurrentPageExternally({ currentPage: newPage, method: "save" });
    }
  };

  const completeNavigation = () => {
      setNavigationEvent({ name: "next" });
      setCheckDataCompletion("true");
  };

  return (
    <div className="create-microplan">
      {/* Stepper component */}
      <Stepper
        type="stepper"
        currentStep={currentPage?.id + 1}
        customSteps={props.config.map((item) => t(item.name))}
        direction="horizontal"
        onStepClick={stepClickHandler}
      />

      {/* Load custom component based on current page */}
      {LoadCustomComponent({ component: props.components[currentPage?.component] }) !== null ? (
        <LoadCustomComponent
          component={props.components[currentPage?.component]}
          secondaryProps={
            checkDataCompletion
              ? { checkDataCompletion, setCheckDataCompletion, currentPage, pages: props.config, navigationEvent, ...props.childProps }
              : {}
          }
        />
      ) : (
        <div className="navigator-componet-not-found">{t("COMMON_DATA_NOT_PRESENT")}</div>
      )}

      {/* Action bar */}
      <ActionBar className={`${currentPage?.id === 0 ? "custom-action-bar-no-first-button" : "custom-action-bar"}`}>
        {/* Back button */}
        {currentPage?.id > 0 && (
          <Button
            type="button"
            className="custom-button custom-button-left-icon"
            label={t("BACK")}
            onButtonClick={previousbuttonClickHandler}
            isSuffix={false}
            variation={"secondary"}
            icon={<ArrowBack className={"icon"} width={"1.5rem"} height={"1.5rem"} fill={"rgba(244, 119, 56, 1)"} />}
          />
        )}
        {/* Next/Submit button */}
        <Button
          type="button"
          className="custom-button"
          label={currentPage?.id < props.config.length - 1 ? t("NEXT") : t("GENERATE_MICROPLAN")}
          onButtonClick={currentPage?.id < props.config.length - 1 ? nextbuttonClickHandler : completeNavigation}
          isSuffix={true}
          variation={"primary"}
          textStyles={{ padding: 0, margin: 0 }}
        >
          <ArrowForward className={"icon"} width={"1.5rem"} height={"1.5rem"} fill={"rgb(255,255,255)"} />
        </Button>
      </ActionBar>

      {/* Toast notification */}
      {toast && <Toast style={{ bottom: "5.5rem" }} label={toast} error={true} onClose={() => setToast(undefined)} />}
    </div>
  );
};

// Component to load custom component based on current page
const LoadCustomComponent = (props) => {
  if (props && !props.component) return null;
  const secondaryProps = props.secondaryProps;
  return <props.component {...secondaryProps} />;
};
LoadCustomComponent.propTypes = {
  component: PropTypes.elementType.isRequired,
  secondaryProps: PropTypes.object,
};


const handleNavigationEvent = (checkDataCompletion, navigationEvent, currentPage,setCheckDataCompletion,setNavigationEvent, onStepClick, nextStep, previousStep, props)=>{
  if (checkDataCompletion === "perform-action") {
    if (navigationEvent && navigationEvent.name === "next") {
      if (currentPage?.id >= props.config.length - 1 && typeof props?.completeNavigation == "function") {
        return props?.completeNavigation();
      }
      nextStep();
    } else if (navigationEvent && navigationEvent.name === "step" && navigationEvent.step != undefined) onStepClick(navigationEvent.step);
    else if (navigationEvent && navigationEvent.name === "previousStep") previousStep();
    setCheckDataCompletion("false");
    setNavigationEvent(undefined);
  }
}


export default Navigator;
