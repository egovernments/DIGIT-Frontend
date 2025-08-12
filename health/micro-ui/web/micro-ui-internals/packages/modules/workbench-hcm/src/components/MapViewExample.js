import React, { useState } from "react";
import MapView from "./MapView";
import LGABoundariesMap from "./LGABoundariesMap";

/**
 * Example component showing different ways to use the MapView with your LGA boundaries
 */
const MapViewExample = () => {
  const [viewMode, setViewMode] = useState("boundaries"); // "boundaries", "visits", "both"
  
  // Sample visit data (replace with your actual data)
  const sampleVisits = [
    { lat: 9.0579, lng: 7.4951, time: "2024-01-15 09:00:00" }, // Abuja
    { lat: 6.5244, lng: 3.3792, time: "2024-01-15 10:30:00" }, // Lagos
    { lat: 7.3775, lng: 3.9470, time: "2024-01-15 14:15:00" }, // Ibadan
  ];
  
  // LGA Boundaries URL
  const [boundaryData, setBoundaryData] = useState(null);
  const [loadingBoundaries, setLoadingBoundaries] = useState(false);
  
  const loadLGABoundaries = async () => {
    setLoadingBoundaries(true);
    try {
      const response = await fetch("https://hcm-demo-assets.s3.ap-south-1.amazonaws.com/geojson/LGA_Boundaries.geojson");
      const data = await response.json();
      setBoundaryData(data);
    } catch (error) {
      console.error("Error loading LGA boundaries:", error);
    }
    setLoadingBoundaries(false);
  };
  
  const customBoundaryStyle = {
    color: '#FF5722',           // Orange outline
    weight: 1.5,                // Thin lines
    opacity: 0.8,               // Semi-transparent
    fillColor: '#FFC107',       // Yellow fill
    fillOpacity: 0.1,           // Very light fill
    showPopup: true,            // Show LGA details on click
    enableHover: true,          // Hover effects
    fitBounds: viewMode === "boundaries" // Only fit bounds when showing boundaries alone
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Control Panel */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Map View Options:</h3>
        
        <button
          onClick={() => setViewMode("boundaries")}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: viewMode === "boundaries" ? '#4CAF50' : '#fff',
            color: viewMode === "boundaries" ? 'white' : '#333',
            border: '1px solid #4CAF50',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          LGA Boundaries Only
        </button>
        
        <button
          onClick={() => setViewMode("visits")}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: viewMode === "visits" ? '#2196F3' : '#fff',
            color: viewMode === "visits" ? 'white' : '#333',
            border: '1px solid #2196F3',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Visits Only
        </button>
        
        <button
          onClick={() => setViewMode("both")}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: viewMode === "both" ? '#9C27B0' : '#fff',
            color: viewMode === "both" ? 'white' : '#333',
            border: '1px solid #9C27B0',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Both
        </button>
        
        {!boundaryData && (
          <button
            onClick={loadLGABoundaries}
            disabled={loadingBoundaries}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loadingBoundaries ? 'not-allowed' : 'pointer',
              opacity: loadingBoundaries ? 0.6 : 1
            }}
          >
            {loadingBoundaries ? 'Loading...' : 'Load Boundaries'}
          </button>
        )}
      </div>
      
      {/* Map Display */}
      <div style={{ flex: 1 }}>
        {viewMode === "boundaries" && (
          <LGABoundariesMap visits={[]} />
        )}
        
        {viewMode === "visits" && (
          <MapView visits={sampleVisits} />
        )}
        
        {viewMode === "both" && (
          <MapView
            visits={sampleVisits}
            shapefileData={boundaryData}
            boundaryStyle={customBoundaryStyle}
          />
        )}
      </div>
      
      {/* Info Panel */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #ddd',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <p style={{ margin: 0 }}>
          <strong>Current View:</strong> {
            viewMode === "boundaries" ? "LGA Boundaries from S3" :
            viewMode === "visits" ? "Sample visit points" :
            "Both boundaries and visits"
          }
        </p>
        {boundaryData && (
          <p style={{ margin: '0.5rem 0 0 0' }}>
            <strong>Loaded:</strong> {boundaryData.features?.length} LGA boundaries
          </p>
        )}
      </div>
    </div>
  );
};

export default MapViewExample;