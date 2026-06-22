import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { scaleQuantile } from "d3-scale";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader, Chip, Button } from "@egovernments/digit-ui-components";
import FilterContext from "../FilterContext";
import { getTitleHeading } from "../../utils/locale";
import { getDuration } from "../../utils/getDuration";
import { getQueryParam } from "../../utils/getQueryParam";
import { isLevelOneBoundary } from "../../utils/isLevelOneBoundary";
import { getBoundaryTypeByLevel } from "../../utils/getBoundaryTypeByLevel";
import NoData from "../NoData";

const SATELLITE_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const STANDARD_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const COLOR_RANGE = ["#FF7373", "#FF8565", "#FFC42E", "#FFAA45", "#9ACC49", "#01D66F"];

const toFilterCase = (str) => (str ? str.toLowerCase() : str);

const LeafletHeatMap = ({ chartId, visualizer, selectedBoundary, pageZoom }) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const copyOfValue = Object.assign({}, value);

  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const baseLayerRefs = useRef({ satellite: null, standard: null });

  const [isSatellite, setIsSatellite] = useState(true);

  const boundaryType = getQueryParam("boundaryType");
  const boundaryValue = getQueryParam("boundaryValue");
  const boundaryLevelMap = Digit.SessionStorage.get("levelMap") || {};
  const { campaignNumber } = Digit.Hooks.useQueryParams();

  const projectSelected = Digit.SessionStorage.get("projectSelected");
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
  const [drillDownChart, setDrillDownChart] = useState("none");
  const [chartKey, setChartKey] = useState(chartId);
  const [drillDownStack, setDrillDownStack] = useState([
    { id: chartId, label: mapSelector, boundary: boundaryLevel },
  ]);

  const colorScale = scaleQuantile().domain([0, 100]).range(COLOR_RANGE);

  // ── GeoJSON loading ──────────────────────────────────────────────────────
  const { data: geoJsonConfig, isLoading: isGeoJsonLoading } = Digit.Hooks.useCustomMDMS(
    Digit?.ULBService?.getStateId(),
    "map-config",
    [{ name: "GeoJsonMapping" }],
    {},
    { schemaCode: "map-config.GeoJsonMapping" }
  );

  const { isLoading: isGeoLoading, data: mapData } = Digit.Hooks.DSS.useDSSGeoJson(
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
        filters: {
          ...filterStack?.value?.filters,
          ...filterFeature,
          campaignNumber,
        },
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

  useEffect(() => {
    if (chartKey) {
      setDrillDownChart(chartResponse?.responseData?.drillDownChartId || "none");
    }
  }, [chartResponse, chartKey]);

  const buildChartData = useCallback(() => {
    const result = {};
    chartResponse?.responseData?.data?.forEach((item) => {
      const pct = item.plots?.find((p) => p.symbol === "percentage")?.value;
      result[getTitleHeading(item.headerName)] = pct;
    });
    return result;
  }, [chartResponse]);

  // ── Drill-down logic (mirrors HeatMapChart / Map.js) ─────────────────────
  useEffect(() => {
    setChartKey(chartId);
  }, [filterStack, chartId]);

  useEffect(() => {
    if (drillDownStack?.length > 0) {
      setChartKey(drillDownStack[drillDownStack.length - 1].id);
      setDrillDownChart("none");
    }
  }, [drillDownStack]);

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

  // A ref updated on every render so Leaflet click handlers never go stale.
  // This avoids the stale-closure problem where event handlers bound during
  // layer construction keep capturing old drillDownChart / boundaryLevelMap values.
  const featureClickRef = useRef(null);
  featureClickRef.current = (locationName, level, hasCoordinatesDown) => {
    if (drillDownChart === "none") return;
    if (!hasCoordinatesDown) {
      if (level === 4) setFilterFeature({ finalFilter: locationName });
      else return;
    }

    if (level === 2) {
      const bl = getBoundaryTypeByLevel("level-two", boundaryLevelMap);
      setFilterStack({ value: { filters: { boundaryType: bl, [bl]: locationName } } });
      setBoundaryLevel(toFilterCase(bl));
    }
    if (level === 3) {
      const bl = getBoundaryTypeByLevel("level-three", boundaryLevelMap);
      setFilterStack((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          filters: {
            ...prev.value?.filters,
            boundaryType: bl,
            [bl]: locationName,
          },
        },
      }));
      setBoundaryLevel(toFilterCase(bl));
    }

    setChartKey(drillDownChart);
    setDrillDownStack((prev) => [
      ...prev,
      {
        id: drillDownChart,
        label: locationName,
        boundary:
          level === 2
            ? getBoundaryTypeByLevel("level-two", boundaryLevelMap)
            : level === 3
            ? getBoundaryTypeByLevel("level-three", boundaryLevelMap)
            : level === 4
            ? getBoundaryTypeByLevel("level-four", boundaryLevelMap)
            : "",
      },
    ]);
  };

  const removeDrillStack = (id) => {
    if (filterFeature) setFilterFeature(null);
    const removed = drillDownStack.filter((_, i) => i >= id);
    const kept = drillDownStack.filter((_, i) => i < id);
    setDrillDownStack(kept);
    setChartKey(kept[kept.length - 1].id);
    setMapSelector(kept[kept.length - 1].label);
    let fs = { ...filterStack };
    removed.forEach((f) => {
      if (fs?.value?.filters) delete fs.value.filters[f.boundary?.toLowerCase()];
    });
    if (fs.value?.filters) delete fs.value.filters.boundaryType;
    if (Object.keys(fs.value?.filters || {}).length === 0) fs.value = undefined;
    setFilterStack(fs);
  };

  // ── Leaflet initialisation ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const satLayer = L.tileLayer(SATELLITE_TILE_URL, {
      attribution: "Tiles &copy; Esri",
      maxZoom: 19,
    });
    const stdLayer = L.tileLayer(STANDARD_TILE_URL, {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    });

    const map = L.map(mapDivRef.current, {
      center: [20, 78],
      zoom: 5,
      layers: [satLayer],
    });

    baseLayerRefs.current = { satellite: satLayer, standard: stdLayer };
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── GeoJSON layer — rebuild whenever mapData or chart data changes ─────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapData?.geoJSON) return;

    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
      geoJsonLayerRef.current = null;
    }

    const data = buildChartData();

    const layer = L.geoJSON(mapData.geoJSON, {
      style: (feature) => {
        const name = getTitleHeading(feature.properties?.name);
        const value = data[name];
        return {
          fillColor: value !== undefined ? colorScale(value) : "#F0E8E8",
          weight: 1,
          opacity: 1,
          color: "#C6C6C6",
          fillOpacity: 0.7,
        };
      },
      onEachFeature: (feature, featureLayer) => {
        const name = getTitleHeading(feature.properties?.name);
        const value = data[name];
        const level = feature.properties?.level;
        const hasCoordinatesDown = feature.properties?.hasCoordinatesDown;

        // If filterFeature is set, hide non-matching features
        if (filterFeature?.finalFilter && filterFeature.finalFilter !== name) {
          featureLayer.setStyle({ fillOpacity: 0, opacity: 0, interactive: false });
        }

        featureLayer.bindTooltip(
          `<strong>${name}</strong>${
            value !== undefined
              ? `<br/>${Digit.Utils.dss.formatter(value, "percentage", value?.denomination, true, (k) => k)}`
              : ""
          }`,
          { sticky: true, className: "digit-leaflet-tooltip" }
        );

        featureLayer.on("click", () => featureClickRef.current(name, level, hasCoordinatesDown));
      },
    }).addTo(map);

    geoJsonLayerRef.current = layer;

    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], animate: false });
    }
  }, [mapData, chartResponse]);

  // ── Panel boundary selection → filterStack + chart API + map zoom ─────────
  // When a boundary is picked from the filter panel, push it into filterStack so:
  //   1. The chart API is called with the new boundary filter
  //   2. The existing filterStack → mapSelector effect reloads the GeoJSON for that level
  //   3. The GeoJSON rebuild effect calls fitBounds, zooming the map automatically
  useEffect(() => {
    if (!selectedBoundary) {
      // Cleared — reset to the base national view
      setFilterStack({ value: baseFilterRef.current });
      setBoundaryLevel(boundaryType ? toFilterCase(boundaryType) : "");
      setMapSelector(nationalMap);
      setDrillDownStack([{ id: chartId, label: nationalMap, boundary: boundaryType || "" }]);
      return;
    }
    const { type, code } = selectedBoundary;
    setFilterStack({
      value: {
        ...baseFilterRef.current,
        filters: {
          ...(baseFilterRef.current?.filters || {}),
          boundaryType: type,
          [type]: code,
        },
      },
    });
    setDrillDownStack([{ id: chartId, label: code, boundary: type }]);
  }, [selectedBoundary]);

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

  const isLoading = isGeoJsonLoading || isGeoLoading || isFetchingChart;
  const noData = !isLoading && !mapData?.geoJSON;

  return (
    <div className="digit-leaflet-heatmap-container">
      {/* Drill-down breadcrumb chips */}
      {drillDownStack?.length > 1 && (
        <div className="digit-tag-container">
          <div className="digit-tag-filter-text">{t("DSS_FILTERS_APPLIED")}: </div>
          {drillDownStack.map((filter, id) =>
            id > 0 ? (
              <Chip
                key={id}
                text={`${t(
                  `DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(filter.boundary)}`
                )}: ${filter.label && getTitleHeading(filter.label)}`}
                hideClose={false}
                onClick={() => removeDrillStack(id)}
              />
            ) : null
          )}
        </div>
      )}

      <div className="digit-leaflet-map-wrapper">
        {/* Controls bar */}
        <div className="digit-leaflet-map-controls">
          <Button
            type="button"
            label={isSatellite ? t("DSS_MAP_STANDARD_VIEW") : t("DSS_MAP_SATELLITE_VIEW")}
            variation="secondary"
            size="small"
            onClick={toggleLayer}
          />
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
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="digit-leaflet-loader-overlay">
            <Loader className="digit-center-loader" />
          </div>
        )}

        {noData && <NoData t={t} />}

        {/* Map container — always mounted so Leaflet instance persists */}
        <div
          ref={mapDivRef}
          className="digit-leaflet-map"
          style={{ visibility: noData ? "hidden" : "visible", minHeight: "460px" }}
        />
      </div>

      {/* Gradient legend */}
      {!isLoading && !noData && (
        <div className="digit-leaflet-gradient-scale">
          <span className="digit-leaflet-gradient-label">0%</span>
          <div className="digit-leaflet-gradient-bar" />
          <span className="digit-leaflet-gradient-label">100%</span>
        </div>
      )}
    </div>
  );
};

export default LeafletHeatMap;
