import React,{useState,useEffect,useRef} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import { Colors} from "../constants/colors/colorconstants";
import Divider from "./Divider";

const Stepper = ({
  currentStep = 1,
  onStepClick,
  totalSteps,
  customSteps,
  direction,
  style,
  props,
  className,
  activeSteps,
  hideDivider
}) => {
  const { t } = useTranslation();
  const stepRefs = useRef([]);

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
    // Scroll the current step into view when currentStep changes
    if (stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currentStep]);

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
    >
      {actions.map((action, index, arr) => (
        <div
          ref={(el) => (stepRefs.current[index] = el)}
          className={`digit-stepper-checkpoint ${direction ? direction : ""}`}
          style={{ cursor: "pointer" }}
          key={index}
          onClick={() => {
            currentStep = index;
            onStepClick(index);
          }}
        >
          <div
            className={`digit-stepper-content ${direction ? direction : ""}`}
          >
            <span
              className={`stepper-circle ${
                ((index <= currentStep - 1) || (index < activeSteps) ) && "active"
              }`}
            >
              {((index < currentStep - 1) || (index < activeSteps) ) ? (
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
                ((index < currentStep - 1) || (index < activeSteps)) && "completed"
              } ${currentStep - 1 === index && "current"} ${direction ? direction : ""}`}
              style={{ ...props?.labelStyles }}
            >
              {t(
                StringManipulator("TRUNCATESTRING", action, { maxLength: 64 })
              )}
            </span>
          </div>
          {index < arr.length - 1 && (
            <span
              className={`stepper-connect ${
                ((index < currentStep - 1) || (index < activeSteps && index < activeSteps - 1 ) ) && "active"
              } ${direction ? direction : ""} ${(index === arr.length-2 && direction !=="vertical") ? "lastbutone" : ""}`}
            ></span>
          )}
          {index < arr.length - 1 && direction === "vertical" && !hideDivider &&  (
            <Divider className="stepper-vertical-divider"></Divider>
          )}
        </div>
      ))}
    </div>
  );
};
export default Stepper;
