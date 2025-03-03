import React from "react";
import { FilterSvg } from "../atoms/svgindex";
import { RoundedLabel } from "../atoms";

const FilterAction = ({ text, handleActionClick, ...props }) => (
  <div className="digit-search-action" onClick={handleActionClick}>
    <RoundedLabel count={props.filterCount}></RoundedLabel>
    <FilterSvg /> <span className="digit-search-text">{text}</span>
  </div>
);

export default FilterAction;