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

  // The layers panel's own view preferences, held here rather than inside LeafletHeatMap so
  // they are owned by the same component as activeCoverageIndex and cannot drift out of sync
  // with it.
  const [isSatellite, setIsSatellite] = useState(false);
  const [isGeoJsonVisible, setIsGeoJsonVisible] = useState(true);
  // Defaults to the first point layer so a dashboard that configures one shows it without
  // the user having to find the layers panel.
  const [activePointIndex, setActivePointIndex] = useState(pointLayers.length ? 0 : -1);
  const activeChart = activeCoverageIndex >= 0 ? coverageLayers[activeCoverageIndex] : undefined;

  // Full ancestor chain of the current selection, published by BoundaryFilters and
  // rendered as a breadcrumb over the map.
  const [boundaryPath, setBoundaryPath] = useState([]);

  // Jumping to the root crumb clears the filter entirely — LeafletHeatMap reads a null
  // filter as "reset to the national map", which a level-one filter would not do.
  const handleBreadcrumbClick = (index) => {
    setActiveFilter(index === 0 ? null : boundaryPath[index]);
  };

  // Every coverage layer paints the same polygons, so switching between them is a recolour,
  // not a navigation — the drill-down, the pan and the zoom all stay where the user left
  // them. This is what Layout.js means by putting these in a panel rather than in chips:
  // "switching layer must not reset the view". It used to remount both children to clear the
  // drill-down, which tore down and rebuilt the Leaflet instance along with it.
  const handleCoverageChange = (index) => setActiveCoverageIndex(index);

  return (
    <div className="digit-leaflet-map-chart">
      <BoundaryFilters
        activeFilter={activeFilter}
        onSelect={setActiveFilter}
        onPathChange={setBoundaryPath}
      />
      {/* chartType decides the renderer; both share the boundary panel above. */}
      <LeafletHeatMap
        chartId={activeChart?.id}
        visualizer={activeChart}
        chartType={activeChart?.chartType}
        coverageLayers={coverageLayers}
        activeCoverageIndex={activeCoverageIndex}
        onCoverageChange={handleCoverageChange}
        pointLayers={pointLayers}
        activePointIndex={activePointIndex}
        onPointLayerChange={setActivePointIndex}
        isSatellite={isSatellite}
        onSatelliteChange={setIsSatellite}
        isGeoJsonVisible={isGeoJsonVisible}
        onGeoJsonVisibleChange={setIsGeoJsonVisible}
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
