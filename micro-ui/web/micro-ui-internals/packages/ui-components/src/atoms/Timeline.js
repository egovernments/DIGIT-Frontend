import React, { useState } from "react";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import Button from "./Button";
import { Colors} from "../constants/colors/colorconstants";

const Timeline = ({
  label,
  subElements,
  variant,
  viewDetailsLabel,
  hideDetailsLabel,
  additionalElements,
  inline,
  individualElementStyles,
  showConnector,
  className,
  isLastStep,
  isNextActiveStep,
  showDefaultValueForDate,
  isError,
  initialVisibleAdditionalElementsCount = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth / window.innerHeight <= 9 / 16
  );
  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9 / 16) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    return () => {
      window.addEventListener("resize", () => {
        onResize();
      });
    };
  });

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const hasAdditionalElements =
    additionalElements && additionalElements.length > 0;

  const defaultLabel =

  isError ? "Failed!" :
    variant === "inprogress"
      ? "Inprogress"
      : variant === "upcoming"
      ? "Upcoming"
      : variant === "completed"
      ? "Completed"
      : "";

  const color = Colors.lightTheme.paper.primary;

  return (
    <div className={`digit-timeline-item ${className || ""} ${variant} ${isError ? "error" : ""}`}>
      <div className={`timeline-circle ${variant} ${isError ? "error" : ""}`}>
        {variant === "completed" && !isError &&  (
          <div className="check-icon">
            <SVG.Check
              width={isMobileView ? "18px" : "24px"}
              height={isMobileView ? "18px" : "24px"}
              fill={color}
            />
          </div>
        )}
                {isError &&  (
          <div className="check-icon">
            <SVG.Info
              width={isMobileView ? "18px" : "24px"}
              height={isMobileView ? "18px" : "24px"}
              fill={color}
              style={{ transform: "rotate(-180deg)" }}
            />
          </div>
        )}
      </div>
      {showConnector && !isLastStep && (
        <div
          className={`connector-line ${variant || ""} ${
            isNextActiveStep ? "nextActiveStep" : ""
          }`}
        />
      )}
      <div className={`timeline-content ${isLastStep ? "lastTimeline" : ""}`}>
        <div className="timeline-info">
          <div className={`timeline-label ${variant}`}>
            {label
              ? StringManipulator("CAPITALIZEFIRSTLETTER", label)
              : defaultLabel}
          </div>
          {subElements && subElements.length > 0 && (
            <div className="timeline-subelements">
              {subElements.map((element, index) => (
                <div className="timeline-date" key={index}>
                  {element}
                </div>
              ))}
            </div>
          )}
          {showDefaultValueForDate && (
            <div className="timeline-date">{isError ? "Incomplete": "date"}</div>
          )}
          <div className="timeline-divider"></div>
        </div>
        {hasAdditionalElements && (
          <div
            className={
              inline
                ? "timeline-additional-elements-inline"
                : "timeline-additional-elements-column"
            }
          >
            {additionalElements.map((element, index) => (
              <div
              className={`timeline-individual-element ${
                index >= initialVisibleAdditionalElementsCount && !showDetails
                  ? "hidden"
                  : ""
              }`}
                key={index}
                style={individualElementStyles}
              >
                {element}
              </div>
            ))}
          </div>
        )}
        {hasAdditionalElements && additionalElements.length > initialVisibleAdditionalElementsCount && (
          <div className="timeline-toggle-details" onClick={toggleDetails}>
            <Button
              label={
                showDetails
                  ? hideDetailsLabel
                    ? StringManipulator(
                        "CAPITALIZEFIRSTLETTER",
                        hideDetailsLabel
                      )
                    : "Hide Details"
                  : viewDetailsLabel
                  ? StringManipulator("CAPITALIZEFIRSTLETTER", viewDetailsLabel)
                  : "View Details"
              }
              variation={"link"}
              icon={showDetails ? "ArrowDropUp" : "ArrowDropDown"}
              size={"medium"}
              isSuffix={true}
              style={{ paddingLeft: "unset" }}
            ></Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
