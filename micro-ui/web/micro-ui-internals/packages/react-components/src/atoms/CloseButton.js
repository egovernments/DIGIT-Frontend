import React from "react";
import {SVG} from "./SVG"

export const CloseButton = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick} style={{ backgroundColor: "#FFFFFF", borderRadius: "0.25rem" }}>
      <SVG.Close width={props.side ? props.side : "24"} height={props.side ? props.side : "24"} />
    </div>
  );
};

export default CloseButton;
