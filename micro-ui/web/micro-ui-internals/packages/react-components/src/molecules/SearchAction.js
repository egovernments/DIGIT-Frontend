import React from "react";
import { SearchIconSvg,FilterSvg,FilterIcon } from "../atoms/svgindex";
import { COLOR_FILL } from "../atoms/contants";

const SearchAction = ({ text, handleActionClick }) => (
  <div className="searchAction" onClick={handleActionClick}>
    <FilterIcon fill={COLOR_FILL}/> <span className="searchText">{text}</span>
  </div>
);

export default SearchAction;
