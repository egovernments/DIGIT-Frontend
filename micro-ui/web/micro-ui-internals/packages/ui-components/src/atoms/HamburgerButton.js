import React from "react";
import { CustomSVG } from "./CustomSVG";

const HamburgerButton = ({ handleClick, color ,className}) => (
  <div className={`digit-hamburger-span ${className || ""}`} onClick={handleClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label="Toggle menu"
  >
    <CustomSVG.HamburgerIcon className="digit-hamburger" color={color} />
  </div>
);

export default HamburgerButton;
