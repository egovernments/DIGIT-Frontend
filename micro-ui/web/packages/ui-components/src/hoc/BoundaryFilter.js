import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../atoms/Card';
import MultiSelectDropdown from '../atoms/MultiSelectDropdown';
import Dropdown from '../atoms/Dropdown';
import Toast from '../atoms/Toast';
import Loader from '../atoms/Loader';
import LabelFieldPair from '../atoms/LabelFieldPair';
import CardLabel from '../atoms/CardLabel';


const BoundaryFilter = (props) => {

  let updatedLayoutConfig = { ...props.layoutConfig };

  if (updatedLayoutConfig?.isDropdownLayoutHorizontal) {
    updatedLayoutConfig.isLabelFieldLayoutHorizontal = updatedLayoutConfig.isLabelFieldLayoutHorizontal ? updatedLayoutConfig.isLabelFieldLayoutHorizontal : false;
  }

  const { t } = useTranslation();
  const hierarchyType = props?.hierarchyType;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [lowestHierarchy, setLowestHierarchy] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [boundaries, setBoundaries] = useState([]);
  const [nonEditableHierarchies, setNonEditableHierarchies] = useState(new Set())
  const [boundaryOptions, setBoundaryOptions] = useState({});   //main state keeping the boundary options in a object mapping 
  const [selectedValues, setSelectedValues] = useState([]);     // Selected values 
  const [selectedValuesCodes, setSelectedValuesCodes] = useState([]);
  const [pathMap, setPathMap] = useState({}); // {"Maryland":MO_Mozambique.MO_MaryLand}


  //2 states are there 1) boundaryOptions(objects that stores by hierarchy), selectedValues(all the selectedValues)
  //flow->
  //User selects from the dependent dropdown
  //The updateBoundaryOptions is triggered
  //The unselect logic is carried out using removedCodes, and then using cleanLowerLevels,cleanLowerLevelsForSelectedValues
  //And then the select logic is carried using findNodeByPath


  //based on boundary json path gives the boundary level
  const getBoundaryType = (path, hierarchy) => {
    if (!hierarchy) return;
    // Count the number of dots in node.code
    const dotCount = (path.match(/\./g) || []).length;
    // Get the corresponding child boundary type from hierarchy
    return hierarchy[dotCount]?.boundaryType;
  };

  const getChildBoundaryType = (path, hierarchy) => {
    if (!hierarchy) return;
    // Count the number of dots in node.code
    const dotCount = (path.match(/\./g) || []).length;

    // Get the corresponding child boundary type from hierarchy
    return hierarchy[dotCount + 1]?.boundaryType;
  };

  const reqHierarchyData = {
    url: `/boundary-service/boundary-relationships/_search`,
    changeQueryName: `${props?.hierarchyType}`,
    params: {
      tenantId: tenantId,
      hierarchyType: hierarchyType,
      includeChildren: true,
    },
    body: {},
    config: {
      enabled: !!props?.hierarchyType, // same as props?.hierarchyType ? true : false
      select: (data) => {
        const tempPathMap = {}; // Store all path mappings here

        // Recursive function to process hierarchy and attach paths
        const processHierarchy = (nodes, parentPath = "") => {
          return nodes.map((node) => {
            // Build full path for current node
            const currentPath = parentPath ? `${parentPath}.${node.code}` : node.code;

            // Store path in the temporary map
            tempPathMap[node.code] = currentPath;

            // Recursively process children
            if (node.children && node.children.length > 0) {
              node.children = processHierarchy(node.children, currentPath);
            }

            // Return node with added path property
            return { ...node, path: currentPath };
          });
        };

        // Start processing and build hierarchy with paths
        const processed = processHierarchy(data?.TenantBoundary?.[0]?.boundary || []);

        // Update state once with the complete map
        setPathMap(tempPathMap);

        return processed;
      },
    },
  };

  // Hiearchy Data contains the raw data from the boundary-service/boundary-relationships/_search
  const { data: hierarchyData, refetch, isLoading, error: hierarchyError } = Digit.Hooks.useCustomAPIHook(reqHierarchyData)


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
    config: {
      select: (data) => {
        return data?.BoundaryHierarchy[0]?.boundaryHierarchy
      }
    }
  };

  // Hierarchy contains the order levels of hierachy eg Country>Province>Administrative Post>Locality>Village
  const { isLoading: hierarchyLoading, data: hierarchy, error: criteriaError } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  useEffect(() => {

    if (hierarchy) {
      const highestIndex = hierarchy?.findIndex(item => item?.boundaryType === props?.levelConfig?.highestLevel);

      if (highestIndex !== -1) {
        const tempNonEditableHierarchies = new Set(hierarchy.slice(0, highestIndex).map(item => item.boundaryType));

        setNonEditableHierarchies(tempNonEditableHierarchies);
      }
    }
  }, [hierarchy, props?.levelConfig?.highestLevel]);

  // Add error handling
  useEffect(() => {
    if (hierarchyError) {
      setShowToast({ key: "error", label: "HIERARCHY_DATA_FETCH_ERROR" });
    }
    if (criteriaError) {
      setShowToast({ key: "error", label: "HIERARCHY_CRITERIA_FETCH_ERROR" });
    }
  }, [hierarchyError, criteriaError]);


  //Highest level of Hierachy eg Country
  const rootBoundaryType = hierarchy?.filter((item) => item?.parentBoundaryType === null)[0]?.boundaryType;

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 2000);
  };

  //useEffect for initializeng boundaries mentioned in props?.frozenData
  useEffect(() => {
    if (!hierarchy || !props.frozenData) return; // Ensure hierarchy & frozenData exist

    // **Transform frozenData**
    const transformedFrozenData = props.frozenData
      .filter(item => pathMap?.[item.code]) // Skip if pathMap[item.code] is missing
      .map(item => ({
        code: item.code.split('.').pop(),  // Extract last segment as code
        path: pathMap[item.code], // Keep original code as path
        boundaryType: getBoundaryType(pathMap[item.code], hierarchy), // Get boundary type
        name: item.name, // Include name
        parent: item.code.split('.').slice(0, -1).join('.') || null // Extract parent path
      }));

    // **Group by boundaryType**
    const groupedData = transformedFrozenData.reduce((acc, item) => {
      if (!item.boundaryType) return acc; // Skip if boundaryType is undefined
      if (!acc[item.boundaryType]) {
        acc[item.boundaryType] = [];
      }
      acc[item.boundaryType].push([null, item]); // Ensure each item follows the expected structure
      return acc;
    }, {});

    // **Call boundaryOptionsUpdate for each boundaryType**
    Object.entries(groupedData).forEach(([boundaryType, values]) => {
      // Ensure `values` is an array of arrays
      boundaryOptionsUpdate(boundaryType, values, "Multi", true);
    });

  }, [hierarchy, hierarchyData, props.frozenData, pathMap]); // Depend on hierarchy & frozenData

  // Create deep-stable preSelected
const stablePreSelected = useMemo(
  () => props.preSelected,
  [JSON.stringify(props.preSelected)]
);

useEffect(() => {
  if (!hierarchy || !stablePreSelected) return;

  const transformedPreSelectedData = stablePreSelected
    .filter(item => pathMap?.[item])
    .map(item => ({
      code: item,
      path: pathMap[item],
      boundaryType: getBoundaryType(pathMap[item], hierarchy),
      name: item,
    }));

  const groupedData = transformedPreSelectedData.reduce((acc, item) => {
    if (!item.boundaryType) return acc;
    if (!acc[item.boundaryType]) acc[item.boundaryType] = [];
    acc[item.boundaryType].push([null, item]);
    return acc;
  }, {});

  Object.entries(groupedData).forEach(([boundaryType, values]) => {
    boundaryOptionsUpdate(boundaryType, values, "Multi", true);
  });

}, [hierarchy, hierarchyData, stablePreSelected, pathMap]);



  // If a boundary JSON path is provided, traverse boundaryHierarchyData to find the node and return its children
  const findNodeByPath = (nodes, targetPath) => {
    if (!nodes || nodes.length == 0) { return }
    for (const node of nodes) {
      if (node.path === targetPath) {
        return node.children?.map(child => ({ code: child.code, id: child.id, path: child.path, boundaryType: child.boundaryType })) || [];
      }
      if (node.children && node.children.length > 0) {
        const result = findNodeByPath(node.children, targetPath);
        if (result) return result; // If found in the recursive call, return result
      }
    }
    return null; // Return null if no match is found
  };


  //for unselect logic it should happen to all the children of the unselected
  const recursiveCleanup = (currentBoundaryType, updatedOptions, codesToRemove) => {
    const childType = hierarchy.find(item => item.parentBoundaryType === currentBoundaryType)?.boundaryType;
    if (!childType || !updatedOptions[childType]) return updatedOptions;

    Object.keys(updatedOptions[childType]).forEach(code => {

      const shouldDelete = (updatedOptions[childType][code] || []).some(child => {
        const hasMatch = codesToRemove.some(code => child.path.includes(code));
        return hasMatch;
      });



      if (shouldDelete) {
        delete updatedOptions[childType][code];
      }
    });


    // Recursively clean next level
    return recursiveCleanup(childType, updatedOptions, codesToRemove);
  };

  //for unselect logic 
  const cleanLowerLevels = (boundaryType, codesToRemove, updatedOptions) => {
    if (codesToRemove.length == 0) return updatedOptions;
    let newBoundaryOptions = recursiveCleanup(boundaryType, updatedOptions, codesToRemove);
    return newBoundaryOptions; // Return the final updated state
  };

  //for unselect logic 
  const cleanLowerLevelsForSelectedValues = (boundaryType, removedCodes, updatedOptions) => {
    return updatedOptions.filter(option => {
      // Ensure path is a valid string before checking `includes`
      if (typeof option?.path !== "string") return true;

      return !removedCodes.some(code => option.path.includes(code));
    });
  };


  //main fucntion, handles dropdown changes
  const boundaryOptionsUpdate = async (boundaryType, values, dropdownType, isPreSelected) => {
    if (!hierarchy || !hierarchyData) return;
    let selectedOptions = [];
    if (dropdownType == "Multi") {
      selectedOptions = values.map(arg => arg[1]) || [];
    } else {
      selectedOptions = [values];
    }
    const childBoundaryType = hierarchy.find(
      (item) => item.parentBoundaryType === boundaryType
    )?.boundaryType;
    //to store the codes to remove
    const removedCodes = [];

    // Find boundaries to remove by comparing selected and existing ones
    const processRemovedCodes = (previousValues, selectedCodes) => {
      Object.keys(previousValues).forEach(code => {
        if (!selectedCodes.has(code)) {
          removedCodes.push(code);
        }
      });
    };

    const previousValues = boundaryOptions[childBoundaryType] || {};
    const selectedCodes = new Set(selectedOptions.map(v => v.code));
    processRemovedCodes(previousValues, selectedCodes);

    const updatedOptions = boundaryOptions;
    let newBoundaryOptions = {};
    let newSelectedOptions = {};
    if (removedCodes.length > 0) {
      //unselect the children of the removed boundaries recursively
      newBoundaryOptions = cleanLowerLevels(boundaryType, removedCodes, { ...boundaryOptions });
      newSelectedOptions = cleanLowerLevelsForSelectedValues(boundaryType, removedCodes, [...selectedValues]);
    }
    // Reset removedCodes after processing
    else {
      //If no boundaries to be removed just use the previous values
      newBoundaryOptions = updatedOptions;
      newSelectedOptions = selectedValues;
    }

    // **Accumulate changes before updating state**
    let updatedSelectedValues = [...newSelectedOptions];

    setBoundaryOptions((prev) => {
      let updatedOptions = { ...newBoundaryOptions };

      // **Memoizing the children lookups**
      const childrenMap = new Map();

      //Going through each of the selected Options 
      selectedOptions.forEach((value) => {
        // **Update selected values locally**
        const existingCodes = new Set(updatedSelectedValues.map(v => v.code));
        if (!existingCodes.has(value.code)) {
          updatedSelectedValues.push(value);
        }

        //appending the children of the selectedOption
        if (boundaryType !== props?.levelConfig?.lowestLevel) {
          if (!childrenMap.has(value?.path)) {
            childrenMap.set(value?.path, findNodeByPath(hierarchyData, value?.path));
          }
          const children = childrenMap.get(value?.path) || [];

          updatedOptions[childBoundaryType] = updatedOptions[childBoundaryType] || {};

          updatedOptions[childBoundaryType][value?.code] = updatedOptions[childBoundaryType][value?.code] || [];

          const existingEntries = new Set(
            updatedOptions[childBoundaryType][value?.code].map(child => child.code)
          );


          const uniqueChildren = children.filter(child => !existingEntries.has(child.code));
          updatedOptions[childBoundaryType][value?.code] = [
            ...updatedOptions[childBoundaryType][value?.code] || [],
            ...uniqueChildren
          ];
        }
      });

      return updatedOptions;
    });

    // **Update selected values once at the end**
    setSelectedValuesCodes(updatedSelectedValues.map((item) => item?.code))
    setSelectedValues((prev) => {
      if (isPreSelected) {
        // Extract existing codes from previous state
        const existingCodes = new Set(prev.map(item => item.code));

        // Filter out only unique values
        const uniqueUpdatedValues = updatedSelectedValues.filter(item => !existingCodes.has(item.code));

        return [...prev, ...uniqueUpdatedValues]; // Append only unique values
      } else {
        return [...updatedSelectedValues]; // Replace with new values
      }
    });


  };

  useEffect(() => {
    if (!props?.onChange) return;
  
    // Trigger only when actual content changes
    props.onChange([...selectedValuesCodes]);
  
  }, [selectedValuesCodes.join(",")]);


  // Initialize root level and hierarchy from highest to lowest
  const initializeBoundaries = (nodes, updatedOptions, nonEditableHierarchies) => {
    if (!nodes || nodes.length === 0) return updatedOptions;

    // If the current node's boundaryType is not in the editable set, return early
    if (!nonEditableHierarchies.has(nodes[0]?.boundaryType)) {
      return updatedOptions;
    }

    // Find the child boundary type of the current level
    const childBoundaryType = hierarchy.find(
      (item) => item.parentBoundaryType === nodes[0]?.boundaryType
    )?.boundaryType;

    if (!childBoundaryType) return updatedOptions; // If no child boundaryType exists, return

    // Ensure the structure exists in updatedOptions
    updatedOptions[childBoundaryType] = updatedOptions[childBoundaryType] || {};

    for (const node of nodes) {
      updatedOptions[childBoundaryType][node.code] =
        updatedOptions[childBoundaryType][node.code] || [];

      // Extract relevant children details
      const children = node.children?.map(child => ({
        code: child.code,
        id: child.id,
        path: child.path,
        boundaryType: child.boundaryType
      })) || [];

      updatedOptions[childBoundaryType][node.code].push(...children);

      // Recursively process child nodes while persisting updatedOptions
      initializeBoundaries(node.children, updatedOptions, nonEditableHierarchies);
    }

    return updatedOptions; // Always return the modified object
  };

  //UseEffect to run if lowestLevel or HigehstLevel or Hierachy data changes
  useEffect(() => {
    if (!hierarchyData || !hierarchy) return;

    // Initialize boundary options with root boundary type
    let initialBoundaryOptions = {
      [rootBoundaryType]: [{
        path: hierarchyData[0]?.path,
        code: hierarchyData[0]?.code,
        id: hierarchyData[0]?.id,
        parent: null
      }]
    };

    // Initialize with a new object to ensure no unwanted mutations occur
    let tempBoundaryOptions = initializeBoundaries(
      hierarchyData,
      { ...initialBoundaryOptions },
      nonEditableHierarchies
    );

    // Ensure that all levels exist even if they have no children
    hierarchy.forEach((item) => {
      if (!nonEditableHierarchies.has(item?.boundaryType) && item?.boundaryType !== props?.levelConfig?.highestLevel) {
        tempBoundaryOptions[item?.boundaryType] = {};
      }
    });

    setBoundaryOptions(tempBoundaryOptions);

  }, [hierarchyData, hierarchy, nonEditableHierarchies]);

  useEffect(() => {
    if (!hierarchy) return;
    setBoundaries(hierarchy.map(item => item?.boundaryType));

  }, [hierarchy]);

  // Checking if userEnter props highestLevel,lowestLevel are valid
  useEffect(() => {
    if (!hierarchy || boundaries.length === 0) return;

    if (!boundaries.includes(props?.levelConfig?.highestLevel)) {
      setShowToast({ key: "error", label: "HIGHEST_LEVEL_CONFIG_NOT_PRESENT" });
    }

    if (!boundaries.includes(props?.levelConfig?.lowestLevel)) {
      setShowToast({ key: "error", label: "LOWEST_LEVEL_CONFIG_NOT_PRESENT" });
    }
  }, [hierarchy, boundaries, props?.levelConfig]);


  return (
    !isLoading && !hierarchyLoading ? (
      <Card noCardStyle={props?.noCardStyle === undefined ? true : props.noCardStyle}>
        <div className={`selecting-boundary-div ${props?.layoutConfig?.isDropdownLayoutHorizontal ? "horizontal-layout" : ""}`}>
          {
            hierarchy && hierarchyData && boundaryOptions[rootBoundaryType] && hierarchy?.filter((boundary, index) => {
              // Find the index of the lowest hierarchy
              const lowestIndex = hierarchy?.findIndex((item) => item?.boundaryType === props?.levelConfig?.lowestLevel);
              const highestIndex = hierarchy?.findIndex((item) => item?.boundaryType === props?.levelConfig?.highestLevel);
              return highestIndex <= index && index <= lowestIndex;
            })?.map((item) => {

              return (item?.boundaryType === rootBoundaryType) ? (
                <LabelFieldPair key={item.boundaryType} className="boundary-item" vertical={!updatedLayoutConfig?.isLabelFieldLayoutHorizontal}>
                  {!updatedLayoutConfig?.isLabelNotNeeded && <CardLabel className={"boundary-selection-label"}>
                    {item?.boundaryType}
                  </CardLabel>}
                  <div className="digit-field-full">
                    {!(props?.levelConfig?.isSingleSelect && props?.levelConfig?.isSingleSelect?.includes(item?.boundaryType)) ?
                      <MultiSelectDropdown
                        key={item?.boundaryType}
                        clearLabel={"CLEAR_ALL"}
                        frozenData={props.frozenData}
                        selected={selectedValues.filter((item) => item.boundaryType == rootBoundaryType)}
                        options={boundaryOptions[rootBoundaryType]}
                        optionsKey={"code"}
                        t={t}
                        onSelect={(values) => {
                          boundaryOptionsUpdate(item?.boundaryType, values, "Multi", false);
                        }}
                        type="multiselectdropdown"
                        config={{
                          isDropdownWithChip: true
                        }}
                      /> :
                      <div className="padding-dropdown">
                        <Dropdown
                          key={item?.boundaryType}
                          option={boundaryOptions[rootBoundaryType]}
                          optionKey={"code"}
                          selected={selectedValues.filter((item) => item.boundaryType == rootBoundaryType)}
                          t={t}
                          select={(values) => {
                            boundaryOptionsUpdate(item?.boundaryType, values, "Single", false);
                          }}
                          type="dropdown"
                          variant="nesteddropdown"
                          disabled={false}
                          showToolTip={true}
                        />
                      </div>

                    }
                  </div>
                </LabelFieldPair>)
                : (() => {
                  const boundaries = boundaryOptions[item?.boundaryType];

                  // Extract all codes from preSelectedData for quick lookup
                  // const preSelectedCodes = new Set(preSelectedData.map(obj => obj.code));

                  // Filter boundaries to find all matching objects
                  // const tempPreSelectedValues =  Array.isArray(boundaries)  ? boundaries.filter(obj => preSelectedCodes.has(obj.code)) : [];


                  if (boundaries) {
                    const formattedOptions = Object.keys(boundaries).map((parentKey) => ({
                      code: parentKey,
                      name: parentKey,
                      options: boundaries[parentKey].map((child) => ({
                        code: child.code,
                        name: child.code,
                        path: child.path,
                        parent: parentKey,
                        boundaryType: child.boundaryType
                      })),
                    }));
                    let formattedSelectedValues = selectedValues.filter((child) => child?.boundaryType === item?.boundaryType);
                    if (props?.levelConfig?.isSingleSelect && props?.levelConfig?.isSingleSelect?.includes(item?.boundaryType)) {
                      formattedSelectedValues = formattedSelectedValues[0];
                    }

                    return (
                      <LabelFieldPair key={item.boundaryType} className="boundary-item" vertical={!updatedLayoutConfig?.isLabelFieldLayoutHorizontal}>
                        {!updatedLayoutConfig?.isLabelNotNeeded  && <CardLabel className={"boundary-selection-label"}>
                          {t((hierarchyType + "_" + item?.boundaryType).toUpperCase())}
                        </CardLabel>}
                        <div className="digit-field-full">
                          {!(props?.levelConfig?.isSingleSelect && props?.levelConfig?.isSingleSelect?.includes(item?.boundaryType)) ?
                            <>
                              <MultiSelectDropdown
                                key={item?.boundaryType}
                                clearLabel="CLEAR_ALL"
                                frozenData={props.frozenData}
                                options={formattedOptions}
                                selected={formattedSelectedValues}
                                optionsKey={"name"}
                                t={t}
                                onSelect={(values) => {
                                  boundaryOptionsUpdate(item?.boundaryType, values, "Multi", false);
                                }}
                                addCategorySelectAllCheck={true}
                                addSelectAllCheck={true}
                                type="multiselectdropdown"
                                variant="nestedmultiselect"
                                config={{
                                  clearLabel: "", // label for clear all chip , default label is "Clear All"
                                  isDropdownWithChip: true, // falg to show chips
                                  showIcon: true, // flag to add icons for each options
                                }}
                              />

                            </> :
                            <div className="padding-dropdown">
                              <Dropdown
                                key={item?.boundaryType}
                                option={formattedOptions}
                                selected={formattedSelectedValues}
                                optionKey={"name"}
                                t={t}
                                select={(values) => {
                                  boundaryOptionsUpdate(item?.boundaryType, values, "Single", false);
                                }}
                                type="dropdown"
                                variant="nesteddropdown"
                                disabled={false}
                                showToolTip={true}
                              />
                            </div>
                          }
                        </div>
                      </LabelFieldPair>
                    );
                  }


                  return null; // Avoids rendering errors when `boundaries` is undefined
                })();

            })}
        </div>


        {showToast && (
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : "success"}
            label={t(showToast?.label)}
            onClose={closeToast}
          />
        )}




      </Card>) : <Loader />

  );


}

export default BoundaryFilter       