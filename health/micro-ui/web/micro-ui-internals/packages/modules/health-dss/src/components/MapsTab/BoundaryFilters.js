import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-components";

const BoundaryFilters = ({ onSelect }) => {
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const levelMap = Digit.SessionStorage.get("levelMap") || {};
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
  // API response uses `boundaryType` (not `label`) and has no `name` field — use `code` as display
  const boundaryMap = useMemo(() => {
    if (!boundaryTree?.length) return {};
    const result = {};
    const traverse = (node, parentCode) => {
      const bt = node.boundaryType?.toLowerCase();
      if (bt) {
        if (!result[bt]) result[bt] = [];
        if (!result[bt].some((b) => b.code === node.code)) {
          result[bt].push({ code: node.code, name: node.code, parentCode });
        }
      }
      (node.children || []).forEach((child) => traverse(child, node.code));
    };
    boundaryTree.forEach((root) => traverse(root, null));
    return result;
  }, [boundaryTree]);

  // Country is pre-selected and locked; user selects from State onwards
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (!orderedLevels.length || !Object.keys(boundaryMap).length) return;
    const countryLevel = orderedLevels[0];
    const countryOptions = boundaryMap[countryLevel.boundaryType.toLowerCase()] || [];
    if (countryOptions.length > 0) {
      setSelections((prev) => {
        if (prev[countryLevel.level]) return prev;
        return { [countryLevel.level]: { code: countryOptions[0].code, name: countryOptions[0].code, type: countryLevel.boundaryType } };
      });
    }
  }, [orderedLevels, boundaryMap]);

  // "Clear" should only check levels from State (index 1) onwards
  const hasSelectableSelection = orderedLevels.slice(1).some((l) => selections[l.level]);

  const handleSelect = (level, boundaryType, code, name) => {
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
    const countryLevel = orderedLevels[0];
    const reset = countryLevel ? { [countryLevel.level]: selections[countryLevel.level] } : {};
    setSelections(reset);
    onSelect(null);
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

          // Country (index 0): locked, non-editable
          if (index === 0) {
            return (
              <div key={levelInfo.level} className={`digit-maps-boundary-filter-row ${indentClass(index)}`}>
                <label className="digit-maps-boundary-filter-label">
                  {t(`DSS_BOUNDARY_${levelInfo.boundaryType.toUpperCase()}`)}
                </label>
                <div className="digit-maps-boundary-filter-locked">
                  {current?.name || options[0]?.name || "—"}
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
                  handleSelect(levelInfo.level, levelInfo.boundaryType, sel?.code || null, sel?.name || null);
                }}
              >
                <option value="">{t("DSS_ALL")}</option>
                {options.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name}
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
