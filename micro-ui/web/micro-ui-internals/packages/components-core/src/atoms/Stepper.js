import React from "react";
import { useTranslation } from "react-i18next";
import { SVG } from "./SVG";

const Stepper = ({ currentStep = 1, onStepClick, totalSteps , customSteps, direction}) => {
  const { t } = useTranslation();
    const truncateStepLabel = (stepLabel,maxLength) => {
      if (stepLabel.length > maxLength) {
        return stepLabel.slice(0, maxLength) + " ...";
      }
      return stepLabel;
    };

  const getAction = (totalSteps, customSteps) => {
    if (customSteps && Object.keys(customSteps).length !== 0) {
      return Object.values(customSteps);
    }
    return Array.from({ length: totalSteps }, (_, index) => `Step ${index + 1}`);
  };
  const actions = getAction(totalSteps,customSteps);
  return (
    <div className={`digit-stepper-container ${direction ? direction : ""}`}>
      {actions.map((action, index, arr) => (
        <div className={`digit-stepper-checkpoint ${direction ? direction : ""}`} style={{ cursor: "pointer" }} key={index} onClick={() => {currentStep = index; onStepClick(index)}}>
          <div className={`digit-stepper-content ${direction ? direction : ""}`}>
            <span className={`circle ${index <= currentStep - 1 && "active"}`}>
              {index < currentStep - 1 ? <SVG.Check fill="#ffffff" width="24px" height="24px" /> : index + 1}
            </span>
            <span className={`secondary-color ${index <= currentStep - 1 && "text-done"} ${currentStep - 1 === index && "text-active"}`}>
              {t(truncateStepLabel(action,64))}
            </span>
          </div>
          {index < arr.length - 1 && <span className={`line ${index < currentStep - 1 && "active"} ${direction ? direction : ""}`}></span>}
        </div>
      ))}
    </div>
  );
};
export default Stepper;
