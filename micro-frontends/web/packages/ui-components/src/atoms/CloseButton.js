import React from "react";
import {SVG} from "./SVG"

export const CloseButton = ({ onClick, size  = "24" }) => {
  return (
    <div className="icon-bg-secondary" onClick={onClick} style={{ backgroundColor: "#FFFFFF", borderRadius: "0.25rem" }}>
      <SVG.Close width={size} height={size} />
    </div>
  );
};

export default CloseButton;
