import React, { useState } from "react";
import BoundaryFilters from "./BoundaryFilters";
import LeafletHeatMap from "./LeafletHeatMap";

// Matches the literal chartType comparisons in Layout.js and L2Main.js.
const POINT_CHART_TYPE = "leafletCoordinateMap";

const LeafletMapChart = ({ charts = [], pageZoom }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  // Two kinds of chart share this map and they compose rather than compete:
  // coverage layers paint the polygons, point layers scatter clusters on top of them.
  const coverageLayers = charts.filter((c) => c?.chartType !== POINT_CHART_TYPE);
  const pointLayers = charts.filter((c) => c?.chartType === POINT_CHART_TYPE);

  // Which coverage layer paints the polygons. -1 means none — outlines only.
  // Coverage layers are mutually exclusive because they all fill the same polygons.
  const [activeCoverageIndex, setActiveCoverageIndex] = useState(0);
  const activeChart = activeCoverageIndex >= 0 ? coverageLayers[activeCoverageIndex] : undefined;

  // Full ancestor chain of the current selection, published by BoundaryFilters and
  // rendered as a breadcrumb over the map.
  const [boundaryPath, setBoundaryPath] = useState([]);

  // Bumped on every coverage-layer change to force a remount of both children below.
  const [layerResetKey, setLayerResetKey] = useState(0);

  // Jumping to the root crumb clears the filter entirely — LeafletHeatMap reads a null
  // filter as "reset to the national map", which a level-one filter would not do.
  const handleBreadcrumbClick = (index) => {
    setActiveFilter(index === 0 ? null : boundaryPath[index]);
  };

  // Switching coverage layer resets everything: the boundary drill-down returns to the URL
  // scope, the Leaflet instance re-initialises (recentring and clearing pan/zoom) and the
  // coverage range filter clears. Clearing the shared state here as well as remounting,
  // because activeFilter/boundaryPath live in this component and a child remount alone
  // would leave them holding the previous layer's drill-down.
  const handleCoverageChange = (index) => {
    setActiveCoverageIndex(index);
    setActiveFilter(null);
    setBoundaryPath([]);
    setLayerResetKey((k) => k + 1);
  };

  return (
    <div className="digit-leaflet-map-chart">
      <BoundaryFilters
        key={`filters-${layerResetKey}`}
        activeFilter={activeFilter}
        onSelect={setActiveFilter}
        onPathChange={setBoundaryPath}
      />
      {/* chartType decides the renderer; both share the boundary panel above. */}
      <LeafletHeatMap
        key={`map-${layerResetKey}`}
        chartId={activeChart?.id}
        visualizer={activeChart}
        chartType={activeChart?.chartType}
        coverageLayers={coverageLayers}
        activeCoverageIndex={activeCoverageIndex}
        onCoverageChange={handleCoverageChange}
        pointLayers={pointLayers}
        activeFilter={activeFilter}
        onDrillDown={setActiveFilter}
        boundaryPath={boundaryPath}
        onBreadcrumbClick={handleBreadcrumbClick}
        pageZoom={pageZoom}
      />
    </div>
  );
};

export default LeafletMapChart;
