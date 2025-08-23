import React from "react";
import { Button } from "../atoms";

const FilterAction = ({ text, handleActionClick, ...props }) => (
  <Button
    variation="secondary"
    label={text}
    type="button"
    icon="FilterListAlt"
    size={"small"}
    onClick={handleActionClick}
  />
);

export default FilterAction;