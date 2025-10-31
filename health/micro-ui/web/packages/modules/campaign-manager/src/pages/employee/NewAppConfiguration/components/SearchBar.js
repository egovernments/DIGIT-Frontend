import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";
const SearchBar = ({ field, t }) => (
  <FieldV1
    onChange={() => {}}
    placeholder={t(field?.label) || "Search..."}
    type="search"
    value={field?.value || ""}
    populators={{
      fieldPairClassName: "app-preview-field-pair",
    }}
  />
);

export default SearchBar;
