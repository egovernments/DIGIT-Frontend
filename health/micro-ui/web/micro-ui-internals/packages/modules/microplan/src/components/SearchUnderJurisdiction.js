import { LabelFieldPair, CardLabel, SubmitBar, LinkLabel } from "@egovernments/digit-ui-components";
import React, { useEffect, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";

import { boundaries } from "./boundaries";

const jurisdictions = {
  boundaryType: "Province",
  boundaryCodes: [
    // "MICROPLAN_MO_05_SINOE",
    // "MICROPLAN_MO_04_GBARPOLU",
    // "MICROPLAN_MO_04_GBARPOLU",
    // "MICROPLAN_MO_03_GRAND_GEDEH",
    // "MICROPLAN_MO_05_SINOE",
    // "MICROPLAN_MO_02_GRAND_KRU",
    // "MICROPLAN_MO_01_MARYLAND",
    // "MICROPLAN_MO_06_SINOE",
    // "MICROPLAN_MO_05_GBARPOLU",
    // "MICROPLAN_MO_04_GRAND_GEDEH",
    // "MICROPLAN_MO_03_GRAND_KRU",
    "MICROPLAN_MO_02_MARYLAND",
    "MICROPLAN_MO_05_SINOE",
  ],
};

const parentOptions = [
  {
    code: "MICROPLAN_MO_02_MARYLAND",
    name: "MICROPLAN_MO_02_MARYLAND",
    type: "Province",
  },
  {
    code: "MICROPLAN_MO_05_SINOE",
    name: "MICROPLAN_MO_05_SINOE",
    type: "Province",
  },
];

const optionsObj = {
  name: "",
  code: "",
  options: [],
};

const SearchUnderJurisdiction = () => {
  const {
    state: { hierarchyType, boundaryHierarchy },
    dispatch,
  } = useMyContext();
  const selectedBoundaries = boundaries();
  //selected data
  const filteredBoundariesByJurisdiction = Digit.Utils.microplanv1.filterBoundariesByJurisdiction(selectedBoundaries, jurisdictions.boundaryCodes);
  //this can be boundaryOptions
  const filteredHierarchialBoundariesByJurisdiction = Digit.Utils.microplanv1.createBoundaryDataByHierarchy(filteredBoundariesByJurisdiction);
  //construct boundary options with filteredBoundariesByJurisdiction and use it to show dropdown values,we'll load all the options at once only since we have all the data

  const { t } = useTranslation();
  //hierarchy dropdowns for this jurisdiction
  const [hierarchy, setHierarchy] = useState(Digit.Utils.microplanv1.getFilteredHierarchy(boundaryHierarchy, jurisdictions.boundaryType,hierarchyType));

  const [boundaryOptions, setBoundaryOptions] = useState(filteredHierarchialBoundariesByJurisdiction);
  const [selectedData,setSelectedData] = useState([])
  const MultiSelectDropdown = Digit?.ComponentRegistryService?.getComponent("MultiSelectDropdownBoundary");

  const handleBoundaryChange = (boundary,hierarchy) => {
    
    if(!boundary || boundary.length === 0){
      return
    }
    const selection = boundary?.[0]?.[1]
 
    
  }

  if (hierarchy.length === 0) {
    return <></>;
  }

  return (
    <div className={"search-wrapper"}>
      <div className={`search-field-wrapper search custom-both-clear-search`}>
        {hierarchy.map((boundary, idx) => {
          if (idx === 0) {
            return (
              <LabelFieldPair style={{ flexDirection: "column", gap: "0rem" }}>
                <CardLabel>{t(Digit.Utils.locale.getTransformedLocale(`${hierarchyType}_${boundary.boundaryType}`))}</CardLabel>
                <div>
                  <MultiSelectDropdown
                    t={t}
                    props={{ className: "selecting-boundaries-dropdown" }}
                    options={parentOptions}
                    onSelect={(value) => {handleBoundaryChange(value,boundary)}}
                    selected={parentOptions}
                    optionsKey={"name"}
                    hierarchyType={hierarchyType}
                    // config={{
                    //   isDropdownWithChip: true,
                    //   chipKey: "name",
                    // }}
                    // frozenData={frozenData}
                  />
                </div>
              </LabelFieldPair>
            );
          }
          return (
            <LabelFieldPair style={{ flexDirection: "column", gap: "0rem" }}>
              <CardLabel>{t(Digit.Utils.locale.getTransformedLocale(`${hierarchyType}_${boundary.boundaryType}`))}</CardLabel>
              <div>
                <MultiSelectDropdown
                  t={t}
                  //options={filteredHierarchialBoundariesByJurisdiction}
                  // options={Object.entries(filteredHierarchialBoundariesByJurisdiction)
                  //   .filter(([key]) => key.startsWith(item.boundaryType))
                  //   .flatMap(
                  //     ([key, value]) =>
                  //       Object.entries(value || {}).map(([subkey, item]) => ({
                  //         code: subkey,
                  //         name: subkey,
                  //         type: item.boundaryType,
                  //         parent: item.parent,
                  //       })) || []
                  //   )}
                  options={Object.entries(boundaryOptions)
                    .filter(([key]) => key.startsWith(boundary.boundaryType))
                    .flatMap(([key, value]) =>
                      Object.entries(value || {})
                        .filter(([subkey, item]) => {
                          const itemCode = item?.split(".")?.[0];
                          const frozenData = []
                          if (frozenData?.length > 0) {
                            const isFrozen = frozenData.some((frozenOption) => {
                              return (
                                frozenOption.code === subkey && frozenOption.type === boundary.boundaryType
                                // frozenOption.code === ${t(itemCode)}.${t(subkey)} &&
                                // frozenOption.boundaryType === boundary.boundaryType
                              );
                            });
                            return frozenType === "filter" ? !isFrozen : true; // Filter or include based on frozenType
                          }

                          // If frozenData is not present, just return true
                          return true;
                        })
                        .map(([subkey, item]) => ({
                          code: item?.split(".")?.[0],
                          name: item?.split(".")?.[0],
                          options:
                            [
                              {
                                code: subkey,
                                name: subkey,
                                type: boundary.boundaryType,
                                parent: `${item?.split(".")?.[0]}`,
                              },
                            ] || [],
                        }))
                    )}
                  onSelect={() => {}}
                  selected={[]}
                  optionsKey={"name"}
                  hierarchyType={hierarchyType}
                  // config={{
                  //   isDropdownWithChip: true,
                  //   chipKey: "name",
                  // }}
                  addCategorySelectAllCheck={true}
                  addSelectAllCheck={true}
                  variant="nestedmultiselect"
                />
              </div>
            </LabelFieldPair>
          );
        })}
        <div className={`search-button-wrapper`} style={{}}>
          <LinkLabel style={{ marginBottom: 0, whiteSpace: "nowrap" }} onClick={() => {}}>
            {t("CLEAR")}
          </LinkLabel>
          <SubmitBar label={t("SEARCH")} onSubmit={(e) => {}} />
        </div>
      </div>
    </div>
  );
};

export default SearchUnderJurisdiction;
