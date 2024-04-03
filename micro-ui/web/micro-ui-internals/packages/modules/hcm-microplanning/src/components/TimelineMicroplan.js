import React from "react";
import { useTranslation } from "react-i18next";
import { TickMark } from "@egovernments/digit-ui-react-components";
import { timeLineOptions } from "../configs/timeLineOptions.json";

let actions = timeLineOptions;
const TimelineMicroplan = ({ currentStep = 0, onStepClick }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  return (
    <div className="timeline-container" style={isMobile ? {} : { margin: "0 8px 15px" }}>
      {actions.map((data) => (
        <div className="timeline-checkpoint" style={{ cursor: "pointer" }} key={data?.id} onClick={() => onStepClick(data?.id)}>
          <div className="timeline-content">
            <span className={`circle ${data?.id <= currentStep && "active"}`}>{data?.id < currentStep ? <TickMark /> : data?.id + 1}</span>
            <span className="secondary-color">{t(data?.name)}</span>
          </div>
          {data?.id < actions.length - 1 && <span className={`line ${data?.id < currentStep && "active"}`}></span>}
        </div>
      ))}
    </div>
  );
};

export default TimelineMicroplan;
