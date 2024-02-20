import React from "react";
import { useTranslation } from "react-i18next";
import { SVG } from "./SVG";
let actions = [];
const getAction = (flow) => {
  switch (flow) {
    case "role1":
      actions = ["Role-Step 1", "Role-Step 2", "Role-Step 3", "Role-Step 4", "Role-Step 5"];
      break;
    default:
      actions = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];
  }
};
const Stepper = ({ currentStep = 1, flow = "", onStepClick }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  getAction(flow);
  return (
    <div className="digit-stepper-container" style={isMobile ? {} : { margin: "0 8px 15px" }}>
      {actions.map((action, index, arr) => (
        <div className="digit-stepper-checkpoint" style={{ cursor: "pointer" }} key={index} onClick={() => onStepClick(index)}>
          <div className="digit-stepper-content">
            <span className={`circle ${index <= currentStep - 1 && "active"}`}>{index < currentStep - 1 ? <SVG.Check fill="#ffffff" width="24px" height="24px"/> : index + 1}</span>
            <span className={`secondary-color ${index <= currentStep - 1 && "text-active"}`}>{t(action)}</span>
          </div>
          {index < arr.length - 1 && <span className={`line ${index < currentStep - 1 && "active"}`}></span>}
        </div>
      ))}
    </div>
  );
};
export default Stepper;
