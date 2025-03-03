import React from "react";
import { HamburgerIcon } from "./svgindex";

const Hamburger = ({ handleClick, color ,className}) => (
  <div className={`digit-hamburger-span ${className || ""}`} onClick={handleClick}>
    <HamburgerIcon className="digit-hamburger" color={color} />
  </div>
);

export default Hamburger;
