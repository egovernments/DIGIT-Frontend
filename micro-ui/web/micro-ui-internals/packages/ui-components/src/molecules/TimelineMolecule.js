import React, { Children, useState, useMemo } from "react";
import { Timeline, Button, StringManipulator } from "../atoms";

const sortTimelines = (children) => {
  const variantsOrder = {
    upcoming: 1,
    inprogress: 2,
    completed: 3,
  };

  return Children.toArray(children).sort((a, b) => {
    const variantA = variantsOrder[a.props.variant] || 4;
    const variantB = variantsOrder[b.props.variant] || 4;
    return variantA - variantB;
  });
};

const TimelineMolecule = ({
  children,
  initialVisibleCount,
  viewLessLabelForFuture,
  viewMoreLabelForFuture,
  viewLessLabelForPast,
  viewMoreLabelForPast,
  pastIcon,
  FutureIcon,
  hideFutureLabel,
  hidePastLabel
}) => {
  const sortedChildren = useMemo(() => sortTimelines(children), [children]);

  const [isPastExpanded, setIsPastExpanded] = useState(false);
  const [isFutureExpanded, setIsFutureExpanded] = useState(false);  
  let currentActiveStep = -1;
  let totalPastSteps = 0;
  let totalFutureSteps = 0;

  sortedChildren.forEach((child, index) => {
    if (child.props.variant === "inprogress") {
      currentActiveStep = index;
    }
    if (child.props.variant === "completed") {
      totalPastSteps = totalPastSteps +1 ;
    }
    if (child.props.variant === "upcoming") {
      totalFutureSteps = totalFutureSteps +1 ;
    }
  });

  let nextActiveStep = -1;
  let nextStep;
  sortedChildren.forEach((child, index) => {
    if (child.props.variant === "upcoming" && index+1 === currentActiveStep) {
      nextActiveStep = index;
      nextStep = child;
    }
  });

  const toggleViewMoreFutureItems = () => {
    setIsFutureExpanded(!isFutureExpanded);
  };

  const toggleViewMorePastItems = () => {
    setIsPastExpanded(!isPastExpanded);
  };

  let visibleChildren = sortedChildren;

  if (initialVisibleCount) {
    visibleChildren = [];

    if (currentActiveStep !== -1) {
      visibleChildren.push(sortedChildren[currentActiveStep]); 
      if (currentActiveStep > 0) {
        visibleChildren.unshift(sortedChildren[currentActiveStep - 1]);
      }
    }

    const remainingPastCount = Math.max(0, initialVisibleCount - visibleChildren.length);
    const pastSteps = sortedChildren.slice(currentActiveStep + 1);
    visibleChildren.push(...pastSteps.slice(0, remainingPastCount));
  }

  if (isFutureExpanded) {
    visibleChildren.unshift(...sortedChildren.slice(0, currentActiveStep - 1));
  }


  if (isPastExpanded) {
    const pastStepsToAdd = sortedChildren.slice(currentActiveStep + 1);
    visibleChildren.push(...pastStepsToAdd.filter((step) => !visibleChildren.includes(step)));
  }
  

  const 
  hasFutureSteps = currentActiveStep > 0;

  return (
    <div className="digit-timeline-molecule">
      {initialVisibleCount  && hasFutureSteps && !hideFutureLabel && (
        <div className="view-more-future-container">
          <Button
            isSuffix={true}
            icon={FutureIcon || (isFutureExpanded ? "ArrowDropDown" : "ArrowDropUp")}
            variation={"link"}
            onClick={toggleViewMoreFutureItems}
            label={
              isFutureExpanded
                ? StringManipulator(
                    "CAPITALIZEFIRSTLETTER",
                    viewLessLabelForFuture
                  ) || "View Less Future Steps"
                : StringManipulator(
                    "CAPITALIZEFIRSTLETTER",
                    viewMoreLabelForFuture
                  ) || "View More Future Steps"
            }
            size={"medium"}
          />
        </div>
      )}
      {Children.map(visibleChildren, (child, index) => (
        <Timeline
          {...child.props}
          isLastStep={index === Children.count(visibleChildren) - 1}
          isNextActiveStep={nextStep === child}
        />
      ))}
      {initialVisibleCount && !hidePastLabel && (
        <div className="view-more-past-container">
          <Button
            isSuffix={true}
            icon={pastIcon ||  (isPastExpanded ? "ArrowDropUp" : "ArrowDropDown")}
            variation={"link"}
            onClick={toggleViewMorePastItems}
            label={
              isPastExpanded
                ? StringManipulator(
                    "CAPITALIZEFIRSTLETTER",
                    viewLessLabelForPast
                  ) || "View Less Past Steps"
                : StringManipulator(
                    "CAPITALIZEFIRSTLETTER",
                    viewMoreLabelForPast
                  ) || "View More Past Steps"
            }
            size={"medium"}
          ></Button>
        </div>
      )}
    </div>
  );
};

export default TimelineMolecule;
