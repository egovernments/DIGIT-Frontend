import React, { useState, useEffect, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, Header, CardText } from "@egovernments/digit-ui-react-components";
import { LabelFieldPair, CardLabel } from "@egovernments/digit-ui-components";
// import { MultiSelectDropdown } from "@egovernments/digit-ui-components";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { value } from "jsonpath";
import { Dropdown } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";
        
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
const Wrapper = ({ hierarchyType, lowest, frozenData, frozenType, selectedData, onSelect, boundaryOptions, updateBoundary, hierarchyData , isMultiSelect }) => {
  return (
    <SelectingBoundaryComponent
      onSelect={onSelect}
      hierarchyType={hierarchyType}
      lowest={lowest}
      frozenData={frozenData}
      frozenType={frozenType}
      selectedData1={selectedData}
      boundaryOptionsPage={boundaryOptions}
      updateBoundary={updateBoundary}
      data={hierarchyData}
      isMultiSelect ={isMultiSelect}
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
  isMultiSelect
}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [boundaryOptions, setBoundaryOptions] = useState(boundaryOptionsPage);
  const [selectedData, setSelectedData] = useState(selectedData1);
  const [showPopUp, setShowPopUp] = useState(false);
  const timerRef = useRef(null);
  const [restrictSelection, setRestrictSelection] = useState(updateBoundary);
  const [parentRoot, setParentRoot] = useState(selectedData?.find((item) => item?.isRoot === true)?.type || {});
//   const [updateBoundarySelected, setUpdateBoundary] = useState(updateBoundary);

  useEffect(() => {
    setSelectedData(selectedData1);
  }, [selectedData1]);


  useEffect(() => {
    setBoundaryOptions(boundaryOptionsPage);
  }, [boundaryOptionsPage]);

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

    // If the current node has children, process them recursively
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
      if (!boundaryOptions[parentRoot]) {
        setBoundaryOptions((prevOptions) => ({
          ...prevOptions,
          [parentRoot]: boundaryData[parentRoot],
        }));
      }
    }
  }, [boundaryData, boundaryOptions, parentRoot]);

  function handleBoundaryChange(data, boundary) {
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
        const mergedData = [...(selectedData || []).filter((item) => item?.type !== newBoundaryType), ...transformedRes];

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
          if (boundaryData[childBoundaryType][key].includes(name)) {
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
      onSelect({ selectedData: selectedData, boundaryOptions: boundaryOptions });
    }, 1);
  }, [selectedData, boundaryOptions]);

  const checkDataPresent = ({ action }) => {
    if (action === false) {
      setShowPopUp(false);
    //   setUpdateBoundary(true);
      setRestrictSelection(false);
      return;
    }
    if (action === true) {
      setShowPopUp(false);
    //   setUpdateBoundary(false);
      return;
    }
  };

  if (hierarchyLoading) return <Loader />;

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
              .map((boundary) =>
                boundary?.parentBoundaryType == null ? (
                  <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel>
                      {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={Object.entries(boundaryOptions)
                          .filter(([key]) => key.startsWith(boundary.boundaryType))
                          .flatMap(
                            ([key, value]) =>
                              Object.entries(value || {}).map(([subkey, item]) => ({
                                code: subkey,
                                name: subkey,
                                type: boundary.boundaryType,
                              })) || []
                          )}
                        onSelect={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType) || []}
                        optionsKey={"name"}
                        config={{
                          isDropdownWithChip: true,
                          chipKey: "name",
                        }}
                        // frozenData={frozenData}
                      />
                    </div>
                  </LabelFieldPair>
                ) : (
                  <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel>
                      {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={Object.entries(boundaryOptions)
                          .filter(([key]) => key.startsWith(boundary.boundaryType))
                          .flatMap(([key, value]) =>
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
                        onSelect={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType) || []}
                        optionsKey={"name"}
                        config={{
                          isDropdownWithChip: true,
                          chipKey: "name",
                          numberOfChips: 4,
                        }}
                        addCategorySelectAllCheck={true}
                        addSelectAllCheck={true}
                        variant="nestedmultiselect"
                        frozenData={frozenType === "frozen" ? frozenData : []}
                        popUpOption={boundaryOptions}
                      />
                    </div>
                  </LabelFieldPair>
                )
              )
          : hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy
              .filter((boundary, index, array) => {
                // Find the index of the lowest hierarchy
                const lowestIndex = array.findIndex((b) => b.boundaryType === lowest);
                // Include only those boundaries that are above or equal to the lowest hierarchy
                return index <= lowestIndex;
              })
              .map((boundary) => (
                <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                  <CardLabel>
                    {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                    <span className="mandatory-span">*</span>
                  </CardLabel>
                  <Dropdown
                    t={t}
                    props={{ className: "selecting-boundaries-dropdown" }}
                    option={Object.entries(boundaryOptions)
                      .filter(([key]) => key.startsWith(boundary.boundaryType))
                      .flatMap(
                        ([key, value]) =>
                          Object.entries(value || {}).map(([subkey, item]) => ({
                            code: item?.split(".")?.[0],
                            name: subkey,
                            type: boundary.boundaryType,
                          })) || []
                      )}
                    select={(value) => {
                      handleBoundaryChange(value, boundary);
                    }}
                    selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType)?.[0] || {}}
                    optionKey={"name"}
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
