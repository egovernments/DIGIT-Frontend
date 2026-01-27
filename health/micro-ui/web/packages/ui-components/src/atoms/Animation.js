import React from "react";
import Lottie from "react-lottie";

const getAriaLabelFromAnimationData = (animationData) => {
  if (animationData && animationData?.nm) {
    if (animationData.nm === "ckeck") {
      return "Error animation";
    } else if (animationData.nm === "48 - Warning") {
      return "Warning animation";
    } else if (animationData.nm === "newScene") {
      return "Caution animation";
    }
    return `${animationData.nm} animation`;
  }
  return "Lottie animation";
};

const Animation = (props) => {
  const defaultOptions = {
    loop: props?.loop,
    autoplay: props?.autoplay,
    animationData: props?.animationData,
    renderer: "svg",
  };
  const inferredAriaLabel = getAriaLabelFromAnimationData(props?.animationData);

  return (
    <div className="digit-animation" aria-label={inferredAriaLabel}>
      <Lottie options={defaultOptions} height={props?.height} width={props?.width} />
    </div>
  );
};

export default Animation;
