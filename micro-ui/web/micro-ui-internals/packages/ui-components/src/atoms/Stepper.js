import React,{useState,useEffect} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import { Colors} from "../constants/colors/colorconstants";

const Stepper = ({
  currentStep = 1,
  onStepClick,
  totalSteps,
  customSteps,
  direction,
  style,
  props,
  className,
  activeSteps
}) => {
  const { t } = useTranslation();

  const [isMobileView, setIsMobileView] = useState(
    (window.innerWidth / window.innerHeight <= 9/16)
  );
  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9/16) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    return () => {
      window.addEventListener("resize", () => {
        onResize();
      });
    };
  });

  useEffect(() => {
    // This useEffect will trigger a re-render when number of activeSteps changes
  }, [activeSteps]);

  const Color = Colors.lightTheme.paper.primary;

  const getAction = (totalSteps, customSteps) => {
    if (customSteps && Object.keys(customSteps).length !== 0) {
      return Object.values(customSteps);
    }
    return Array.from(
      { length: totalSteps }, 
      (_, index) => `Step ${index + 1}`
    );
  };
  const actions = getAction(totalSteps, customSteps);

  return (
    <div
      className={`digit-stepper-container ${direction ? direction : ""} ${
        className ? className : ""
      }`}
      style={style ? style : null}
      role="list"
    >
      {actions.map((action, index, arr) => {
        const isCompleted = index < currentStep - 1 || index < activeSteps;
        const isCurrent = currentStep - 1 === index;
        const label = t(StringManipulator("TRUNCATESTRING", action, { maxLength: 64 }));

        return (
          <div
            key={index}
            className={`digit-stepper-checkpoint ${direction || ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => onStepClick(index)}
            role="listitem"
            tabIndex={0} 
            aria-label={`Step ${index + 1}: ${label}`}
            aria-current={isCurrent ? "step" : undefined} 
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStepClick(index);
              }
            }}
          >
            <div 
            className={`digit-stepper-content ${direction ? direction : ""}`}
            >
              <span 
              className={`stepper-circle ${isCompleted && "active"}`}>
                {isCompleted ? (
                  <SVG.Check
                    width={isMobileView ? "18px" : "24px"}
                    height={isMobileView ? "18px" : "24px"}
                    fill={Color}
                  />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={`stepper-label ${
                  isCompleted && "completed"
                } ${isCurrent && "current"} ${direction || ""}`}
                style={{ ...props?.labelStyles }}
              >
                {label}
              </span>
            </div>
            {index < arr.length - 1 && (
              <span
                className={`stepper-connect ${
                  (index < currentStep - 1 || (index < activeSteps - 1)) && "active"
                } ${direction ? direction : ""}`}
              ></span>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default Stepper;
