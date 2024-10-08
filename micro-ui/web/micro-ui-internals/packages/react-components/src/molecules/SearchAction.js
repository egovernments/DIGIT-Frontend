import React from "react";
import { SearchIconSvg,FilterSvg,FilterIcon } from "../atoms/svgindex";

const SearchAction = ({ text, handleActionClick }) => (
  <div className="searchAction" onClick={handleActionClick}>
    <FilterIcon fill={"#c84c0e"}/> <span className="searchText">{text}</span>
  </div>
);

export default SearchAction;
