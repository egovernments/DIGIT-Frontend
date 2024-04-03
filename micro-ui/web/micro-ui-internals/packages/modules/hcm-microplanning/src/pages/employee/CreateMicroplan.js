// import { ActionBar, FormComposerV2 } from "@egovernments/digit-ui-react-components";
// import { ActionBar, Button, Stepper} from "@egovernments/digit-ui-components";
import { ActionBar, Stepper, Toast } from "@egovernments/digit-ui-components";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { timeLineOptions } from "../../configs/timeLineOptions.json";
import Upload from "./Upload";
import Hypothesis from "./Hypothesis";
import RuleEngine from "./RuleEngine";
import { Button } from "@egovernments/digit-ui-react-components";
import { ArrowBack, ArrowForward } from "@egovernments/digit-ui-svg-components";

export const components = {
  Upload,
  Hypothesis,
  RuleEngine,
};

// Main component for creating a microplan
const CreateMicroplan = () => {
  // States
  const [currentPage, setCurrentPage] = useState();
  const [microplanData, setMicroplanData] = useState();
  const [toast, setToast] = useState();
  const [navigationEvent, setNavigationEvent] = useState();
  /**
   * checkDataCompletion
   * "true": check for data completeness
   * "false": do nothing
   * "valid": data is present move to the respective step
   * "invalid": whole or a part of the data is missing
   */
  const [checkDataCompletion, setCheckDataCompletion] = useState("false");

  const { t } = useTranslation();

  // Effect to set initial current page when timeline options change
  useEffect(() => {
    if (!timeLineOptions || timeLineOptions.length === 0) return;
    setCurrentPage(timeLineOptions[0]);
  }, [timeLineOptions]);

  // Effect to handle data completion validation and show toast
  useEffect(() => {
    if (checkDataCompletion === "false" || checkDataCompletion === "true" || checkDataCompletion === "valid") return;
    if (checkDataCompletion === "invalid") setToast({ label: t("ERROR_DATA_INCOMPLETE"), error: true });
    setCheckDataCompletion("false");
  }, [checkDataCompletion]);

  // Effect to handle navigation events and transition between steps
  useEffect(() => {
    if (checkDataCompletion !== "valid" || navigationEvent === undefined) return;
    if (navigationEvent === "next") nextStep();
    else if (navigationEvent === "step") onStepClick();
    setCheckDataCompletion("false");
    setNavigationEvent(undefined);
  }, [navigationEvent, checkDataCompletion]);

  // useEffect to store data in session storage
  useEffect(() => {
    if (!microplanData) return;
    Digit.SessionStorage.set("microplanData", microplanData);
  }, [microplanData]);

  // useEffect to store data in session storage
  useEffect(() => {
    const data = Digit.SessionStorage.get("microplanData");
    setMicroplanData(data);
    if (data && data.currentPage) setCurrentPage(data.currentPage);
  }, []);

  // Function to navigate to the next step
  const nextStep = useCallback(() => {
    if (currentPage?.id + 1 > timeLineOptions.length - 1) return;
    setCurrentPage((previous) => timeLineOptions[previous?.id + 1]);
    setMicroplanData((previous) => ({ ...previous, currentPage }));
  }, [currentPage]);

  // Function to navigate to the previous step
  const previousStep = useCallback(() => {
    setCurrentPage((previous) => timeLineOptions[previous?.id - 1]);
  }, []);

  // Function to handle step click and navigate to the selected step
  const onStepClick = useCallback((index) => {
    const newCurrentPage = timeLineOptions.find((item) => item.id === index);
    setCurrentPage(newCurrentPage);
    setMicroplanData((previous) => ({ ...previous, currentPage:newCurrentPage }));
  });

  return (
    <div className="create-microplan">
      {/* Stepper component */}
      <Stepper
        type="stepper"
        currentStep={currentPage?.id + 1}
        customSteps={timeLineOptions.map((item) => t(item.name))}
        direction="horizontal"
        // onStepClick={() => {
        //   setCheckDataCompletion("true");
        //   setNavigationEvent("step");
        // }}
        onStepClick={onStepClick}
      />

      {/* Load custom component based on current page */}
      <LoadCustomComponent
        component={components[currentPage?.component]}
        secondaryProps={{ microplanData, setMicroplanData, checkDataCompletion, setCheckDataCompletion }}
      />

      {/* Action bar */}
      <ActionBar className={`${currentPage?.id === 0 ? "custom-action-bar-no-first-button" : "custom-action-bar"}`}>
        {/* Previous button */}
        {currentPage?.id > 0 && (
          <Button
            type="button"
            label={t("PREVIOUS")}
            onButtonClick={previousStep}
            isSuffix={false}
            variation={"secondary"}
            icon={<ArrowBack className={"icon"} width={"1.5rem"} height={"1.5rem"} fill={"rgba(244, 119, 56, 1)"} />}
          />
        )}
        {/* Next/Submit button */}
        <Button
          type="button"
          className="custom-button"
          label={currentPage?.id < timeLineOptions.length - 1 ? t("NEXT") : t("SUBMIT")}
          onButtonClick={() => {
            setCheckDataCompletion("true");
            setNavigationEvent("next");
          }}
          isSuffix={true}
          variation={"primary"}
          textStyles={{ padding: 0, margin: 0 }}
          // icon={"ArrowForward"}
        >
          <ArrowForward className={"icon"} width={"1.5rem"} height={"1.5rem"} fill={"rgb(255,255,255)"} />
        </Button>
      </ActionBar>

      {/* Toast notification */}
      {toast && <Toast style={{ bottom: "5.5rem" }} label={toast.label} error={toast.error} onClose={() => setToast(undefined)} />}
    </div>
  );
};

// Component to load custom component based on current page
const LoadCustomComponent = (props) => {
  if (!props.component) return null;
  const secondaryProps = props.secondaryProps;
  return <props.component {...secondaryProps} />;
};

export default CreateMicroplan;
