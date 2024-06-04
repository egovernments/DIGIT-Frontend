import React, { useState } from "react";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";

const Timeline = ({
  label,
  subElements,
  variant,
  viewDetailsLabel,
  hideDetailsLabel,
  additionalElements,
  inline,
  individualElementStyles,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth <= 480
  );
  const onResize = () => {
    if (window.innerWidth <= 480) {
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

  // Define details button style
  const getDetailsButtonStyle = () => {
    return showDetails ? "details-btn details-btn-open" : "details-btn";
  };

  const hasAdditionalElements =
    additionalElements && additionalElements.length > 0;

  const defaultLabel =
    variant === "inprogress"
      ? "Inprogress"
      : variant === "upcoming"
      ? "Upcoming"
      : variant === "completed"
      ? "Completed"
      : "";

  return (
    <div className="digit-timeline-item">
      <div className={`timeline-circle ${variant}`}>
        {variant === "completed" && (
          <div className="check-icon">
            <SVG.Check
              width={isMobileView ? "18px" : "24px"}
              height={isMobileView ? "18px" : "24px"}
              fill="#ffffff"
            />
          </div>
        )}
      </div>
      <div className="timeline-content">
        <div className="timeline-info">
          <div className="timeline-label">
            {label
              ? StringManipulator("CAPITALIZEFIRSTLETTER", label)
              : defaultLabel}
          </div>
          {subElements && subElements.length > 0 ? (
            <div className="timeline-subelements">
              {subElements.map((element, index) => (
                <div className="timeline-date" key={index}>
                  {element}
                </div>
              ))}
            </div>
          ) : (
            <div className="timeline-date">{"date"}</div>
          )}
          <div className="timeline-divider"></div>
        </div>
        {hasAdditionalElements && showDetails && (
          <div
            className={
              inline
                ? "timeline-additional-elements-inline"
                : "timeline-additional-elements-column"
            }
          >
            {additionalElements.map((element, index) => (
              <div
                className="timeline-individual-element"
                key={index}
                style={individualElementStyles}
              >
                {element}
              </div>
            ))}
          </div>
        )}
        {hasAdditionalElements && (
          <div className="timeline-toggle-details" onClick={toggleDetails} >
            <button className={getDetailsButtonStyle()}>
              {showDetails
                ? hideDetailsLabel
                  ? StringManipulator("CAPITALIZEFIRSTLETTER", hideDetailsLabel)
                  : "Hide Details"
                : viewDetailsLabel
                ? StringManipulator("CAPITALIZEFIRSTLETTER", viewDetailsLabel)
                : "View Details"}
            </button>
            {showDetails ? (
              <SVG.ArrowDropUp
                width="24px"
                height="24px"
                fill="#C84C0E"
              ></SVG.ArrowDropUp>
            ) : (
              <SVG.ArrowDropDown
                width="24px"
                height="24px"
                fill="#C84C0E"
              ></SVG.ArrowDropDown>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
