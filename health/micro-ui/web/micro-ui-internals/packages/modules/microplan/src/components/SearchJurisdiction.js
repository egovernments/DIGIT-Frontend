import { LabelFieldPair, CardLabel, SubmitBar, LinkLabel, InfoCard } from "@egovernments/digit-ui-components";
import React, { useEffect, Fragment, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { Dropdown, MultiSelectDropdown } from "@egovernments/digit-ui-components";

const SearchJurisdiction = ({ boundaries, jurisdiction, onSubmit = () => { }, onClear = () => { }, style = {},showInstruction=false,
defaultHierarchy = null,
  defaultBoundaries = [],
 }) => {
  const { t } = useTranslation();
  const {
    state: { hierarchyType, boundaryHierarchy },
    dispatch,
  } = useMyContext();

  //hierarchy dropdowns for this jurisdiction
  const hierarchy =  Digit.Utils.microplanv1.getFilteredHierarchy(boundaryHierarchy, jurisdiction.boundaryType, hierarchyType);
  const [boundaryOptions, setBoundaryOptions] = useState([]);

  const [selectedBoundaries, setSelectedBoundaries] = useState(defaultBoundaries);
  const [selectedHierarchy, setSelectedHierarchy] = useState(defaultHierarchy);
  const MultiSelectWrapper = Digit.ComponentRegistryService.getComponent("MultiSelectDropdownBoundary");

   // Ref to track if the component has mounted
   const isInitialLoad = useRef(true);

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
    // Reset selected boundaries only after the initial load
    if (!isInitialLoad.current) {
      setSelectedBoundaries([]);
    } else {
      isInitialLoad.current = false;
    }
    //based on the select hierarchy filter from userBoundaries and form options object
  }, [selectedHierarchy]);

  const handleBoundarySelect = (selectBoundariesEvent) => {
    if (!selectBoundariesEvent)
      return
    if (selectBoundariesEvent.length === 0) {
      setSelectedBoundaries([])
      return
    }

    //otherwise your event object would look like this [[a,b],[a,b]] bs' are the boundaries that we need
    const boundariesInEvent = selectBoundariesEvent?.map(event => {
      return event?.[1]
    })
    setSelectedBoundaries(boundariesInEvent)
  }

  return (
    <div className={"search-wrapper"} style={style}>
      {showInstruction && <p className="search-instruction-header">{t("HCM_MICROPLAN_SEARCH_JURISDICTION_INFO_DESCRIPTION")}</p>}
      <div className={`search-field-wrapper search custom-both-clear-search`}>
        <LabelFieldPair style={{ flexDirection: "column", gap: "0rem" }}>
          <CardLabel style={{ width: "100%" }}>{t("SELECT_HIERARCHY_LEVEL")}</CardLabel>
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
          <CardLabel style={{ width: "100%" }}>{t("SELECT_BOUNDARIES")}</CardLabel>
          <div style={{ width: "100%" }}>
            <MultiSelectWrapper
              props={{ className: "searchjurisdiction-multiselectdropdown" }}
              t={t}
              addCategorySelectAllCheck={true}
              addSelectAllCheck={true}
              variant="nestedmultiselect"
              options={boundaryOptions}
              selected={selectedBoundaries}
              onSelect={(e) => {
                // handleBoundarySelect(e)
              }}
              onClose={(e) => {
                handleBoundarySelect(e)
              }}
              isSearchable={true}
              optionsKey={"name"}
            />
          </div>
        </LabelFieldPair>
        <div className={`search-button-wrapper`} style={{}}>
          <LinkLabel
            style={{ marginBottom: 0, whiteSpace: "nowrap" }}
            onClick={() => {
              setSelectedBoundaries([]);
              setSelectedHierarchy(null);
              onClear();
            }}
          >
            {t("CLEAR")}
          </LinkLabel>
          <SubmitBar label={t("SEARCH")} onSubmit={() => onSubmit(selectedBoundaries, selectedHierarchy)} />
        </div>
      </div>
    </div>
  );
};

export default SearchJurisdiction;
