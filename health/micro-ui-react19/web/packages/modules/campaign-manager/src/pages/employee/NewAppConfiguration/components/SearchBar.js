import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";
const SearchBar = ({ field, t }) => (
    <FieldV1
      onChange={() => {}}
      placeholder={t(field?.label) || "Search..."}
      type="search"
      value={field?.value || ""}
      style={{ width: "100%", boxSizing: "border-box", padding: "0px" }}
      populators={{
        fieldPairClassName: "app-preview-field-pair",
      }}
    />
);

export default SearchBar;
