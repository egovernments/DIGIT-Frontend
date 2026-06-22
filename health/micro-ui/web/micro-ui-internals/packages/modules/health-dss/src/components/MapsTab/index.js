import React, { useState, useCallback, useContext } from "react";
import FilterContext from "../FilterContext";
import BoundaryFilters from "./BoundaryFilters";
import LeafletHeatMap from "./LeafletHeatMap";

const MapsTab = ({ chartId, visualizer, pageZoom }) => {
  const { value } = useContext(FilterContext);
  const [selectedBoundary, setSelectedBoundary] = useState(null);

  const handleBoundarySelect = useCallback((boundary) => {
    setSelectedBoundary(boundary);
  }, []);

  return (
    <div className="digit-maps-tab-wrapper">
      <BoundaryFilters onSelect={handleBoundarySelect} />
      <LeafletHeatMap
        chartId={chartId}
        visualizer={visualizer}
        selectedBoundary={selectedBoundary}
        pageZoom={pageZoom}
        filterContextValue={value}
      />
    </div>
  );
};

export default MapsTab;
