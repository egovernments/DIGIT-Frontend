import React, { useState, useEffect, Fragment, useRef, useMemo, useCallback, useTransition, useDeferredValue } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, CardLabel, Loader } from "@egovernments/digit-ui-components";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Dropdown } from "@egovernments/digit-ui-components";

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
  const timerRef = useRef(null);
  const [parentRoot, setParentRoot] = useState(selectedData?.find((item) => item?.isRoot === true)?.type || {});
  // Use restrictSelection from parent - no local state needed
  const restrictSelection = restrictSelectionPage;
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setBoundaryOptions(boundaryOptionsPage);
  }, [boundaryOptionsPage]);

  useEffect(() => {
    setSelectedData(selectedData1);
  }, [selectedData1]);

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

  function processData(rootNode, parentPath = "", lowestBoundaryType) {
    // Iterative tree walk with explicit stack — avoids deep recursion overhead
    // and uses direct property assignment instead of object spread for O(n) instead of O(n²)
    const result = {};
    const stack = [{ node: rootNode, parentPath }];

    while (stack.length > 0) {
      const { node, parentPath: pPath } = stack.pop();
      if (!node) continue;

      const bType = node.boundaryType;
      const code = node.code;
      const currentPath = pPath ? `${code}.${pPath}` : code;

      if (!result[bType]) result[bType] = {};
      result[bType][code] = pPath || "mz";

      if (bType === lowestBoundaryType) continue;

      const children = node.children;
      if (children && children.length > 0) {
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push({ node: children[i], parentPath: currentPath });
        }
      }
    }
    return result;
  }

  const boundaryData = useMemo(() => processData(data?.[0], "", lowest), [data, lowest]);

  const updateBoundaryOptions = (selectedData1, boundaryData, hierarchy) => {
    // Pre-build a lookup from parentBoundaryType → childBoundaryType
    const parentToChild = {};
    hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.forEach((boundary) => {
      if (boundary.parentBoundaryType) {
        parentToChild[boundary.parentBoundaryType] = boundary.boundaryType;
      }
    });

    // Collect all updates, then apply as a single setBoundaryOptions call
    const updates = {};
    selectedData1?.forEach((item) => {
      const { type, code } = item;
      const childBoundaryType = parentToChild[type];
      if (childBoundaryType && boundaryData[childBoundaryType]) {
        if (!updates[childBoundaryType]) updates[childBoundaryType] = {};
        const childEntries = boundaryData[childBoundaryType];
        for (const key in childEntries) {
          if (childEntries[key].split(".").includes(code)) {
            updates[childBoundaryType][key] = childEntries[key];
          }
        }
      }
    });

    // Single state update instead of N updates
    if (Object.keys(updates).length > 0) {
      setBoundaryOptions((prevOptions) => {
        const newOptions = { ...prevOptions };
        for (const childType in updates) {
          newOptions[childType] = { ...newOptions[childType], ...updates[childType] };
        }
        return newOptions;
      });
    }
  };

  useEffect(() => {
    setSelectedData(selectedData1);
    const rootItem = selectedData1?.find((item) => item?.isRoot === true);
    if (rootItem?.type) {
      setParentRoot(rootItem.type);
    }
  }, [selectedData1]);

  const isBoundaryDataValid = useMemo(() => {
    return boundaryData && Object.keys(boundaryData).every((key) => key !== "undefined");
  }, [boundaryData]);

  useEffect(() => {
    if (isBoundaryDataValid && hierarchy && selectedData1?.length > 0 && boundaryOptions?.[parentRoot]) {
      startTransition(() => {
        updateBoundaryOptions(selectedData1, boundaryData, hierarchy);
      });
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

  // Pre-build a reverse index: for each child boundary type, map parent code → { childKey: path }
  // This turns the O(selectedItems * childKeys) hot loop into O(selectedItems) lookups.
  const childIndexCache = useRef({ key: null, dataRef: null, index: null });

  const getChildIndex = useCallback((childBoundaryType) => {
    if (!childBoundaryType || !boundaryData[childBoundaryType]) return null;
    const cache = childIndexCache.current;
    // Cache hit — same boundary type AND same boundaryData reference
    if (cache.key === childBoundaryType && cache.dataRef === boundaryData) {
      return cache.index;
    }
    // Build: parentCode → { childKey: path, ... }
    const index = {};
    const childEntries = boundaryData[childBoundaryType];
    for (const key in childEntries) {
      const path = childEntries[key];
      const parts = path.split(".");
      for (const part of parts) {
        if (!index[part]) index[part] = {};
        index[part][key] = path;
      }
    }
    childIndexCache.current = { key: childBoundaryType, dataRef: boundaryData, index };
    return index;
  }, [boundaryData]);

  function handleBoundaryChange(data, boundary) {
    // If selection is restricted, just return - parent component handles the popup
    if (restrictSelection) {
      return;
    }

    // Wrap ALL state updates in startTransition so React can show the loader
    // while the heavy re-render (memoized options, downstream effects) is processed.
    startTransition(() => {
      if (!data || data.length === 0) {
        const structure = createHierarchyStructure(hierarchy);
        const check = structure?.[boundary.boundaryType];

        if (check) {
          const typesToRemoveSet = new Set([boundary?.boundaryType, ...check]);
          const updatedSelectedData = selectedData?.filter((item) => !typesToRemoveSet.has(item?.type));
          const updatedBoundaryData = { ...boundaryOptions };
          typesToRemoveSet.forEach((type) => {
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
          const transformedMap = new Map(transformedRes.map((r) => [r.code, r]));
          const updatedSelectedData = selectedData
            .map((item) => {
              if (item.type === newBoundaryType) {
                return transformedMap.get(item.code) || item;
              }
              return item;
            })
            .filter(Boolean);

          if (!_.isEqual(selectedData, updatedSelectedData)) {
            setSelectedData(updatedSelectedData);
          }
        } else {
          let mergedData = [];
          if (frozenData?.length > 0) {
            const mergedFrozenData = [...(selectedData || []).filter((item) => item?.type !== newBoundaryType), ...transformedRes];
            const mergedCodes = new Set(mergedFrozenData.map((item) => item.code));
            mergedData = [...mergedFrozenData, ...frozenData.filter((frozenItem) => !mergedCodes.has(frozenItem.code))];
          } else {
            mergedData = [...(selectedData || []).filter((item) => item?.type !== newBoundaryType), ...transformedRes];
          }

          // Build parent→children index for O(n) tree walk instead of O(n²) filter
          const childrenByParent = new Map();
          mergedData.forEach((item) => {
            const p = item.parent;
            if (p !== undefined) {
              if (!childrenByParent.has(p)) childrenByParent.set(p, []);
              childrenByParent.get(p).push(item);
            }
          });

          const updatedSelectedData = [];
          const addChildren = (item) => {
            updatedSelectedData.push(item);
            const children = childrenByParent.get(item.code);
            if (children) children.forEach((child) => addChildren(child));
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
          const typesToRemoveSet = new Set([boundary?.boundaryType, ...check]);
          let updatedSelectedData = selectedData?.filter((item) => !typesToRemoveSet.has(item?.type));
          updatedSelectedData = [...updatedSelectedData, ...transformedRes];
          setSelectedData(updatedSelectedData);
        }
      }

      // Build child boundary options using pre-built index (O(n) instead of O(n*m))
      const childBoundaryType = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy.find(
        (h) => h.parentBoundaryType === res?.[0]?.type
      )?.boundaryType;

      if (childBoundaryType) {
        const childIdx = getChildIndex(childBoundaryType);
        const newData = {};

        if (childIdx) {
          // O(res.length) — lookup each selected code in the pre-built index
          res.forEach((item) => {
            const matches = childIdx[item.code];
            if (matches) {
              Object.assign(newData, matches);
            }
          });
        }

        const updatedBoundaryOptions = { ...boundaryOptions };
        updatedBoundaryOptions[childBoundaryType] = newData;
        setBoundaryOptions(updatedBoundaryOptions);
      }
    });
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSelect({ selectedData: selectedData, boundaryOptions: boundaryOptions, restrictSelection: restrictSelection });
    }, 150);
  }, [selectedData, boundaryOptions, restrictSelection]);

  // Memoize visible boundary levels (filter once, not per-render)
  const visibleBoundaryLevels = useMemo(() => {
    const levels = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];
    const lowestIndex = levels.findIndex((b) => b.boundaryType === lowest);
    return levels.filter((_, index) => index <= lowestIndex);
  }, [hierarchy, lowest]);

  // Pre-compute options per boundary type once (avoids re-building 50k-item arrays in JSX)
  const optionsPerType = useMemo(() => {
    const result = {};
    const frozenSet = frozenData?.length > 0
      ? new Set(frozenData.map((f) => `${f.code}::${f.type}`))
      : null;

    visibleBoundaryLevels.forEach((boundary) => {
      const bType = boundary.boundaryType;
      // Direct lookup by boundary type instead of iterating all entries with startsWith
      const value = boundaryOptions?.[bType];

      if (boundary.parentBoundaryType == null) {
        // Root level — flat options
        if (value) {
          const keys = Object.keys(value);
          const arr = new Array(keys.length);
          for (let i = 0; i < keys.length; i++) {
            arr[i] = { code: keys[i], name: keys[i], type: bType };
          }
          result[bType] = arr;
        } else {
          result[bType] = [];
        }
      } else {
        // Nested level — grouped options with frozen filtering
        if (value) {
          const entries = Object.entries(value);
          const arr = [];
          const skipFilter = restrictSelection === false;
          for (let i = 0; i < entries.length; i++) {
            const subkey = entries[i][0];
            const item = entries[i][1];
            if (!skipFilter && frozenSet) {
              const isFrozen = frozenSet.has(`${subkey}::${bType}`);
              if (frozenType === "filter" && isFrozen) continue;
            }
            const parentCode = item ? item.split(".")[0] : "";
            arr.push({
              code: parentCode,
              name: parentCode,
              options: [{ code: subkey, name: subkey, type: bType, parent: parentCode }],
            });
          }
          result[bType] = arr;
        } else {
          result[bType] = [];
        }
      }
    });
    return result;
  }, [boundaryOptions, visibleBoundaryLevels, restrictSelection, frozenData, frozenType]);

  // Pre-compute selected items grouped by type
  const selectedPerType = useMemo(() => {
    const result = {};
    selectedData?.forEach((item) => {
      if (!result[item?.type]) result[item.type] = [];
      result[item.type].push(item);
    });
    return result;
  }, [selectedData]);

  if (hierarchyLoading) return <Loader page={true} variant={"PageLoader"} />;

  return (
    <>
      {isPending && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
      <div className="selecting-boundary-div" style={{ position: "relative" }}>
        {isMultiSelect
          ? visibleBoundaryLevels.map((boundary) => {
                const bType = boundary.boundaryType;
                const options = optionsPerType[bType] || [];
                const selected = selectedPerType[bType] || [];

                return boundary?.parentBoundaryType == null ? (
                  <LabelFieldPair key={bType} style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel className={"boundary-selection-label"}>
                      {t((hierarchyType + "_" + bType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        disablePortal={true}
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={options}
                        onSelect={() => {}}
                        onClose={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selected}
                        optionsKey={"code"}
                        disabled={restrictSelection}
                        disableClearAll={restrictSelection}
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
                  <LabelFieldPair key={bType} style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel className={"boundary-selection-label"}>
                      {t((hierarchyType + "_" + bType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        disablePortal={true}
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={options}
                        onSelect={() => {}}
                        onClose={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selected}
                        optionsKey={"code"}
                        disabled={restrictSelection}
                        disableClearAll={restrictSelection}
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
                        popUpOption={boundaryOptions}
                        isSearchable={true}
                      />
                    </div>
                  </LabelFieldPair>
                );
              })
          : visibleBoundaryLevels.map((boundary) => {
                const bType = boundary.boundaryType;
                const options = Object.entries(boundaryOptions || {})
                  .filter(([key]) => key.startsWith(bType))
                  .flatMap(([, value]) =>
                    Object.entries(value || {}).map(([subkey]) => ({
                      code: subkey,
                      name: subkey,
                      type: bType,
                    }))
                  );
                return (
                  <LabelFieldPair key={bType} style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel className={"boundary-selection-label"}>
                      {t((hierarchyType + "_" + bType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <Dropdown
                      t={t}
                      props={{ className: "selecting-boundaries-dropdown" }}
                      option={options}
                      select={(value) => {
                        handleBoundaryChange(value, boundary);
                      }}
                      selected={selectedData?.filter((item) => item?.type === bType)?.[0] || {}}
                      optionKey={"code"}
                      disabled={restrictSelection}
                    />
                  </LabelFieldPair>
                );
              })}
      </div>
    </>
  );
};

// export default SelectingBoundaryComponent;
export { Wrapper, SelectingBoundaryComponent };
