import React, { useState, useEffect, Fragment, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, CardLabel, CardText, Loader, PopUp, Button } from "@egovernments/digit-ui-components";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Dropdown } from "@egovernments/digit-ui-components";

// const frozenData = [
//   {
//     code: "mz",
//     name: "HEALTH_MO",
//     boundaryType: "Country",
//   },
//   {
//     code: "Mozambique.Nampula",
//     name: "HEALTH_MO_13_NAMPULA",
//     boundaryType: "Province",
//   },
//   {
//     code: "Mozambique.Cabo",
//     name: "HEALTH_MO_12_CABO",
//     boundaryType: "Province",
//   },
//   {
//     code: "Nampula.Mossurilee",
//     name: "HEALTH_MO_13_02_MOSSURILEE",
//     boundaryType: "District",
//   },
//   {
//     code: "Nampula.Murrupula",
//     name: "HEALTH_MO_13_01_MURRUPULA",
//     boundaryType: "District",
//   },
//   {
//     code: "Cabo.Cabo Delgado",
//     name: "HEALTH_MO_12_01_CABO DELGADO",
//     boundaryType: "District",
//   },
//   {
//     code: "Mossurilee.Chitima-01",
//     name: "HEALTH_MO_13_02_02_CHITIMA-01",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Mossurilee.Nsadzo",
//     name: "HEALTH_MO_13_02_01_NSADZO",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Nihessiue",
//     name: "HEALTH_MO_13_01_04_NIHESSIUE",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Chiteeima",
//     name: "HEALTH_MO_13_01_03_CHITEEIMA",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Chifunde-01",
//     name: "HEALTH_MO_13_01_02_CHIFUNDE-01",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Mualdzi",
//     name: "HEALTH_MO_13_01_01_MUALDZI",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Cabo Delgado.Pemba",
//     name: "HEALTH_MO_12_01_01_PEMBA",
//     boundaryType: "Post Administrative",
//   },
// ];

// const frozenType = "";
const Wrapper = ({
  hierarchyType,
  lowest,
  frozenData,
  frozenType,
  selectedData,
  onSelect,
  boundaryOptions,
  hierarchyData,
  isMultiSelect,
  restrictSelection,
}) => {
  return (
    <SelectingBoundaryComponent
      onSelect={onSelect}
      hierarchyType={hierarchyType}
      lowest={lowest}
      frozenData={frozenData}
      frozenType={frozenType}
      selectedData1={selectedData}
      boundaryOptionsPage={boundaryOptions}
      data={hierarchyData}
      isMultiSelect={isMultiSelect}
      restrictSelectionPage={restrictSelection}
    ></SelectingBoundaryComponent>
  );
};

const SelectingBoundaryComponent = ({
  onSelect,
  hierarchyType,
  lowest,
  frozenData,
  frozenType,
  selectedData1,
  boundaryOptionsPage,
  updateBoundary,
  data,
  isMultiSelect,
  restrictSelectionPage,
}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [boundaryOptions, setBoundaryOptions] = useState(boundaryOptionsPage);
  const [selectedData, setSelectedData] = useState(selectedData1);
  const [showPopUp, setShowPopUp] = useState(false);
  const timerRef = useRef(null);
  const [parentRoot, setParentRoot] = useState(selectedData?.find((item) => item?.isRoot === true)?.type || {});
  const [restrictSelection, setRestrictSelection] = useState(restrictSelectionPage);

  useEffect(() => {
    setBoundaryOptions(boundaryOptionsPage);
  }, [boundaryOptionsPage]);

  useEffect(() => {
    setSelectedData(selectedData1);
  }, [selectedData1]);

  useEffect(() => {
    setRestrictSelection(restrictSelectionPage);
  }, [restrictSelectionPage]);

  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: hierarchyType,
      },
    },
  };

  const { isLoading: hierarchyLoading, data: hierarchy } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  function processData(data, parentPath = "", lowestBoundaryType) {
    const result = {};

    const currentPath = parentPath ? `${data?.code}.${parentPath}` : data?.code;

    result[data?.boundaryType] = result[data?.boundaryType] || {};
    result[data?.boundaryType][data?.code] = parentPath || "mz";

    if (data?.boundaryType === lowestBoundaryType) {
      return result;
    }
    if (data?.children && data?.children.length > 0) {
      data?.children.forEach((child) => {
        const childResult = processData(child, currentPath, lowestBoundaryType);
        Object.keys(childResult).forEach((key) => {
          result[key] = {
            ...result[key],
            ...childResult[key],
          };
        });
      });
    }
    return result;
  }

  const boundaryData = processData(data?.[0], "", lowest);

  const updateBoundaryOptions = (selectedData1, boundaryData, hierarchy) => {
    selectedData1?.forEach((item) => {
      const { type, code } = item;
      const childBoundaryType = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy.find((boundary) => boundary.parentBoundaryType === type)
        ?.boundaryType;
      if (boundaryData[childBoundaryType]) {
        const filteredBoundaries = Object.entries(boundaryData[childBoundaryType])
          .filter(([key, value]) => value.includes(code))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});
        setBoundaryOptions((prevOptions) => ({
          ...prevOptions,
          [childBoundaryType]: {
            ...prevOptions[childBoundaryType],
            ...filteredBoundaries,
          },
        }));
      }
    });
  };

  useEffect(() => {
    setSelectedData(selectedData1);
    if (selectedData1?.find((item) => item?.isRoot === true)?.type) {
      setParentRoot(selectedData1?.find((item) => item?.isRoot === true)?.type);
    }
  }, [selectedData1]);

  const isBoundaryDataValid = useMemo(() => {
    return boundaryData && Object.keys(boundaryData).every((key) => key !== "undefined");
  }, [boundaryData]);

  useEffect(() => {
    if (isBoundaryDataValid && hierarchy && selectedData1?.length > 0 && boundaryOptions?.[parentRoot]) {
      updateBoundaryOptions(selectedData1, boundaryData, hierarchy);
    }
  }, [hierarchy, isBoundaryDataValid, boundaryOptions?.[parentRoot]]);

  function createHierarchyStructure(hierarchy) {
    const hierarchyStructure = {};

    // Find the parentRoot, where parentBoundaryType is null or undefined
    const parentRoot = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.find(
      (item) => item?.parentBoundaryType === null || item?.parentBoundaryType === undefined
    )?.boundaryType;

    setParentRoot(parentRoot);

    // Recursive function to gather all descendants for a given boundary type
    function gatherDescendants(boundaryType) {
      const descendants = [];

      // Find all children for the current boundary type
      const children = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.filter((item) => item?.parentBoundaryType === boundaryType);

      // Recursively gather descendants for each child
      children.forEach((child) => {
        const childBoundaryType = child?.boundaryType;
        const childDescendants = gatherDescendants(childBoundaryType);
        descendants.push(childBoundaryType, ...childDescendants);
      });

      return descendants;
    }

    // Iterate through the boundaryHierarchy array to populate hierarchyStructure
    hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.forEach((item) => {
      const boundaryType = item?.boundaryType;
      const descendants = gatherDescendants(boundaryType);

      hierarchyStructure[boundaryType] = descendants;
    });
    return hierarchyStructure;
  }

  useEffect(() => {
    if (boundaryData[parentRoot]) {
      if (!boundaryOptions?.[parentRoot]) {
        setBoundaryOptions((prevOptions) => ({
          ...prevOptions,
          [parentRoot]: boundaryData[parentRoot],
        }));
      }
    }
  }, [boundaryData, boundaryOptions, parentRoot]);

  function handleBoundaryChange(data, boundary) {
    if (restrictSelection) {
      setShowPopUp(true);
      return;
    }
    if (!data || data.length === 0) {
      const structure = createHierarchyStructure(hierarchy);
      const check = structure?.[boundary.boundaryType];

      if (check) {
        const typesToRemove = [boundary?.boundaryType, ...check];
        const updatedSelectedData = selectedData?.filter((item) => !typesToRemove?.includes(item?.type));
        const updatedBoundaryData = { ...boundaryOptions };
        typesToRemove.forEach((type) => {
          if (type !== boundary?.boundaryType && updatedBoundaryData?.hasOwnProperty(type)) {
            updatedBoundaryData[type] = {};
          }
        });
        if (!_.isEqual(selectedData, updatedSelectedData)) {
          setSelectedData(updatedSelectedData);
        }
        setBoundaryOptions(updatedBoundaryData);
      }
      return;
    }
    let res = isMultiSelect ? data?.map((ob) => ob?.[1]) || [] : [data];
    let transformedRes = [];

    if (isMultiSelect) {
      transformedRes = selectedData.filter((item) => item?.type === boundary?.boundaryType);
      const filteredData = selectedData.filter((item) => item?.type === boundary?.boundaryType);
      if (filteredData.length === 0 || filteredData.length !== res.length) {
        // If no selected data for the particular boundary type, run the transformation logic
        transformedRes = res?.map((item) => ({
          code: item.code,
          name: item.name,
          type: item.type || item.boundaryType,
          parent: item.parent,
          isRoot: item.type === parentRoot,
          includeAllChildren: item.type === lowest || item.boundaryType === lowest,
        }));
      } else {
        transformedRes = filteredData;
      }
      const newBoundaryType = transformedRes?.[0]?.type;
      const existingBoundaryType = selectedData?.length > 0 ? selectedData?.[0]?.type : null;

      if (existingBoundaryType === newBoundaryType) {
        const updatedSelectedData = selectedData
          .map((item) => {
            if (item.type === newBoundaryType) {
              return transformedRes.find((resItem) => resItem.code === item.code) || item;
            } else {
              return item;
            }
          })
          .filter(Boolean);

        if (!_.isEqual(selectedData, updatedSelectedData)) {
          setSelectedData(updatedSelectedData);
        }
      } else {
        // const mergedData = [...(selectedData || []).filter((item) => item?.type !== newBoundaryType), ...transformedRes];

        let mergedData = [];
        if (frozenData?.length > 0) {
          const mergedFrozenData = [...(selectedData || []).filter((item) => item?.type !== newBoundaryType), ...transformedRes];
          const frozenCodes = new Set(frozenData.map((item) => item.code));
          const mergedCodes = new Set(mergedFrozenData.map((item) => item.code));
          mergedData = [...mergedFrozenData, ...frozenData.filter((frozenItem) => !mergedCodes.has(frozenItem.code))];
        } else if (!frozenData || frozenData?.length === 0) {
          mergedData = [...(selectedData || []).filter((item) => item?.type !== newBoundaryType), ...transformedRes];
        }

        let updatedSelectedData = [];
        const addChildren = (item) => {
          updatedSelectedData.push(item);
          const children = mergedData.filter((child) => child.parent === item.code);
          children.forEach((child) => addChildren(child));
        };
        mergedData.filter((item) => item.parent === undefined).forEach((rootItem) => addChildren(rootItem));

        setSelectedData((prevSelectedData) => {
          if (!_.isEqual(prevSelectedData, updatedSelectedData)) {
            return updatedSelectedData;
          }
          return prevSelectedData;
        });
      }
    } else {
      transformedRes = res?.map((item) => ({
        code: item.code,
        name: item.name,
        type: item.type || item.boundaryType,
        parent: item.code.split(".")[0],
        isRoot: item.type === parentRoot,
        includeAllChildren: item.type === lowest || item.boundaryType === lowest,
      }));

      const structure = createHierarchyStructure(hierarchy);
      const check = structure?.[boundary.boundaryType];

      if (check) {
        const typesToRemove = [boundary?.boundaryType, ...check];
        let updatedSelectedData = selectedData?.filter((item) => !typesToRemove?.includes(item?.type));
        updatedSelectedData = [...updatedSelectedData, ...transformedRes];
        setSelectedData(updatedSelectedData);
      }
    }

    const updatedBoundaryOptions = { ...boundaryOptions };
    let newData = {};

    const childBoundaryType = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy.find((h) => h.parentBoundaryType === res?.[0]?.type)?.boundaryType;

    res.forEach((item) => {
      const { code, parent, boundaryType, name } = item;

      // If parentBoundaryType exists, update the corresponding boundaryOptions
      if (childBoundaryType) {
        // Initialize if not present
        if (!boundaryOptions[childBoundaryType]) {
          boundaryOptions[childBoundaryType] = {};
        }

        const newMapping = {};
        Object.keys(boundaryData[childBoundaryType] || {}).forEach((key) => {
          if (boundaryData[childBoundaryType][key].includes(code)) {
            newMapping[key] = boundaryData[childBoundaryType][key];
          }
        });

        newData = { ...newData, ...newMapping };
      }
    });
    updatedBoundaryOptions[childBoundaryType] = { ...newData };
    setBoundaryOptions(updatedBoundaryOptions);
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSelect({ selectedData: selectedData, boundaryOptions: boundaryOptions, restrictSelection: restrictSelection });
    }, 1);
  }, [selectedData, boundaryOptions, restrictSelection]);

  const checkDataPresent = ({ action }) => {
    if (action === false) {
      setShowPopUp(false);
      setRestrictSelection(false);
      return;
    }
    if (action === true) {
      setShowPopUp(false);
      setRestrictSelection(true);
      return;
    }
  };

  if (hierarchyLoading) return <Loader page={true} variant={"PageLoader"} />;

  return (
    <>
      <div className="selecting-boundary-div">
        {isMultiSelect
          ? hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy
              .filter((boundary, index, array) => {
                // Find the index of the lowest hierarchy
                const lowestIndex = array.findIndex((b) => b.boundaryType === lowest);
                // Include only those boundaries that are above or equal to the lowest hierarchy
                return index <= lowestIndex;
              })
              .map((boundary) => {
                const frozenCount = frozenData?.filter((frozenItem) => frozenItem?.type === boundary.boundaryType).length;

                // Find the count of boundaryType in boundaryOptions
                const optionsCount = Object.entries(boundaryOptions || {})
                  ?.filter(([key]) => key?.startsWith(boundary?.boundaryType))
                  ?.flatMap(([key, value]) => Object.entries(value || {}))?.length;

                // Disable dropdown if counts match
                const isDisabled = frozenCount === optionsCount;

                return boundary?.parentBoundaryType == null ? (
                  <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel className={"boundary-selection-label"}>
                      {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={
                          Object.entries(boundaryOptions || {})
                            ?.filter(([key]) => key.startsWith(boundary.boundaryType))
                            .flatMap(
                              ([key, value]) =>
                                Object.entries(value || {}).map(([subkey, item]) => ({
                                  code: subkey,
                                  name: subkey,
                                  type: boundary.boundaryType,
                                })) || []
                            ) || []
                        }
                        onSelect={(value) => {
                          // handleBoundaryChange(value, boundary);
                        }}
                        onClose={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType) || []}
                        optionsKey={"code"}
                        disabled={isDisabled}
                        hierarchyType={hierarchyType}
                        config={{
                          isDropdownWithChip: true,
                          chipKey: "code",
                        }}
                        frozenData={frozenData}
                        frozenType={frozenType}
                        isSearchable={true}
                      />
                    </div>
                  </LabelFieldPair>
                ) : (
                  <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel className={"boundary-selection-label"}>
                      {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={
                          Object.entries(boundaryOptions || {})
                            ?.filter(([key]) => key.startsWith(boundary.boundaryType))
                            ?.flatMap(([key, value]) =>
                              Object.entries(value || {})
                                .filter(([subkey, item]) => {
                                  const itemCode = item?.split(".")?.[0];
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
                            ) || []
                        }
                        onSelect={(value) => {
                          //handleBoundaryChange(value, boundary);
                        }}
                        onClose={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType) || []}
                        optionsKey={"code"}
                        disabled={isDisabled}
                        restrictSelection={restrictSelection}
                        config={{
                          isDropdownWithChip: true,
                          chipKey: "code",
                          numberOfChips: 4,
                        }}
                        hierarchyType={hierarchyType}
                        addCategorySelectAllCheck={true}
                        addSelectAllCheck={true}
                        variant="nestedmultiselect"
                        frozenData={frozenData}
                        frozenType={frozenType}
                        // frozenData={frozenType === "frozen" ? frozenData : []}
                        popUpOption={boundaryOptions}
                        isSearchable={true}
                      />
                    </div>
                  </LabelFieldPair>
                );
              })
          : hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy
              .filter((boundary, index, array) => {
                // Find the index of the lowest hierarchy
                const lowestIndex = array.findIndex((b) => b.boundaryType === lowest);
                // Include only those boundaries that are above or equal to the lowest hierarchy
                return index <= lowestIndex;
              })
              .map((boundary) => (
                <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                  <CardLabel className={"boundary-selection-label"}>
                    {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                    <span className="mandatory-span">*</span>
                  </CardLabel>
                  <Dropdown
                    t={t}
                    props={{ className: "selecting-boundaries-dropdown" }}
                    option={
                      Object.entries(boundaryOptions)
                        .filter(([key]) => key.startsWith(boundary.boundaryType))
                        .flatMap(
                          ([key, value]) =>
                            Object.entries(value || {}).map(([subkey, item]) => ({
                              code: item?.split(".")?.[0],
                              name: subkey,
                              type: boundary.boundaryType,
                            })) || []
                        ) || []
                    }
                    select={(value) => {
                      handleBoundaryChange(value, boundary);
                    }}
                    selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType)?.[0] || {}}
                    optionKey={"code"}
                    restrictSelection={restrictSelection}
                  />
                </LabelFieldPair>
              ))}
      </div>
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_HEADER")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_TEXT") + " "}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_BACK")}
              onClick={() => {
                checkDataPresent({ action: false });
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_SUBMIT")}
              onClick={() => {
                checkDataPresent({ action: true });
              }}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
    </>
  );
};

// export default SelectingBoundaryComponent;
export { Wrapper, SelectingBoundaryComponent };
