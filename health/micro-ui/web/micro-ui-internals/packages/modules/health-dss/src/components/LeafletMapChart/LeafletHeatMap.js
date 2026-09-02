import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { scaleQuantile } from "d3-scale";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader, Button } from "@egovernments/digit-ui-components";
import FilterContext from "../FilterContext";
import { getTitleHeading } from "../../utils/locale";
import { getDuration } from "../../utils/getDuration";
import { getQueryParam } from "../../utils/getQueryParam";
import { isLevelOneBoundary } from "../../utils/isLevelOneBoundary";
import { getBoundaryTypeByLevel } from "../../utils/getBoundaryTypeByLevel";
import { getHierarchyType } from "../../utils/getHierarchyType";
import { useMapPoints, selectRendering } from "./useMapPoints";
import { useMapPointsLayer } from "./MapPointsLayer";

const SATELLITE_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const STANDARD_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const COLOR_RANGE = ["#FF7373", "#FF8565", "#FFC42E", "#FFAA45", "#9ACC49", "#01D66F"];
// Polygon separators: the previous 1px #C6C6C6 washed out against the fill colours.
const BOUNDARY_BORDER_COLOR = "#0B0C0C";
const BOUNDARY_BORDER_WEIGHT = 2;
// Hover: the DIGIT orange already used by the breadcrumb and range slider. White would
// vanish against the pale no-data fill.
const BOUNDARY_HOVER_COLOR = "#C84C0E";
const BOUNDARY_HOVER_WEIGHT = 4;
// Coverage can exceed 100%. The slider tops out at 100, where the upper bound means
// "100 and above", and the colour scale clamps so anything over 100 gets the full-100 green.
const COVERAGE_MAX = 100;
const COVERAGE_STEP = 5;
// Shared by both layers-panel rows so each row's icon reflects its own on/off state
const EyeIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

const MAP_MAX_ZOOM = 19;
const MAP_INITIAL_ZOOM = 5;

// Own pane so the point layer always sits above the choropleth. Sharing overlayPane (400)
// would leave the z-order decided by whichever layer was rebuilt last.
const CLUSTER_PANE = "digitClusterPane";
const CLUSTER_PANE_Z_INDEX = 450;

const toFilterCase = (str) => (str ? str.toLowerCase() : str);

const LeafletHeatMap = ({
  chartId,
  visualizer,
  chartType,
  coverageLayers = [],
  activeCoverageIndex = 0,
  onCoverageChange,
  pointLayers = [],
  activeFilter,
  onDrillDown,
  boundaryPath,
  onBreadcrumbClick,
  pageZoom,
}) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const copyOfValue = Object.assign({}, value);

  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  // Mirrors isGeoJsonVisible so a rebuilt layer honours the user's choice without
  // the rebuild effect having to depend on that state.
  const geoJsonVisibleRef = useRef(true);
  const baseLayerRefs = useRef({ satellite: null, standard: null });

  const [isSatellite, setIsSatellite] = useState(false);
  const [isGeoJsonVisible, setIsGeoJsonVisible] = useState(true);
  // Index into pointLayers, or -1 for off. Defaults to the first point layer so a dashboard
  // that configures one shows it without the user having to find the layers panel.
  const [activePointIndex, setActivePointIndex] = useState(pointLayers.length ? 0 : -1);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  // mapRef is populated by an effect, so the first render has no map for useMapPoints to bind
  // its moveend listener to. This flips once the instance exists.
  const [isMapReady, setIsMapReady] = useState(false);
  const [zoom, setZoom] = useState(MAP_INITIAL_ZOOM);
  // Only boundaries whose coverage falls inside this range stay highlighted.
  const [coverageRange, setCoverageRange] = useState([0, 100]);

  const boundaryType = getQueryParam("boundaryType");
  const boundaryValue = getQueryParam("boundaryValue");
  const boundaryLevelMap = useRef(Digit.SessionStorage.get("levelMap") || {}).current;
  const { campaignNumber } = Digit.Hooks.useQueryParams();

  const projectSelected = useRef(Digit.SessionStorage.get("projectSelected")).current;
  const nationalMap =
    projectSelected?.boundaries?.[0]?.country?.[0]?.toLowerCase() || "national-map";
  const isLevelOne = isLevelOneBoundary(boundaryLevelMap, boundaryType);

  // Snapshot of the global filter context at mount — used to reset when panel selection is cleared
  const baseFilterRef = useRef(copyOfValue);

  const [filterStack, setFilterStack] = useState({ value: copyOfValue });
  const filterBoundaryValue = filterStack?.value?.filters?.boundaryType;

  const [boundaryLevel, setBoundaryLevel] = useState(
    filterStack?.value?.filters?.boundaryType
      ? toFilterCase(filterStack.value.filters.boundaryType)
      : boundaryType
  );
  const [filterFeature, setFilterFeature] = useState(null);
  const [mapSelector, setMapSelector] = useState(
    !isLevelOne
      ? filterBoundaryValue
        ? filterStack?.value?.filters?.[filterBoundaryValue]?.toLowerCase()
        : filterStack?.value?.filters?.[boundaryType]?.toLowerCase()
      : nationalMap
  );
  // The chart chain, discovered one hop at a time — index === boundary depth.
  // Each response only reveals the NEXT id (drillDownChartId), so a jump straight from
  // Country to LGA walks the chain over successive fetches rather than resolving at once.
  const [chartChain, setChartChain] = useState([chartId]);

  // Depth of the deepest selected boundary, and of the dashboard's fixed URL scope.
  const selectedDepth = Math.max(0, (boundaryPath?.length || 1) - 1);
  const scopeDepth = Math.max(0, (boundaryPath?.filter((c) => c?.fixed).length || 1) - 1);

  // The configured chart already sits AT the scope — a provincial dashboard's base chart is
  // the province chart, not the national one — so the chain is indexed from the scope, not
  // from the hierarchy root. Without this a scoped dashboard opens one hop too deep.
  const chainIndex = Math.max(0, selectedDepth - scopeDepth);
  const chartKey = chartChain[Math.min(chainIndex, chartChain.length - 1)];

  // One parameterised chart serves every depth; what changes per depth is the scaling policy,
  // which decides precision, bbox and whether individual documents are requested at all.
  const activePointLayer = activePointIndex >= 0 ? pointLayers[activePointIndex] : undefined;
  const pointChartKey = activePointLayer?.id;

  const colorScale = scaleQuantile().domain([0, 100]).range(COLOR_RANGE);

  useEffect(() => {
    if (!value) return;
    baseFilterRef.current = Object.assign({}, value);
    setFilterStack((prev) => {
      const bt = prev?.value?.filters?.boundaryType;
      return {
        value: {
          ...value,
          filters: {
            ...(value.filters || {}),
            // keep whatever boundary drill is currently applied
            ...(bt ? { boundaryType: bt, [bt]: prev.value.filters[bt] } : {}),
          },
        },
      };
    });
  }, [value]);

  // ── GeoJSON loading ──────────────────────────────────────────────────────
  const { data: geoJsonConfig, isLoading: isGeoJsonLoading } = Digit.Hooks.useCustomMDMS(
    Digit?.ULBService?.getStateId(),
    "map-config",
    [{ name: "GeoJsonMapping" }],
    {},
    { schemaCode: "map-config.GeoJsonMapping" }
  );

  const { isLoading: isGeoLoading, isFetching: isGeoFetching, data: mapData } = Digit.Hooks.DSS.useDSSGeoJson(
    Digit?.ULBService?.getStateId(),
    "GeoJsonMapping",
    [mapSelector?.toLowerCase().replaceAll(" ", "_")],
    geoJsonConfig,
    { enabled: !isGeoJsonLoading }
  );

  // ── Chart data ───────────────────────────────────────────────────────────
  const dssFilters = Digit.SessionStorage.get("DSS_FILTERS");
  const sd = dssFilters?.range?.startDate
    ? new Date(dssFilters.range.startDate)
    : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  const ed = dssFilters?.range?.endDate
    ? new Date(dssFilters.range.endDate)
    : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const interval = getDuration(sd, ed);

  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const authToken = Digit.UserService.getUser()?.access_token || null;

  // Boundary relationship data — same cache key as BoundaryFilters, no extra network request.
  // Used to resolve GeoJSON boundary codes → human-readable display names for the chart API filter.
  const hierarchyType = getHierarchyType();
  const { data: boundaryTree } = Digit.Hooks.useCustomAPIHook({
    url: `/boundary-service/boundary-relationships/_search`,
    // -children suffix: params are excluded from useCustomAPIHook's react-query key, so
    // without it this shared a key with BoundaryFilters' includeChildren:false query and
    // whichever mounted first decided what both of them got.
    changeQueryName: `maps-tab-boundary-${tenantId}-${hierarchyType}-Ward-children`,
    params: { tenantId, hierarchyType, boundaryType: "Ward", includeParents: true, includeChildren: true },
    config: { select: (data) => data?.["TenantBoundary"]?.[0]?.boundary || [] },
  });

  // Maps getTitleHeading(boundaryCode) → displayName so feature clicks send human-readable names.
  const codeToNameRef = useRef({});
  // Maps getTitleHeading(boundaryCode) → canonical node.code (boundary service code, proper case).
  const codeToServiceCodeRef = useRef({});
  // Maps node.name.toLowerCase() → canonical node.code for name-based reverse lookup.
  const nameToServiceCodeRef = useRef({});
  useEffect(() => {
    if (!boundaryTree?.length) return;
    const nameMap = {};
    const codeMap = {};
    const serviceCodeMap = {};
    const traverse = (node) => {
      if (node.code) {
        const titleKey = getTitleHeading(node.code);
        codeMap[titleKey] = node.name || node.code;
        serviceCodeMap[titleKey] = node.code;
        if (node.name) nameMap[node.name.toLowerCase()] = node.code;
      }
      (node.children || []).forEach(traverse);
    };
    boundaryTree.forEach((root) => traverse(root));
    codeToNameRef.current = codeMap;
    codeToServiceCodeRef.current = serviceCodeMap;
    nameToServiceCodeRef.current = nameMap;
  }, [boundaryTree]);

  // Shared by the coverage chart and the point-cluster chart so the two layers can never
  // disagree about which boundary they are showing.
  const apiFilters = {
    ...filterStack?.value?.filters,
    // Every ancestor, not just the deepest — a district-level chart filters on its
    // province too, and the backend ignores keys absent from its requestQueryMap.
    ...(boundaryPath || []).reduce((acc, crumb) => {
      if (crumb?.type && crumb?.label) acc[crumb.type] = crumb.label;
      return acc;
    }, {}),
    ...filterFeature,
    campaignNumber,
  };

  const chartReqCriteria = {
    url: `/dashboard-analytics/dashboard/getChartV2`,
    changeQueryName: `leaflet-chart-${chartKey}-${JSON.stringify(filterStack?.value?.filters)}-${JSON.stringify(filterFeature)}`,
    body: {
      aggregationRequestDto: {
        visualizationCode: chartKey,
        visualizationType: "table",
        queryType: "",
        requestDate: {
          startDate: sd.getTime(),
          endDate: ed.getTime(),
          interval,
          title: "home",
        },
        filters: apiFilters,
        aggregationFactors: null,
      },
      headers: { tenantId },
    },
    headers: { "auth-token": authToken },
    config: {
      enabled: !!chartKey,
      select: (data) => data,
    },
  };

  const { isLoading: isFetchingChart, data: chartResponse } =
    Digit.Hooks.useCustomAPIHook(chartReqCriteria);

  // ── Point layer ──────────────────────────────────────────────────────────
  // The hook resolves precision/bbox/hitsCap from the layer's scaling policy. In boundary mode
  // those never change while panning, so the query key is stable and no request is made; in
  // viewport mode it only produces new params once the map leaves the region already fetched.
  const { params: pointParams, hitsCap } = useMapPoints({
    map: mapRef.current,
    scaling: activePointLayer?.scaling,
    chainIndex,
    enabled: !!pointChartKey && isMapReady,
  });

  const { isFetching: isFetchingPoints, data: pointResponse } = Digit.Hooks.useCustomAPIHook({
    url: `/dashboard-analytics/dashboard/getChartV2`,
    changeQueryName: `leaflet-points-${pointChartKey}-${JSON.stringify(apiFilters)}-${JSON.stringify(pointParams)}`,
    body: {
      aggregationRequestDto: {
        visualizationCode: pointChartKey,
        visualizationType: "table",
        queryType: "",
        requestDate: { startDate: sd.getTime(), endDate: ed.getTime(), interval, title: "home" },
        // The backend honours only the params the chart declares under queryParams; anything
        // else here is inert.
        filters: { ...apiFilters, ...(pointParams || {}) },
        aggregationFactors: null,
      },
      headers: { tenantId },
    },
    headers: { "auth-token": authToken },
    config: { enabled: !!pointChartKey && !!pointParams, select: (data) => data },
  });

  const pointDataset = pointResponse?.responseData?.customData?.rawResponse?.households;
  const rendering = React.useMemo(() => selectRendering(pointDataset, hitsCap), [pointDataset, hitsCap]);

  useMapPointsLayer(mapRef, rendering, {
    pane: CLUSTER_PANE,
    maxZoom: MAP_MAX_ZOOM,
    t,
    enabled: activePointIndex >= 0,
  });

  useEffect(() => {
    setChartChain([chartId]);
  }, [chartId]);

  // Append the next hop once the CURRENT chart's response lands. Guarded on isFetchingChart
  // because useCustomAPIHook sets keepPreviousData, so mid-flight chartResponse still holds
  // the previous chart's payload — appending from that would corrupt the chain.
  useEffect(() => {
    if (isFetchingChart) return;
    const next = chartResponse?.responseData?.drillDownChartId;
    if (!next || next === "none") return;
    setChartChain((prev) => {
      const i = prev.indexOf(chartKey);
      if (i < 0 || prev[i + 1] === next) return prev;
      return [...prev.slice(0, i + 1), next];
    });
  }, [chartResponse, chartKey, isFetchingChart]);

  // Single source of truth for polygon styling so the initial render and the range
  // re-style below cannot drift apart.
  const styleForValue = useCallback(
    (value) => {
      // Top of the slider is open-ended, so >100% stays highlighted instead of dimming out.
      const upperBound = coverageRange[1] >= COVERAGE_MAX ? Infinity : coverageRange[1];
      const inRange = value !== undefined && value >= coverageRange[0] && value <= upperBound;
      return {
        fillColor: value === undefined ? "#F0E8E8" : colorScale(Math.min(value, COVERAGE_MAX)),
        weight: BOUNDARY_BORDER_WEIGHT,
        opacity: 1,
        color: BOUNDARY_BORDER_COLOR,
        fillOpacity: inRange ? 0.7 : 0.08,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coverageRange]
  );

  const buildChartData = useCallback(() => {
    const result = {};
    chartResponse?.responseData?.data?.forEach((item) => {
      result[getTitleHeading(item.headerName)] = {
        // percentage drives the fill colour; the rest are shown on hover
        value: item.plots?.find((p) => p.symbol === "percentage")?.value,
        plots: item.plots || [],
      };
    });
    return result;
  }, [chartResponse]);

  // Tooltip body: boundary name plus every metric the chart returned, formatted by symbol.
  const buildTooltip = useCallback(
    (name, entry) => {
      const rows = (entry?.plots || [])
        .filter((plot) => plot?.symbol !== "text" && plot?.value !== null && plot?.value !== undefined)
        .map((plot) => {
          const labelKey = `DSS_${Digit.Utils.locale.getTransformedLocale(plot.name)}`;
          const label = t(labelKey) !== labelKey ? t(labelKey) : plot.name;
          const value =
            plot.symbol === "percentage"
              ? `${Number(plot.value).toFixed(1)}%`
              : Number(plot.value).toLocaleString();
          return `<tr><td class="digit-leaflet-tooltip-label">${label}</td><td class="digit-leaflet-tooltip-value">${value}</td></tr>`;
        })
        .join("");
      return `<strong>${name}</strong>${rows ? `<table class="digit-leaflet-tooltip-table">${rows}</table>` : ""}`;
    },
    [t]
  );

  useEffect(() => {
    const bv = filterStack?.value?.filters?.boundaryType;
    const bn = filterStack?.value?.filters?.[bv];
    if (
      (bv && boundaryLevelMap?.[bv] !== undefined && boundaryLevelMap?.[bv] !== "level-one") ||
      (boundaryLevelMap?.[boundaryType] !== undefined &&
        boundaryLevelMap?.[boundaryType] !== "level-one")
    ) {
      setMapSelector(
        bn
          ? bn.toLowerCase().replaceAll(" ", "_")
          : boundaryValue?.toLowerCase().replaceAll(" ", "_")
      );
      setBoundaryLevel(toFilterCase(bv || boundaryType));
    }
  }, [filterStack]);

  // Tracks whether the last activeFilter change originated inside this component
  // (map click or chip removal) so the effect that watches activeFilter can skip
  // re-applying what was already applied internally.
  const internalDrillRef = useRef(false);

  // A ref updated on every render so Leaflet click handlers never go stale.
  // This avoids the stale-closure problem where event handlers bound during
  // layer construction keep capturing old boundaryLevelMap values.
  const featureClickRef = useRef(null);
  featureClickRef.current = (locationName, rawCode, level, hasCoordinatesDown) => {
    // locationName = getTitleHeading(rawCode) — used for GeoJSON key matching
    // rawCode = feature.properties.name — the boundary code, used for parent-chain lookup in BoundaryFilters
    // displayName — human-readable name resolved from boundary data, sent to the chart API filter
    if (!hasCoordinatesDown) {
      if (level === 4) setFilterFeature({ finalFilter: locationName });
      else return;
    }

    // Resolve human-readable name. Priority:
    // 1. i18n: boundary codes are keys in hcm-boundary-{hierarchyType} loaded at module start
    // 2. boundary service node.name (codeToNameRef)
    // 3. fall back to the title-cased code (locationName)
    const tResult = rawCode ? t(rawCode) : null;
    const displayName = (tResult && tResult !== rawCode)
      ? tResult
      : (codeToNameRef.current[locationName] || locationName);

    // Resolve GeoJSON rawCode to the boundary service canonical code so BoundaryFilters can
    // match it exactly in its dropdown options (which are keyed on boundary service codes).
    // codeToServiceCodeRef handles same-code-different-case; nameToServiceCodeRef handles
    // the case where boundary service stores human-readable names and codes differ from GeoJSON.
    const serviceCode = codeToServiceCodeRef.current[locationName]
      || (displayName && nameToServiceCodeRef.current[displayName.toLowerCase()])
      || rawCode;

    if (level === 2) {
      const bl = getBoundaryTypeByLevel("level-two", boundaryLevelMap);
      // Mirror the activeFilter effect: base on baseFilterRef so all context filters
      // (campaign dates, tenantId, etc.) are preserved and parent boundary names stay clean.
      setFilterStack({
        value: {
          ...baseFilterRef.current,
          filters: {
            ...(baseFilterRef.current?.filters || {}),
            boundaryType: bl,
            [bl]: displayName,
          },
        },
      });
      setBoundaryLevel(toFilterCase(bl));
      internalDrillRef.current = true;
      onDrillDown?.({ type: bl, code: serviceCode || locationName, name: displayName, level: "level-two" });
    }
    if (level === 3) {
      const bl = getBoundaryTypeByLevel("level-three", boundaryLevelMap);
      // Mirror the activeFilter effect: base on baseFilterRef so the state filter
      // always uses the URL-resolved name ("Oyo") not whatever code may be in live filterStack.
      setFilterStack({
        value: {
          ...baseFilterRef.current,
          filters: {
            ...(baseFilterRef.current?.filters || {}),
            boundaryType: bl,
            [bl]: displayName,
          },
        },
      });
      setBoundaryLevel(toFilterCase(bl));
      internalDrillRef.current = true;
      onDrillDown?.({ type: bl, code: serviceCode || locationName, name: displayName, level: "level-three" });
    }

  };

  // ── Leaflet initialisation ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const satLayer = L.tileLayer(SATELLITE_TILE_URL, {
      attribution: "Tiles &copy; Esri",
      maxZoom: MAP_MAX_ZOOM,
    });
    const stdLayer = L.tileLayer(STANDARD_TILE_URL, {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: MAP_MAX_ZOOM,
    });

    // zoomControl: false — replaced by the custom "- % +" widget in the controls bar
    const map = L.map(mapDivRef.current, {
      center: [20, 78],
      zoom: MAP_INITIAL_ZOOM,
      layers: [stdLayer],
      zoomControl: false,
      // Thousands of cluster circles as SVG nodes drops pan/zoom to single-digit FPS.
      preferCanvas: true,
    });

    map.createPane(CLUSTER_PANE);
    map.getPane(CLUSTER_PANE).style.zIndex = String(CLUSTER_PANE_Z_INDEX);

    const syncZoom = () => setZoom(map.getZoom());
    map.on("zoomend", syncZoom);
    syncZoom();

    baseLayerRefs.current = { satellite: satLayer, standard: stdLayer };
    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.off("zoomend", syncZoom);
      map.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // ── GeoJSON layer — rebuild whenever mapData or chart data changes ─────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // No GeoJSON for this boundary — drop the previous boundary's layer so its polygons
    // don't sit under the "not available" message. Gated on the query having settled:
    // this query has no keepPreviousData, so mapData is undefined on every switch.
    if (!mapData?.geoJSON) {
      if (!isGeoLoading && geoJsonLayerRef.current) {
        geoJsonLayerRef.current.remove();
        geoJsonLayerRef.current = null;
      }
      return;
    }

    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
      geoJsonLayerRef.current = null;
    }

    const data = buildChartData();

    const layer = L.geoJSON(mapData.geoJSON, {
      style: (feature) => styleForValue(data[getTitleHeading(feature.properties?.name)]?.value),
      onEachFeature: (feature, featureLayer) => {
        const name = getTitleHeading(feature.properties?.name);
        const entry = data[name];
        const level = feature.properties?.level;
        const hasCoordinatesDown = feature.properties?.hasCoordinatesDown;
        const isHidden = filterFeature?.finalFilter && filterFeature.finalFilter !== name;

        // If filterFeature is set, hide non-matching features
        if (isHidden) {
          featureLayer.setStyle({ fillOpacity: 0, opacity: 0, interactive: false });
        }

        featureLayer.bindTooltip(buildTooltip(name, entry), { sticky: true, className: "digit-leaflet-tooltip" });

        // Hover highlight: brighter, heavier outline and a firmer fill, raised above its
        // neighbours so the outline is not clipped by the polygon drawn after it.
        if (!isHidden) {
          featureLayer.on("mouseover", () => {
            featureLayer.setStyle({ weight: BOUNDARY_HOVER_WEIGHT, color: BOUNDARY_HOVER_COLOR });
            featureLayer.bringToFront();
          });
          featureLayer.on("mouseout", () => {
            featureLayer.setStyle(styleForValue(entry?.value));
          });
        }

        featureLayer.on("click", () => featureClickRef.current(name, feature.properties?.name, level, hasCoordinatesDown));
      },
    });

    if (geoJsonVisibleRef.current) layer.addTo(map);

    geoJsonLayerRef.current = layer;

    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], animate: false });
    }
  }, [mapData, chartResponse, isGeoLoading]);

  // Moving to a different boundary invalidates any level-4 feature filter. This used to be
  // done by the drill-down chips' remove handler, which no longer exists.
  useEffect(() => {
    setFilterFeature(null);
  }, [activeFilter]);

  // Applies the boundaries-layer choice to Leaflet. Kept out of the click handler so the
  // control still toggles when no layer has been built yet (boundary with no GeoJSON).
  useEffect(() => {
    geoJsonVisibleRef.current = isGeoJsonVisible;
    const map = mapRef.current;
    const layer = geoJsonLayerRef.current;
    if (!map || !layer) return;
    if (isGeoJsonVisible) {
      layer.addTo(map);
    } else {
      layer.remove();
    }
  }, [isGeoJsonVisible]);


  // Re-style in place when the coverage range moves. Cheaper than rebuilding the layer,
  // and it preserves the current pan/zoom.
  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (!layer) return;
    const data = buildChartData();
    layer.eachLayer((featureLayer) => {
      const name = getTitleHeading(featureLayer.feature?.properties?.name);
      // leave features hidden by a level-4 feature filter alone
      if (filterFeature?.finalFilter && filterFeature.finalFilter !== name) return;
      featureLayer.setStyle(styleForValue(data[name]?.value));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverageRange, chartResponse]);

  // ── Panel boundary selection → filterStack + chart API + map zoom ─────────
  // Fires when activeFilter changes from outside (dropdown panel).
  // Skipped when the change originated internally (map click or chip removal)
  // since those handlers apply filterStack directly to avoid double-updates.
  useEffect(() => {
    if (internalDrillRef.current) {
      internalDrillRef.current = false;
      return;
    }
    if (!activeFilter) {
      setFilterStack({ value: baseFilterRef.current });
      setBoundaryLevel(boundaryType ? toFilterCase(boundaryType) : "");
      setMapSelector(nationalMap);
      return;
    }
    const { type, code, name } = activeFilter;
    const tName = code ? t(code) : null;
    const boundaryName = (tName && tName !== code) ? tName : (name || code);
    setFilterStack({
      value: {
        ...baseFilterRef.current,
        filters: {
          ...(baseFilterRef.current?.filters || {}),
          boundaryType: type,
          [type]: boundaryName,
        },
      },
    });
    // No chart bookkeeping here: selectedDepth changes as boundaryPath updates, and the
    // chain effect resolves chartKey from it. That is what makes the dropdown, the map and
    // the breadcrumb all land on the same chart for the same boundary.
  }, [activeFilter]);

  // ── Recenter ──────────────────────────────────────────────────────────────
  const handleRecenter = () => {
    const map = mapRef.current;
    const layer = geoJsonLayerRef.current;
    if (!map || !layer) return;
    const bounds = layer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
  };

  // ── Satellite / standard toggle ───────────────────────────────────────────
  const toggleLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    const { satellite, standard } = baseLayerRefs.current;
    if (isSatellite) {
      satellite.remove();
      standard.addTo(map);
    } else {
      standard.remove();
      satellite.addTo(map);
    }
    setIsSatellite((prev) => !prev);
  };

  const toggleGeoJson = () => setIsGeoJsonVisible((prev) => !prev);

  // ── Coverage range ────────────────────────────────────────────────────────
  const clampCoverage = (n) => {
    const num = Math.round(Number(n));
    return Number.isFinite(num) ? Math.max(0, Math.min(COVERAGE_MAX, num)) : 0;
  };
  const setCoverageMin = (v) => setCoverageRange(([, hi]) => [Math.min(clampCoverage(v), hi), hi]);
  const setCoverageMax = (v) => setCoverageRange(([lo]) => [lo, Math.max(clampCoverage(v), lo)]);
  const resetCoverageRange = () => setCoverageRange([0, COVERAGE_MAX]);
  const isCoverageDefault = coverageRange[0] === 0 && coverageRange[1] >= COVERAGE_MAX;

  // ── Zoom ──────────────────────────────────────────────────────────────────
  const zoomPercent = Math.round((zoom / MAP_MAX_ZOOM) * 100);
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  // Legend bounds for the cluster ramp. Not folded into the layer hook because that one is
  // imperative and never re-runs React's tree.
  const clusterRange = React.useMemo(() => {
    if (rendering.kind !== "clusters" || !rendering.rows.length) return null;
    let lo = Infinity;
    let hi = 0;
    rendering.rows.forEach((bucket) => {
      const count = Number(bucket?.c) || 0;
      if (count < lo) lo = count;
      if (count > hi) hi = count;
    });
    return Number.isFinite(lo) ? { lo, hi, cells: rendering.rows.length } : null;
  }, [rendering]);

  // Points are an overlay, so their fetch must not raise the blocking overlay — that would
  // grey the whole map out on every drill for a layer the user may not even have on.
  const isLoading = isGeoJsonLoading || isGeoLoading || isFetchingChart;
  const noGeoJson = !isLoading && !isGeoFetching && !mapData?.geoJSON;

  return (
    <div className="digit-leaflet-heatmap-container">
      <div className="digit-leaflet-map-wrapper">
        {/* Controls bar */}
        <div className="digit-leaflet-map-controls">
          <div className="digit-leaflet-zoom-control">
            <button
              className="digit-leaflet-zoom-btn"
              title={t("DSS_MAP_ZOOM_OUT")}
              aria-label={t("DSS_MAP_ZOOM_OUT")}
              onClick={handleZoomOut}
            >
              &#8722;
            </button>
            <span className="digit-leaflet-zoom-label">{zoomPercent}%</span>
            <button
              className="digit-leaflet-zoom-btn"
              title={t("DSS_MAP_ZOOM_IN")}
              aria-label={t("DSS_MAP_ZOOM_IN")}
              onClick={handleZoomIn}
            >
              +
            </button>
          </div>
          <Button
            type="button"
            label={t("DSS_MAP_RECENTRE")}
            title={t("DSS_MAP_RECENTRE")}
            variation="secondary"
            size="small"
            icon="AssistantNavigation"
            className="digit-heat-map-recenter"
            onClick={handleRecenter}
          />
          <div className="digit-leaflet-layers-wrap">
            <button
              className={`digit-leaflet-layers-btn${isLayersPanelOpen ? " digit-leaflet-layers-btn--active" : ""}`}
              title={t("DSS_MAP_LAYERS")}
              onClick={() => setIsLayersPanelOpen((p) => !p)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </button>
            {isLayersPanelOpen && (
              <div className="digit-leaflet-layers-panel">
                <div className="digit-leaflet-layers-group-label">{t("DSS_MAP_LAYERS_BASE")}</div>
                <button className="digit-leaflet-layers-item" onClick={toggleLayer}>
                  <span>{t("DSS_MAP_SATELLITE_VIEW")}</span>
                  {isSatellite ? EyeIcon : EyeOffIcon}
                </button>

                <div className="digit-leaflet-layers-group-label">{t("DSS_MAP_LAYERS_BOUNDARIES")}</div>
                <button className="digit-leaflet-layers-item" onClick={toggleGeoJson}>
                  <span>{t("DSS_MAP_POLYGON_LAYER")}</span>
                  {isGeoJsonVisible ? EyeIcon : EyeOffIcon}
                </button>

                {/* Coverage layers all paint the same polygons, so exactly one can be active.
                    Selecting the active one again turns coverage off, leaving outlines only. */}
                {coverageLayers.length > 0 && (
                  <React.Fragment>
                    <div className="digit-leaflet-layers-group-label">{t("DSS_MAP_LAYERS_COVERAGE")}</div>
                    {coverageLayers.map((layer, idx) => {
                      const labelKey = `DSS_TAB_${Digit.Utils.locale.getTransformedLocale(layer?.tabName || "")}`;
                      const label = t(labelKey) !== labelKey ? t(labelKey) : layer?.tabName || layer?.name;
                      const isActive = idx === activeCoverageIndex;
                      return (
                        <button
                          key={layer?.id || idx}
                          className="digit-leaflet-layers-item"
                          onClick={() => onCoverageChange?.(isActive ? -1 : idx)}
                        >
                          <span>{label}</span>
                          {isActive ? EyeIcon : EyeOffIcon}
                        </button>
                      );
                    })}
                  </React.Fragment>
                )}

                {/* Points sit on top of the polygons rather than replacing them, so this is
                    an independent choice from the coverage layer above. */}
                {pointLayers.length > 0 && (
                  <React.Fragment>
                    <div className="digit-leaflet-layers-group-label">{t("DSS_MAP_LAYERS_POINTS")}</div>
                    {pointLayers.map((layer, idx) => {
                      const labelKey = `DSS_TAB_${Digit.Utils.locale.getTransformedLocale(layer?.tabName || "")}`;
                      const label = t(labelKey) !== labelKey ? t(labelKey) : layer?.tabName || layer?.name;
                      const isActive = idx === activePointIndex;
                      return (
                        <button
                          key={layer?.id || idx}
                          className="digit-leaflet-layers-item"
                          onClick={() => setActivePointIndex(isActive ? -1 : idx)}
                        >
                          <span>{label}</span>
                          {isActive ? EyeIcon : EyeOffIcon}
                        </button>
                      );
                    })}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selection breadcrumb — click an ancestor to jump back up */}
        {boundaryPath?.length > 0 && (
          <div className="digit-leaflet-breadcrumb">
            {boundaryPath.map((crumb, idx) => {
              const isCurrent = idx === boundaryPath.length - 1;
              // Above the scope is unreachable (the dashboard is pinned to it), but the scope
              // crumb itself stays clickable so a drill-down can be undone from here.
              const isStatic = isCurrent || idx < scopeDepth;
              return (
                <React.Fragment key={crumb.level || idx}>
                  {idx > 0 && <span className="digit-leaflet-breadcrumb-sep">&rsaquo;</span>}
                  <button
                    className={`digit-leaflet-breadcrumb-item${isStatic ? " digit-leaflet-breadcrumb-item--current" : ""}`}
                    title={crumb.label}
                    disabled={isStatic}
                    onClick={() => onBreadcrumbClick?.(idx)}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Non-blocking: the point layer refreshing must not hide the map beneath it */}
        {!isLoading && isFetchingPoints && activePointIndex >= 0 && (
          <div className="digit-leaflet-points-status">{t("DSS_MAP_LOADING_POINTS")}</div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="digit-leaflet-loader-overlay">
            <Loader className="digit-center-loader" />
          </div>
        )}

        {noGeoJson && (
          <div className="digit-leaflet-message-overlay">
            <span className="digit-leaflet-message-pill">{t("DSS_MAP_GEOJSON_NOT_AVAILABLE")}</span>
          </div>
        )}

        {/* Map container — always mounted so Leaflet instance persists */}
        <div ref={mapDivRef} className="digit-leaflet-map" style={{ minHeight: "460px" }} />
      </div>

      {/* Coverage range filter — highlights only boundaries inside the selected band */}
      {!isLoading && !noGeoJson && (
        <div className="digit-leaflet-coverage-filter">
          <div className="digit-leaflet-range-stepper">
            <button
              type="button"
              className="digit-leaflet-range-step"
              aria-label={t("DSS_MAP_COVERAGE_MIN")}
              onClick={() => setCoverageMin(coverageRange[0] + COVERAGE_STEP)}
              disabled={coverageRange[0] >= coverageRange[1]}
            >
              +
            </button>
            <button
              type="button"
              className="digit-leaflet-range-step"
              aria-label={t("DSS_MAP_COVERAGE_MIN")}
              onClick={() => setCoverageMin(coverageRange[0] - COVERAGE_STEP)}
              disabled={coverageRange[0] <= 0}
            >
              &#8722;
            </button>
          </div>
          <input
            type="number"
            min="0"
            max={COVERAGE_MAX}
            value={coverageRange[0]}
            aria-label={t("DSS_MAP_COVERAGE_MIN")}
            className="digit-leaflet-range-number"
            onChange={(e) => setCoverageMin(e.target.value)}
          />

          <div className="digit-leaflet-range-track">
            <div
              className="digit-leaflet-range-fill"
              style={{ left: `${coverageRange[0]}%`, right: `${100 - coverageRange[1]}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={coverageRange[0]}
              aria-label={t("DSS_MAP_COVERAGE_MIN")}
              className="digit-leaflet-range-input"
              onChange={(e) => setCoverageRange(([, hi]) => [Math.min(Number(e.target.value), hi), hi])}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={coverageRange[1]}
              aria-label={t("DSS_MAP_COVERAGE_MAX")}
              className="digit-leaflet-range-input"
              onChange={(e) => setCoverageRange(([lo]) => [lo, Math.max(Number(e.target.value), lo)])}
            />
          </div>

          <input
            type="number"
            min="0"
            max={COVERAGE_MAX}
            value={coverageRange[1]}
            aria-label={t("DSS_MAP_COVERAGE_MAX")}
            // at the top of the scale the bound is open-ended, so >100% stays highlighted
            title={coverageRange[1] >= COVERAGE_MAX ? t("DSS_MAP_COVERAGE_INCLUDES_OVER") : undefined}
            className="digit-leaflet-range-number"
            onChange={(e) => setCoverageMax(e.target.value)}
          />
          <div className="digit-leaflet-range-stepper">
            <button
              type="button"
              className="digit-leaflet-range-step"
              aria-label={t("DSS_MAP_COVERAGE_MAX")}
              onClick={() => setCoverageMax(coverageRange[1] + COVERAGE_STEP)}
              disabled={coverageRange[1] >= COVERAGE_MAX}
            >
              +
            </button>
            <button
              type="button"
              className="digit-leaflet-range-step"
              aria-label={t("DSS_MAP_COVERAGE_MAX")}
              onClick={() => setCoverageMax(coverageRange[1] - COVERAGE_STEP)}
              disabled={coverageRange[1] <= coverageRange[0]}
            >
              &#8722;
            </button>
          </div>

          <button
            type="button"
            className="digit-leaflet-range-reset"
            onClick={resetCoverageRange}
            disabled={isCoverageDefault}
          >
            {t("DSS_MAP_COVERAGE_RESET")}
          </button>
        </div>
      )}

      {/* Gradient legend */}
      {!isLoading && !noGeoJson && (
        <div className="digit-leaflet-gradient-scale">
          <span className="digit-leaflet-gradient-label">0%</span>
          <div className="digit-leaflet-gradient-bar" />
          <span className="digit-leaflet-gradient-label">100%</span>
        </div>
      )}

      {/* Point-layer legend. Clusters get the density ramp; individual households get a count,
          because there is no magnitude to encode once every dot is one household. */}
      {activePointIndex >= 0 && clusterRange && (
        <div className="digit-leaflet-cluster-legend">
          <span className="digit-leaflet-gradient-label">{clusterRange.lo.toLocaleString()}</span>
          <div className="digit-leaflet-cluster-legend-bar" />
          <span className="digit-leaflet-gradient-label">{clusterRange.hi.toLocaleString()}</span>
          <span className="digit-leaflet-cluster-legend-caption">
            {t("DSS_MAP_HOUSEHOLDS_PER_CLUSTER")} &middot; {clusterRange.cells.toLocaleString()}{" "}
            {t("DSS_MAP_CLUSTERS")}
            {/* geotile_grid has no "everything else" counter, so a full bucket list is the only
                truncation signal there is. A silently clipped map reads as a complete one. */}
            {rendering.truncated ? ` · ${t("DSS_MAP_DENSEST_ONLY")}` : ""}
          </span>
        </div>
      )}

      {activePointIndex >= 0 && rendering.kind === "points" && rendering.rows.length > 0 && (
        <div className="digit-leaflet-cluster-legend">
          <span className="digit-leaflet-cluster-legend-dot" />
          <span className="digit-leaflet-cluster-legend-caption">
            {t("DSS_MAP_SHOWING_ALL_HOUSEHOLDS")} &middot; {rendering.total.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default LeafletHeatMap;
