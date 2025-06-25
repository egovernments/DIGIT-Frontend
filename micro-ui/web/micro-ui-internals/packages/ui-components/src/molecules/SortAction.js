import React from "react";
import { Button } from "../atoms";

const SortAction = ({ text, handleActionClick }) => (
  <Button
    variation="secondary"
    label={text}
    type="button"
    icon="ImportExport"
    size={"small"}
    onClick={handleActionClick}
  />
);

export default SortAction;