import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";

const SearchBar = ({ field, t }) => (
  <div className="search-bar-template">
    <FieldV1
      onChange={() => {}}
      placeholder={t(field?.label) || "Search..."}
      type="search"
      value={field?.value || ""}
      populators={{
        fieldPairClassName: "app-preview-field-pair",
      }}
      withoutLabel={true}
    />
  </div>
);

export default SearchBar;
