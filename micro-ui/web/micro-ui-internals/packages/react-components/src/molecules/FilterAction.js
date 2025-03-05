import React from "react";
import { FilterSvg,FilterIcon,SortSvg } from "../atoms/svgindex";
import RoundedLabel from "../atoms/RoundedLabel";
import { COLOR_FILL } from "../atoms/contants";

const FilterAction = ({ text, handleActionClick, ...props }) => (
  <div className="searchAction" onClick={handleActionClick}>
    <RoundedLabel count={props.filterCount}></RoundedLabel>
    <SortSvg fill={COLOR_FILL}/> <span className="searchText">{text}</span>
  </div>
);

export default FilterAction;
