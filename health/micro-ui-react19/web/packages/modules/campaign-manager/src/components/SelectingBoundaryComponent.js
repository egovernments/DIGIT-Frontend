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
  const [isInitialized, setIsInitialized] = useState(false);
  const [optionsPerType, setOptionsPerType] = useState({});
  const [computingAll, setComputingAll] = useState(true);
  const [boundaryData, setBoundaryData] = useState({});

  // Refs for values the pipeline reads but should NOT restart when they change
  // (the parent echoes our output back as props, which would cause an infinite loop).
  const selectedData1Ref = useRef(selectedData1);
  selectedData1Ref.current = selectedData1;
  const boundaryOptionsPageRef = useRef(boundaryOptionsPage);
  boundaryOptionsPageRef.current = boundaryOptionsPage;

  // Track pipeline completion so post-pipeline user interactions can recompute optionsPerType
  const pipelineDoneRef = useRef(false);
  const pipelineBoundaryOptionsRef = useRef(null);

  // Defer heavy computation until after the Loader has been painted.
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setIsInitialized(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    // After the pipeline has set boundaryOptions, skip the parent echo
    // (parent echoes our output back as props — don't let it override user-interaction changes).
    if (pipelineDoneRef.current) return;
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
    config: {
      cacheTime: 1000000,
      staleTime: 600000,
    },
  };

  const { isLoading: hierarchyLoading, data: hierarchy } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  useEffect(() => {
    setSelectedData(selectedData1);
    const rootItem = selectedData1?.find((item) => item?.isRoot === true);
    if (rootItem?.type) {
      setParentRoot(rootItem.type);
    }
  }, [selectedData1]);

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

  // Pre-build a reverse index: for each child boundary type, map parent code → { childKey: path }
  // This turns the O(selectedItems * childKeys) hot loop into O(selectedItems) lookups.
  // Multi-entry cache: stores indexes for ALL boundary types to avoid thrashing when
  // updateBoundaryOptions iterates across multiple hierarchy levels.
  const childIndexCache = useRef({ dataRef: null, indexes: new Map() });

  const getChildIndex = useCallback((childBoundaryType) => {
    if (!childBoundaryType || !boundaryData[childBoundaryType]) return null;
    const cache = childIndexCache.current;
    // Invalidate entire cache when boundaryData reference changes
    if (cache.dataRef !== boundaryData) {
      cache.dataRef = boundaryData;
      cache.indexes = new Map();
    }
    // Cache hit
    if (cache.indexes.has(childBoundaryType)) {
      return cache.indexes.get(childBoundaryType);
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
    cache.indexes.set(childBoundaryType, index);
    return index;
  }, [boundaryData]);

  function handleBoundaryChange(data, boundary) {
    // If selection is restricted, just return - parent component handles the popup
    if (restrictSelection) {
      return;
    }

    // Clear case: update state immediately (no startTransition) so child dropdowns
    // reset their Select All / category checkboxes without delay.
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

    // Wrap selection state updates in startTransition so React can show the loader
    // while the heavy re-render (memoized options, downstream effects) is processed.
    startTransition(() => {

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

  // ── Unified async pipeline ──
  // Merges tree walk (processData), boundary options update, and optionsPerType into ONE
  // async flow with time-based yielding (~4ms per chunk). This avoids cascading effects
  // where each state change triggers re-renders and restarts, causing cumulative main-thread blocking.
  useEffect(() => {
    if (!isInitialized || !data?.[0] || !hierarchy) return;

    pipelineDoneRef.current = false;
    pipelineBoundaryOptionsRef.current = null;
    setComputingAll(true);
    let cancelled = false;

    // Yield to browser every ~4ms to keep loader animation at 60fps
    const YIELD_MS = 4;
    const yieldControl = () => new Promise((resolve) => setTimeout(resolve, 0));

    const runPipeline = async () => {
      let lastYield = performance.now();
      const maybeYield = async () => {
        if (performance.now() - lastYield >= YIELD_MS) {
          await yieldControl();
          if (cancelled) return false;
          lastYield = performance.now();
        }
        return true;
      };

      // ── Step 1: Tree walk → boundaryData ──
      const bData = {};
      const stack = [{ node: data[0], parentPath: "" }];

      while (stack.length > 0) {
        if (cancelled) return;
        const { node, parentPath: pPath } = stack.pop();
        if (!node) continue;

        const bType = node.boundaryType;
        const code = node.code;
        const currentPath = pPath ? `${code}.${pPath}` : code;

        if (!bData[bType]) bData[bType] = {};
        bData[bType][code] = pPath || "mz";

        if (bType !== lowest) {
          const children = node.children;
          if (children && children.length > 0) {
            for (let i = children.length - 1; i >= 0; i--) {
              stack.push({ node: children[i], parentPath: currentPath });
            }
          }
        }

        if (!(await maybeYield())) return;
      }

      if (cancelled) return;

      // Validate boundaryData
      const bdKeys = Object.keys(bData);
      if (bdKeys.length === 0 || bdKeys.some((k) => k === "undefined")) {
        setBoundaryData(bData);
        setComputingAll(false);
        return;
      }

      // ── Step 2: Merge boundary options (root + child updates) ──
      const rootType = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.find(
        (b) => !b.parentBoundaryType
      )?.boundaryType;

      // Read latest values from refs (not deps) to avoid infinite loop
      // when parent echoes our output back as props.
      const currentBoundaryOptionsPage = boundaryOptionsPageRef.current;
      const currentSelectedData = selectedData1Ref.current;

      let mergedOptions = { ...currentBoundaryOptionsPage };

      // Set root options if missing
      if (rootType && bData[rootType] && !mergedOptions[rootType]) {
        mergedOptions = { ...mergedOptions, [rootType]: bData[rootType] };
      }

      // Build child indexes and update boundary options (like updateBoundaryOptions)
      if (currentSelectedData?.length > 0 && mergedOptions[rootType]) {
        const parentToChild = {};
        hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.forEach((b) => {
          if (b.parentBoundaryType) parentToChild[b.parentBoundaryType] = b.boundaryType;
        });

        // Build all needed child indexes with yielding
        const childIndexes = {};
        for (const childType of Object.values(parentToChild)) {
          if (cancelled) return;
          if (!bData[childType]) continue;

          const index = {};
          const childEntries = bData[childType];
          for (const key in childEntries) {
            const path = childEntries[key];
            const parts = path.split(".");
            for (const part of parts) {
              if (!index[part]) index[part] = {};
              index[part][key] = path;
            }
            if (!(await maybeYield())) return;
          }
          childIndexes[childType] = index;
        }

        // Collect updates using indexes
        const updates = {};
        currentSelectedData.forEach((item) => {
          const childType = parentToChild[item.type];
          if (childType && childIndexes[childType]) {
            if (!updates[childType]) updates[childType] = {};
            const matches = childIndexes[childType][item.code];
            if (matches) Object.assign(updates[childType], matches);
          }
        });

        if (Object.keys(updates).length > 0) {
          for (const childType in updates) {
            mergedOptions[childType] = { ...mergedOptions[childType], ...updates[childType] };
          }
        }
      }

      if (cancelled) return;
      await yieldControl();
      if (cancelled) return;
      lastYield = performance.now();

      // ── Step 3: Compute optionsPerType from mergedOptions ──
      const levels = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];
      const lowestIndex = levels.findIndex((b) => b.boundaryType === lowest);
      const visLevels = levels.filter((_, index) => index <= lowestIndex);

      const frozenSet = frozenData?.length > 0
        ? new Set(frozenData.map((f) => `${f.code}::${f.type}`))
        : null;

      const optResult = {};

      for (let levelIdx = 0; levelIdx < visLevels.length; levelIdx++) {
        if (cancelled) return;

        const boundary = visLevels[levelIdx];
        const bType = boundary.boundaryType;
        const value = mergedOptions[bType];

        if (boundary.parentBoundaryType == null) {
          if (value) {
            const keys = Object.keys(value);
            const arr = new Array(keys.length);
            for (let i = 0; i < keys.length; i++) {
              arr[i] = { code: keys[i], name: keys[i], type: bType };
            }
            optResult[bType] = arr;
          } else {
            optResult[bType] = [];
          }
        } else {
          if (value) {
            const entries = Object.entries(value);
            const skipFilter = restrictSelection === false;
            const grouped = new Map();

            for (let i = 0; i < entries.length; i++) {
              const subkey = entries[i][0];
              const item = entries[i][1];
              if (!skipFilter && frozenSet) {
                if (frozenType === "filter" && frozenSet.has(`${subkey}::${bType}`)) continue;
              }
              const parentCode = item ? item.split(".")[0] : "";
              let group = grouped.get(parentCode);
              if (!group) {
                group = { code: parentCode, name: parentCode, options: [] };
                grouped.set(parentCode, group);
              }
              group.options.push({ code: subkey, name: subkey, type: bType, parent: parentCode });

              if (!(await maybeYield())) return;
            }

            optResult[bType] = Array.from(grouped.values());
          } else {
            optResult[bType] = [];
          }
        }

        await yieldControl();
        if (cancelled) return;
        lastYield = performance.now();
      }

      if (cancelled) return;

      // ── Step 4: Set all state at once — no cascading re-renders ──
      pipelineDoneRef.current = true;
      pipelineBoundaryOptionsRef.current = mergedOptions;
      setBoundaryData(bData);
      setBoundaryOptions(mergedOptions);
      setOptionsPerType(optResult);
      setComputingAll(false);
    };

    runPipeline();
    return () => { cancelled = true; };
  }, [isInitialized, data, lowest, hierarchy, restrictSelection, frozenData, frozenType]);

  // Post-pipeline sync: recompute optionsPerType when boundaryOptions changes from user interaction
  // (e.g., user selects a root boundary → handleBoundaryChange sets child options).
  // Skips the pipeline's own setBoundaryOptions output via reference comparison.
  useEffect(() => {
    if (computingAll) return;
    // Skip if this is the pipeline's own output
    if (boundaryOptions === pipelineBoundaryOptionsRef.current) return;

    const frozenSet = frozenData?.length > 0
      ? new Set(frozenData.map((f) => `${f.code}::${f.type}`))
      : null;

    const result = {};
    visibleBoundaryLevels.forEach((boundary) => {
      const bType = boundary.boundaryType;
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
        // Nested level — group by parent code
        if (value) {
          const entries = Object.entries(value);
          const skipFilter = restrictSelection === false;
          const grouped = new Map();

          for (let i = 0; i < entries.length; i++) {
            const subkey = entries[i][0];
            const item = entries[i][1];
            if (!skipFilter && frozenSet) {
              if (frozenType === "filter" && frozenSet.has(`${subkey}::${bType}`)) continue;
            }
            const parentCode = item ? item.split(".")[0] : "";
            let group = grouped.get(parentCode);
            if (!group) {
              group = { code: parentCode, name: parentCode, options: [] };
              grouped.set(parentCode, group);
            }
            group.options.push({ code: subkey, name: subkey, type: bType, parent: parentCode });
          }

          result[bType] = Array.from(grouped.values());
        } else {
          result[bType] = [];
        }
      }
    });

    setOptionsPerType(result);
  }, [boundaryOptions, computingAll, visibleBoundaryLevels, restrictSelection, frozenData, frozenType]);

  // Pre-compute selected items grouped by type
  const selectedPerType = useMemo(() => {
    if (computingAll) return {};
    const result = {};
    selectedData?.forEach((item) => {
      if (!result[item?.type]) result[item.type] = [];
      result[item.type].push(item);
    });
    return result;
  }, [selectedData, computingAll]);

  if (hierarchyLoading || !isInitialized || computingAll) return <Loader page={true} variant={"PageLoader"} />;

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
