import React, { useState } from "react";
import BoundaryFilters from "./BoundaryFilters";
import LeafletHeatMap from "./LeafletHeatMap";

const MapsTab = ({ chartId, visualizer, pageZoom }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <div className="digit-maps-tab-wrapper">
      <BoundaryFilters activeFilter={activeFilter} onSelect={setActiveFilter} />
      <LeafletHeatMap
        chartId={chartId}
        visualizer={visualizer}
        activeFilter={activeFilter}
        onDrillDown={setActiveFilter}
        pageZoom={pageZoom}
      />
    </div>
  );
};

export default MapsTab;
