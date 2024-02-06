import React from "react";
import { FilterSvg } from "../../../react-components/src/atoms/svgindex";
import RoundedLabel from "../../../react-components/src/atoms/RoundedLabel";

const FilterAction = ({ text, handleActionClick, ...props }) => (
  <div className="digit-search-action" onClick={handleActionClick}>
    <RoundedLabel count={props.filterCount}></RoundedLabel>
    <FilterSvg /> <span className="digit-search-text">{text}</span>
  </div>
);

export default FilterAction;