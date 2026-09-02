import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-components";
import { orderBoundaryHierarchy, getBoundaryDepth, toLevelMap } from "../../utils/getBoundaryHierarchy";
import { getHierarchyType } from "../../utils/getHierarchyType";
import { getQueryParam } from "../../utils/getQueryParam";

const BoundaryFilters = ({ activeFilter, onSelect, onPathChange }) => {
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const hierarchyType = getHierarchyType();

  // Levels come from the hierarchy definition rather than the session-storage levelMap:
  // that map is only written on the ViewDashboard redirect path, so a deep link or an
  // expired TTL left this panel with no levels at all. Fetching also gives us the boundary
  // service's own casing ("LGA", not "Lga"), which the relationships search matches on.
  const { isLoading: isHierarchyLoading, data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook({
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `maps-tab-hierarchy-${tenantId}-${hierarchyType}`,
    body: { BoundaryTypeHierarchySearchCriteria: { tenantId, hierarchyType } },
    config: {
      enabled: !!tenantId && !!hierarchyType,
      // useCustomAPIHook defaults to a 1s cacheTime, which would refetch on every mount.
      cacheTime: 15 * 60 * 1000,
      staleTime: 15 * 60 * 1000,
      select: (data) => data?.BoundaryHierarchy?.[0],
    },
  });

  // Memoized on the query data reference: orderedLevels feeds the onPathChange effect, so a
  // fresh array identity every render would loop through the parent's setState.
  const hierarchy = useMemo(
    () => orderBoundaryHierarchy(hierarchyDefinition?.boundaryHierarchy),
    [hierarchyDefinition]
  );

  // How deep to fetch and how many dropdowns to offer — one number drives both, so they
  // cannot disagree and produce dropdowns with no options.
  const depth = getBoundaryDepth(hierarchy);
  const deepestBoundaryType = depth > 0 ? hierarchy[depth - 1] : null;

  const reqCriteria = {
    url: `/boundary-service/boundary-relationships/_search`,
    // boundaryType belongs in the query name: useCustomAPIHook builds its react-query key
    // from [url, changeQueryName, body] and excludes params, so a changing boundaryType
    // would otherwise never refetch. The -parents suffix also stops this sharing a key with
    // LeafletHeatMap's includeChildren:true query, which returns a different tree shape.
    changeQueryName: `maps-tab-boundary-${tenantId}-${hierarchyType}-${deepestBoundaryType}-parents`,
    params: {
      tenantId,
      hierarchyType,
      boundaryType: deepestBoundaryType,
      includeParents: true,
      includeChildren: false,
    },
    config: {
      enabled: !!deepestBoundaryType,
      select: (data) => data?.["TenantBoundary"]?.[0]?.boundary || [],
    },
  };

  const { isLoading: isBoundaryLoading, data: boundaryTree } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  const isLoading = isHierarchyLoading || isBoundaryLoading;

  // One dropdown per level, root-first, capped at the fetched depth.
  // apiType keeps the service's casing for requests; boundaryType is lowercased because
  // boundaryMap and the level-N vocabulary the older charts read are both lowercase-keyed.
  const orderedLevels = useMemo(() => {
    const levelKeys = toLevelMap(hierarchy);
    return hierarchy.slice(0, depth).map((apiType) => ({
      apiType,
      boundaryType: apiType.toLowerCase(),
      level: levelKeys[apiType.toLowerCase()],
    }));
  }, [hierarchy, depth]);

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

  // Boundary codes double as i18n keys (hcm-boundary-{hierarchyType}); fall back to the
  // boundary service name when the code has no translation.
  const displayLabel = (node) => {
    if (!node) return "";
    const translated = node.code ? t(node.code) : "";
    return translated && translated !== node.code ? translated : node.name || node.code;
  };

  // Placeholder text for an unselected level, e.g. "-- Ward --"
  const levelLabel = (levelInfo) => {
    const localeKey = `DSS_BOUNDARY_${Digit.Utils.locale.getTransformedLocale(levelInfo.boundaryType)}`;
    const translated = t(localeKey);
    return translated !== localeKey ? translated : levelInfo.apiType;
  };

  // The dashboard is scoped by the URL (?boundaryType=state&boundaryValue=Borno). Every
  // level from the root down to that scope is fixed and shown read-only; only levels below
  // it are selectable.
  const scopeBoundaryType = getQueryParam("boundaryType");
  const scopeBoundaryValue = getQueryParam("boundaryValue");
  const scopeDepth = Math.max(
    0,
    orderedLevels.findIndex((l) => l.boundaryType === scopeBoundaryType?.toLowerCase())
  );

  const [selections, setSelections] = useState({});
  const isInternalChange = useRef(false);

  const countryDefaultFor = (countryLevel) => {
    const options = boundaryMap[countryLevel?.boundaryType?.toLowerCase()] || [];
    if (!options.length) return null;
    return { code: options[0].code, name: options[0].name || options[0].code, type: countryLevel.boundaryType };
  };

  // Resolve the URL's boundaryValue to a node, then walk its parents so every level in the
  // scope chain is filled. Falls back to the root alone when the URL names nothing usable.
  const buildScopeSelections = () => {
    const countryLevel = orderedLevels[0];
    const countryDefault = countryDefaultFor(countryLevel);
    if (!countryDefault) return null;

    const next = { [countryLevel.level]: countryDefault };
    if (!scopeDepth || !scopeBoundaryValue) return next;

    const scopeLevel = orderedLevels[scopeDepth];
    const options = boundaryMap[scopeLevel.boundaryType] || [];
    const wanted = scopeBoundaryValue.toLowerCase();
    const scopeNode = options.find(
      (b) =>
        b.code?.toLowerCase() === wanted ||
        b.name?.toLowerCase() === wanted ||
        (t(b.code) !== b.code && t(b.code).toLowerCase() === wanted)
    );
    if (!scopeNode) return next;

    next[scopeLevel.level] = { code: scopeNode.code, name: scopeNode.name || scopeNode.code, type: scopeLevel.boundaryType };

    // Fill any levels between the root and the scope from the parent chain.
    let parentCode = scopeNode.parentCode;
    for (let i = scopeDepth - 1; i >= 1; i--) {
      const parentLevel = orderedLevels[i];
      const parentNode = (boundaryMap[parentLevel.boundaryType] || []).find(
        (b) => b.code?.toLowerCase() === parentCode?.toLowerCase()
      );
      if (!parentNode) break;
      next[parentLevel.level] = { code: parentNode.code, name: parentNode.name || parentNode.code, type: parentLevel.boundaryType };
      parentCode = parentNode.parentCode;
    }
    return next;
  };

  // Preselect the scope chain once boundary data lands, and publish the scoped boundary so
  // the map opens on it instead of the national view.
  useEffect(() => {
    if (!orderedLevels.length || !Object.keys(boundaryMap).length) return;
    const next = buildScopeSelections();
    if (!next) return;

    const scopeLevel = orderedLevels[scopeDepth];
    const scopeSel = scopeLevel && next[scopeLevel.level];

    setSelections((prev) => (scopeSel && prev[scopeLevel.level]?.code === scopeSel.code ? prev : next));

    if (scopeDepth > 0 && scopeSel) {
      isInternalChange.current = true;
      onSelect({ ...scopeSel, level: scopeLevel.level });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedLevels, boundaryMap]);

  // Sync dropdown selections when activeFilter changes from outside (map drilldown, breadcrumb)
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (!orderedLevels.length || !Object.keys(boundaryMap).length) return;

    const countryLevel = orderedLevels[0];
    const countryDefault = countryDefaultFor(countryLevel);

    if (!activeFilter) {
      // Back to the root view — keep country selected, drop everything below it
      setSelections(countryDefault ? { [countryLevel.level]: countryDefault } : {});
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
    if (levelIndex >= 1) {
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

  // Publish the full ancestor chain so the map can render it as a breadcrumb
  useEffect(() => {
    if (typeof onPathChange !== "function") return;
    onPathChange(
      orderedLevels
        .map((l, index) => (selections[l.level] ? { l, index } : null))
        .filter(Boolean)
        .map(({ l, index }) => ({
          ...selections[l.level],
          level: l.level,
          label: displayLabel(selections[l.level]),
          // Fixed by the dashboard's URL scope — not navigable, and not a drill-down hop.
          fixed: index <= scopeDepth,
        }))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections, orderedLevels]);

  // "Clear" applies to everything below the fixed scope
  const hasSelectableSelection = orderedLevels.slice(scopeDepth + 1).some((l) => selections[l.level]);

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
    const kept = {};
    orderedLevels.slice(0, scopeDepth + 1).forEach((l) => {
      if (selections[l.level]) kept[l.level] = selections[l.level];
    });
    setSelections(kept);
    // Back to the scoped boundary, not all the way to the root.
    const scopeLevel = orderedLevels[scopeDepth];
    const scopeSel = scopeLevel && kept[scopeLevel.level];
    onSelect(scopeDepth > 0 && scopeSel ? { ...scopeSel, level: scopeLevel.level } : null);
  };

  const emitDeepest = (sels) => {
    let deepest = null;
    for (let i = orderedLevels.length - 1; i >= scopeDepth + 1; i--) {
      const sel = sels[orderedLevels[i].level];
      if (sel) {
        deepest = { ...sel, level: orderedLevels[i].level };
        break;
      }
    }
    if (!deepest && scopeDepth > 0) {
      const scopeLevel = orderedLevels[scopeDepth];
      const scopeSel = sels[scopeLevel?.level];
      if (scopeSel) deepest = { ...scopeSel, level: scopeLevel.level };
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

  // Same shell in both states, and the spinner is shrunk from Loader's 6.25rem default,
  // so the bar keeps roughly its loaded height instead of shunting the map down.
  if (isLoading) {
    return (
      <div className="digit-maps-boundary-filters">
        <span className="digit-maps-boundary-filters-title">{t("DSS_SELECT_BOUNDARY")}</span>
        <div className="digit-maps-boundary-filters-body">
          <Loader className="digit-center-loader" animationStyles={{ width: "1.5rem", height: "1.5rem" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="digit-maps-boundary-filters">
      <span className="digit-maps-boundary-filters-title">{t("DSS_SELECT_BOUNDARY")}</span>

      <div className="digit-maps-boundary-filters-body">
        {orderedLevels.map((levelInfo, index) => {
          // A level only appears once its parent has a selection (the root is always selected)
          if (index > 0 && !selections[orderedLevels[index - 1].level]) return null;

          const options = getOptionsForLevel(index);
          const current = selections[levelInfo.level];

          // Fixed by the dashboard's URL scope — show the value, don't offer a choice.
          if (index <= scopeDepth) {
            return (
              <div key={levelInfo.level} className="digit-maps-boundary-filter-row">
                <div className="digit-maps-boundary-filter-locked" title={current ? displayLabel(current) : ""}>
                  {current ? displayLabel(current) : `-- ${levelLabel(levelInfo)} --`}
                </div>
              </div>
            );
          }

          return (
            <div key={levelInfo.level} className="digit-maps-boundary-filter-row">
              <select
                className="digit-maps-boundary-filter-select"
                aria-label={levelLabel(levelInfo)}
                value={current?.code || ""}
                onChange={(e) => {
                  const sel = options.find((o) => o.code === e.target.value);
                  handleSelect(levelInfo.level, levelInfo.boundaryType, sel?.code || null, sel ? displayLabel(sel) : null);
                }}
              >
                <option value="">{`-- ${levelLabel(levelInfo)} --`}</option>
                {options.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {displayLabel(opt)}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {hasSelectableSelection && (
        <button className="digit-maps-boundary-clear-btn" onClick={clearSelectable}>
          {t("DSS_CLEAR_FILTERS")}
        </button>
      )}
    </div>
  );
};

export default BoundaryFilters;
