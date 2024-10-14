import { LabelFieldPair, CardLabel, SubmitBar, LinkLabel } from "@egovernments/digit-ui-components";
import React, { useEffect, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { Dropdown, MultiSelectDropdown } from "@egovernments/digit-ui-components";

const SearchJurisdiction = ({ boundaries, jurisdiction }) => {
  const { t } = useTranslation();
  const {
    state: { hierarchyType, boundaryHierarchy },
    dispatch,
  } = useMyContext();

  //hierarchy dropdowns for this jurisdiction
  const [hierarchy, setHierarchy] = useState(
    Digit.Utils.microplanv1.getFilteredHierarchy(boundaryHierarchy, jurisdiction.boundaryType, hierarchyType)
  );
  const [boundaryOptions, setBoundaryOptions] = useState([]);

  const [selectedBoundaries, setSelectedBoundaries] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);

  useEffect(() => {
    if (!selectedHierarchy) {
      setBoundaryOptions([]);
      return;
    }
    //fetching user's boundaries (under their jurisdiction)
    const userBoundaries = Digit.Utils.microplanv1.filterBoundariesByJurisdiction(boundaries, jurisdiction.boundaryCodes);
    const filteredBoundaries = userBoundaries.filter((row) => row.type === selectedHierarchy.boundaryType);
    const filteredBoundariesGroupedByParent = Digit.Utils.microplanv1.groupByParent(filteredBoundaries);
    setBoundaryOptions(filteredBoundariesGroupedByParent);
    //based on the select hierarchy filter from userBoundaries and form options object
  }, [selectedHierarchy]);

  return (
    <div className={"search-wrapper"}>
      <div className={`search-field-wrapper search custom-both-clear-search`}>
        <LabelFieldPair style={{ flexDirection: "column", gap: "0rem" }}>
          <CardLabel>{t("SELECT_HIERARCHY_LEVEL")}</CardLabel>
          <Dropdown
            t={t}
            option={hierarchy}
            optionKey={"i18nKey"}
            selected={selectedHierarchy}
            select={(value) => {
              setBoundaryOptions([]);
              setSelectedHierarchy(value);
            }}
          />
        </LabelFieldPair>
        <LabelFieldPair style={{ flexDirection: "column", gap: "0rem" }}>
          <CardLabel>{t("SELECT_BOUNDARIES")}</CardLabel>
          <MultiSelectDropdown
            variant={"nestedmultiselect"}
            selected={selectedBoundaries}
            onSelect={(e) => {
              //here update selected boundaries
              console.log(e);
            }}
            isSearchable={true}
            t={t}
            addCategorySelectAllCheck={true}
            addSelectAllCheck={true}
            options={boundaryOptions}
            optionsKey={"name"}
            name={"nestedmultiselectoptions"}
          />
        </LabelFieldPair>
        <div className={`search-button-wrapper`} style={{}}>
          <LinkLabel
            style={{ marginBottom: 0, whiteSpace: "nowrap" }}
            onClick={() => {
              setSelectedBoundaries([]);
              setSelectedHierarchy(null);
            }}
          >
            {t("CLEAR")}
          </LinkLabel>
          <SubmitBar label={t("SEARCH")} onSubmit={(e) => {}} />
        </div>
      </div>
    </div>
  );
};

export default SearchJurisdiction;
