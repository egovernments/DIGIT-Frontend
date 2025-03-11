import React from "react";
import { CustomSVG } from "../atoms/CustomSVG";
import { RoundedLabel } from "../atoms";

const FilterAction = ({ text, handleActionClick, ...props }) => (
  <div className="digit-search-action" onClick={handleActionClick}>
    <RoundedLabel count={props.filterCount}></RoundedLabel>
    <CustomSVG.FilterSvg /> <span className="digit-search-text">{text}</span>
  </div>
);

export default FilterAction;