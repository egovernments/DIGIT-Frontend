import React from "react";
import { Button } from "../atoms";

const SearchAction = ({ text, handleActionClick }) => (
  <Button
    variation="secondary"
    label={text}
    type="button"
    icon="FilterListAlt"
    size={"small"}
    onClick={handleActionClick}
  />
);

export default SearchAction;