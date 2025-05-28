import React from "react";
import { HamburgerIcon } from "./svgindex";

const Hamburger = ({ handleClick, color ,className}) => (
  <div className={`digit-hamburger-span ${className || ""}`} onClick={handleClick}  onClick={handleClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label="Menu">
    <HamburgerIcon className="digit-hamburger" color={color} />
  </div>
);

export default Hamburger;
