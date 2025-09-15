import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";

/**
 * Wrapper component for MapComponent that handles proper cleanup
 * to prevent "Map container is already initialized" errors
 */
const MapComponentWrapper = ({ projectId, userName, hideHeader = false, key }) => {
  const [mapKey, setMapKey] = useState(Date.now());

  // Force remount when props change
  useEffect(() => {
    setMapKey(Date.now());
  }, [projectId, userName]);

  // Use a unique container ID to avoid conflicts
  const containerId = `map-container-${mapKey}`;

  return (
    <div key={mapKey} id={containerId} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MapComponent 
        projectId={projectId} 
        userName={userName}
        mapContainerId={containerId}
        hideHeader={hideHeader}
      />
    </div>
  );
};

export default MapComponentWrapper;