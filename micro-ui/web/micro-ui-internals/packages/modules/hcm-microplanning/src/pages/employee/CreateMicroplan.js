import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import TimelineMicroplan from "../../components/TimelineMicroplan";
import { timeLineOptions } from "../../configs/timeLineOptions.json";
import Upload from "./Upload";
import Hypothesis from "./Hypothesis";
import RuleEngine from "./RuleEngine";

export const components = {
  Upload,
  Hypothesis,
  RuleEngine,
};

const CreateMicroplan = () => {
  const [currentPage, setCurrentPage] = useState();
  useEffect(() => {
    if (!timeLineOptions || timeLineOptions.length === 0) return;
    setCurrentPage(timeLineOptions[0]);
  }, [timeLineOptions]);

  const nextStep = useCallback(() => {
    setCurrentPage((previous) => timeLineOptions[previous?.id + 1]);
  }, []);

  const previousStep = useCallback(() => {
    setCurrentPage((previous) => timeLineOptions[previous?.id - 1]);
  }, []);

  return (
    <div>
      <TimelineMicroplan currentStep={currentPage?.id} onStepClick={() => ""} />
      <LoadCustomComponent component={components[currentPage?.component]} />
      <FormComposerV2
        onSubmit={nextStep}
        actionClassName={"next-previous-bar"}
        showMultipleCardsWithoutNavs={true}
        showSecondaryLabel={currentPage?.id > 0 ? true : false}
        secondaryLabel={"PREVIOUS"}
        onSecondayActionClick={previousStep}
        label={currentPage?.id < timeLineOptions.length - 1 ? "NEXT" : "SUBMIT"}
      />
    </div>
  );
};
const LoadCustomComponent = (props) => {
  if (!props.component) return null;
  return <props.component />;
};

export default CreateMicroplan;
