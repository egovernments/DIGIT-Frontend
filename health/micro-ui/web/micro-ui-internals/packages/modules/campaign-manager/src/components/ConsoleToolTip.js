import React, { Fragment, useRef, useState } from "react";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";
import ReactDOM from "react-dom";
// import { TooltipWrapper } from "@egovernments/digit-ui-components";

const Tooltip = ({ content, position }) => {
  if (!position) return null;

  const style = {
    position: "fixed",
    top: position.top + 8, // 8px below icon
    right: "1rem",
    width: "20rem",
    maxWidth: 300,
    backgroundColor: "#333",
    color: "white",
    padding: "8px 12px",
    borderRadius: 4,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    pointerEvents: "none",
    fontSize: 14,
    whiteSpace: "normal",
    zIndex: 9999999,
  };

  return ReactDOM.createPortal(
    <div className="tooltip-content with-arrow dark" style={style}>
      {content}
    </div>,
    document.body
  );
};

const ConsoleTooltip = ({ className = "", toolTipContent, placement = "right-end", iconFill = "#787878" }) => {
  const [tooltipPos, setTooltipPos] = useState(null);
  const iconRef = useRef(null);

  const showTooltip = () => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    setTooltipPos({ top: rect.bottom, left: rect.left });
  };

  const hideTooltip = () => {
    setTooltipPos(null);
  };

  return (
    <div className="app-config-drawer-subheader">
      <span
        ref={iconRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ cursor: "pointer", display: "inline-block", marginLeft: 8 }}
        className={`icon-wrapper ${className}`}
      >
        <InfoOutline fill={iconFill} width={"20px"} height={"20px"} />
      </span>

      {/* Tooltip Portal */}
      <Tooltip content={toolTipContent} position={tooltipPos} />
    </div>
  );
  // return (
  //   <span className={`icon-wrapper ${className ? className : ""}`}>
  //     <TooltipWrapper content={toolTipContent} placement={placement} children={<InfoOutline fill={iconFill} width={"20px"} height={"20px"} />} />
  //   </span>
  // );
};

export default ConsoleTooltip;
