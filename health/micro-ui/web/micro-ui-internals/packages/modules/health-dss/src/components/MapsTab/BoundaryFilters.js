import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-components";

const BoundaryFilters = ({ activeFilter, onSelect }) => {
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  // Read once — SessionStorage.get() returns a new object on every call, which would
  // make orderedLevels recompute every render and trigger the country-init effect in a loop.
  const levelMap = useRef(Digit.SessionStorage.get("levelMap") || {}).current;
  const campaignSelected = Digit.SessionStorage.get("campaignSelected");
  const hierarchyType = campaignSelected?.hierarchyType || "ADMIN";

  const reqCriteria = {
    url: `/boundary-service/boundary-relationships/_search`,
    changeQueryName: `maps-tab-boundary-${tenantId}-${hierarchyType}`,
    params: {
      tenantId,
      hierarchyType,
      boundaryType: "Ward",
      includeParents: true,
      includeChildren: true,
    },
    config: {
      select: (data) => data?.["TenantBoundary"]?.[0]?.boundary || [],
    },
  };

  const { isLoading, data: boundaryTree } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Ordered hierarchy levels — Country (locked), State, LGA only
  const orderedLevels = useMemo(() => {
    const levelOrder = [
      "level-one", "level-two", "level-three", "level-four",
      "level-five", "level-six", "level-seven",
    ];
    return levelOrder
      .map((level) => {
        const bt = Object.keys(levelMap).find((k) => levelMap[k] === level);
        return bt ? { level, boundaryType: bt } : null;
      })
      .filter(Boolean)
      .slice(0, 3); // Country (locked) + State + LGA
  }, [levelMap]);

  // Flatten nested tree → { "country": [{code, name, parentCode}], "state": [...], ... }
  const boundaryMap = useMemo(() => {
    if (!boundaryTree?.length) return {};
    const result = {};
    const traverse = (node, parentCode) => {
      const bt = node.boundaryType?.toLowerCase();
      if (bt) {
        if (!result[bt]) result[bt] = [];
        if (!result[bt].some((b) => b.code === node.code)) {
          result[bt].push({ code: node.code, name: node.name || node.code, parentCode });
        }
      }
      (node.children || []).forEach((child) => traverse(child, node.code));
    };
    boundaryTree.forEach((root) => traverse(root, null));
    return result;
  }, [boundaryTree]);

  // Country is pre-selected and locked; user selects from State onwards
  const [selections, setSelections] = useState({});
  const isInternalChange = useRef(false);

  // Auto-select country (locked) and state (locked) once boundary data loads; emit state as initial filter
  useEffect(() => {
    if (!orderedLevels.length || !Object.keys(boundaryMap).length) return;

    const countryLevel = orderedLevels[0];
    const stateLevel = orderedLevels[1];
    const countryOptions = boundaryMap[countryLevel.boundaryType.toLowerCase()] || [];
    if (!countryOptions.length) return;

    const countryDefault = { code: countryOptions[0].code, name: countryOptions[0].name || countryOptions[0].code, type: countryLevel.boundaryType };

    let stateDefault = null;
    if (stateLevel) {
      const stateOptions = boundaryMap[stateLevel.boundaryType.toLowerCase()] || [];
      const firstState = stateOptions.find((s) => s.parentCode === countryDefault.code) || stateOptions[0];
      if (firstState) stateDefault = { code: firstState.code, name: firstState.name || firstState.code, type: stateLevel.boundaryType };
    }

    setSelections((prev) => {
      if (
        prev[countryLevel.level]?.code === countryDefault.code &&
        (!stateDefault || prev[stateLevel?.level]?.code === stateDefault.code)
      ) return prev;
      const next = { [countryLevel.level]: countryDefault };
      if (stateDefault && stateLevel) next[stateLevel.level] = stateDefault;
      return next;
    });

    if (stateDefault && stateLevel) {
      isInternalChange.current = true;
      onSelect({ ...stateDefault, level: stateLevel.level });
    }
  }, [orderedLevels, boundaryMap]);

  // Sync dropdown selections when activeFilter changes from outside (e.g., map drilldown)
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (!orderedLevels.length || !Object.keys(boundaryMap).length) return;

    const countryLevel = orderedLevels[0];
    const countryOptions = boundaryMap[countryLevel.boundaryType.toLowerCase()] || [];
    const countryDefault = countryOptions.length > 0
      ? { code: countryOptions[0].code, name: countryOptions[0].name || countryOptions[0].code, type: countryLevel.boundaryType }
      : null;

    if (!activeFilter) {
      // Re-emit the locked state so the map returns to state view instead of national
      const stateLevel = orderedLevels[1];
      const stateSel = stateLevel && selections[stateLevel.level];
      if (stateSel) {
        onSelect({ ...stateSel, level: stateLevel.level });
      } else {
        setSelections(countryDefault ? { [countryLevel.level]: countryDefault } : {});
      }
      return;
    }

    const levelInfo = orderedLevels.find(
      (l) => l.boundaryType.toLowerCase() === activeFilter.type?.toLowerCase()
    );
    if (!levelInfo) return;

    const levelIndex = orderedLevels.indexOf(levelInfo);
    const newSelections = {};
    if (countryDefault) newSelections[countryLevel.level] = countryDefault;

    // Walk up the parent chain to fill in intermediate levels.
    // Also resolve the canonical code from boundaryMap (GeoJSON codes may differ in format
    // from boundary service codes — fall back to name matching when code matching fails).
    let canonicalCode = activeFilter.code;
    if (levelIndex > 1) {
      const targetBtOptions = boundaryMap[activeFilter.type?.toLowerCase()] || [];
      const filterName = activeFilter.name;
      const filterCode = activeFilter.code;
      const targetNode = targetBtOptions.find(
        (b) =>
          b.code === filterCode ||
          b.code?.toLowerCase() === filterCode?.toLowerCase() ||
          (filterName && b.name === filterName) ||
          (filterName && b.name?.toLowerCase() === filterName?.toLowerCase()) ||
          // i18n fallback: boundary service code translates to the same display name as the filter
          (filterName && t(b.code) !== b.code && t(b.code).toLowerCase() === filterName.toLowerCase())
      );
      if (targetNode) canonicalCode = targetNode.code;
      let parentCode = targetNode?.parentCode;
      for (let i = levelIndex - 1; i >= 1; i--) {
        const parentLevelInfo = orderedLevels[i];
        const parentBtOptions = boundaryMap[parentLevelInfo.boundaryType.toLowerCase()] || [];
        const parentNode = parentBtOptions.find(
          (b) => b.code === parentCode || b.code?.toLowerCase() === parentCode?.toLowerCase()
        );
        if (parentNode) {
          newSelections[parentLevelInfo.level] = {
            code: parentNode.code,
            name: parentNode.name || parentNode.code,
            type: parentLevelInfo.boundaryType,
          };
          parentCode = parentNode.parentCode;
        } else if (selections[parentLevelInfo.level]) {
          // Fallback: preserve existing selection so dependent dropdowns remain visible
          newSelections[parentLevelInfo.level] = selections[parentLevelInfo.level];
        }
      }
    }

    // Use canonical code so the dropdown value matches the option list exactly
    newSelections[levelInfo.level] = {
      code: canonicalCode,
      name: activeFilter.name || activeFilter.code,
      type: activeFilter.type,
    };

    setSelections(newSelections);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  // "Clear" only applies to LGA (index 2+) — country and state are both locked
  const hasSelectableSelection = orderedLevels.slice(2).some((l) => selections[l.level]);

  const handleSelect = (level, boundaryType, code, name) => {
    isInternalChange.current = true;
    const levelIndex = orderedLevels.findIndex((l) => l.level === level);
    const next = { ...selections };
    orderedLevels.forEach((l, i) => {
      if (i >= levelIndex) next[l.level] = null;
    });
    next[level] = code ? { code, name, type: boundaryType } : null;
    setSelections(next);
    emitDeepest(next);
  };

  const clearSelectable = () => {
    isInternalChange.current = true;
    const countryLevel = orderedLevels[0];
    const stateLevel = orderedLevels[1];
    const reset = {};
    if (countryLevel) reset[countryLevel.level] = selections[countryLevel.level];
    if (stateLevel && selections[stateLevel.level]) reset[stateLevel.level] = selections[stateLevel.level];
    setSelections(reset);
    // Go back to state view (not national)
    const stateSel = stateLevel && selections[stateLevel.level];
    onSelect(stateSel ? { ...stateSel, level: stateLevel.level } : null);
  };

  const emitDeepest = (sels) => {
    let deepest = null;
    for (let i = orderedLevels.length - 1; i >= 0; i--) {
      const sel = sels[orderedLevels[i].level];
      if (sel) {
        deepest = { ...sel, level: orderedLevels[i].level };
        break;
      }
    }
    onSelect(deepest);
  };

  const getOptionsForLevel = (levelIndex) => {
    const { boundaryType } = orderedLevels[levelIndex];
    const all = boundaryMap[boundaryType.toLowerCase()] || [];
    if (levelIndex === 0) return all;
    const parentSel = selections[orderedLevels[levelIndex - 1].level];
    if (!parentSel) return [];
    return all.filter((b) => b.parentCode === parentSel.code);
  };

  const indentClass = (index) => `digit-maps-boundary-filter-row--indent-${Math.min(index, 5)}`;

  if (isLoading) {
    return (
      <div className="digit-maps-boundary-filters">
        <div className="digit-maps-boundary-filters-header">
          <span className="digit-maps-boundary-filters-title">{t("DSS_BOUNDARY_FILTERS")}</span>
        </div>
        <div className="digit-maps-boundary-filters-body" style={{ justifyContent: "center", alignItems: "center" }}>
          <Loader className="digit-center-loader" />
        </div>
      </div>
    );
  }

  return (
    <div className="digit-maps-boundary-filters">
      <div className="digit-maps-boundary-filters-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#505a5f" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        <span className="digit-maps-boundary-filters-title">{t("DSS_BOUNDARY_FILTERS")}</span>
      </div>

      <div className="digit-maps-boundary-filters-body">
        {orderedLevels.map((levelInfo, index) => {
          // State onwards: hide until parent is selected (Country is always selected, so State always shows)
          if (index > 0 && !selections[orderedLevels[index - 1].level]) return null;

          const options = getOptionsForLevel(index);
          const current = selections[levelInfo.level];
          console.log("current",current)

          // Country (index 0) and State (index 1): locked, non-editable
          if (index === 0 || index === 1) {
            return (
              <div key={levelInfo.level} className={`digit-maps-boundary-filter-row ${indentClass(index)}`}>
                <label className="digit-maps-boundary-filter-label">
                  {t(`DSS_BOUNDARY_${levelInfo.boundaryType.toUpperCase()}`)}
                </label>
                <div className="digit-maps-boundary-filter-locked">
                  {current
                    ? (t(current.code) !== current.code ? t(current.code) : current.name)
                    : (options[0] ? (t(options[0].code) !== options[0].code ? t(options[0].code) : options[0].name) : "—")}
                </div>
              </div>
            );
          }

          return (
            <div key={levelInfo.level} className={`digit-maps-boundary-filter-row ${indentClass(index)}`}>
              <label className="digit-maps-boundary-filter-label">
                {t(`DSS_BOUNDARY_${levelInfo.boundaryType.toUpperCase()}`)}
              </label>
              <select
                className="digit-maps-boundary-filter-select"
                value={current?.code || ""}
                onChange={(e) => {
                  const sel = options.find((o) => o.code === e.target.value);
                  const selName = sel ? (t(sel.code) !== sel.code ? t(sel.code) : sel.name) : null;
                  handleSelect(levelInfo.level, levelInfo.boundaryType, sel?.code || null, selName);
                }}
              >
                <option value="">{t("DSS_ALL")}</option>
                {options.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {t(opt.code) !== opt.code ? t(opt.code) : opt.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {hasSelectableSelection && (
        <div className="digit-maps-boundary-filters-footer">
          <button className="digit-maps-boundary-clear-btn" onClick={clearSelectable}>
            {t("DSS_CLEAR_FILTERS")}
          </button>
        </div>
      )}
    </div>
  );
};

export default BoundaryFilters;
