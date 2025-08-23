import React, { useState, useEffect } from "react";
import MapView from "./MapView";

/**
 * Component to display Ward Boundaries from S3
 */
const WardBoundariesMap = ({ visits = [], showConnectingLines = false, customPopupContent = null, customMarkerStyle = null }) => {
  const [boundaryData, setBoundaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ward Boundaries GeoJSON URL
  // const WARD_BOUNDARIES_URL = "https://hcm-demo-assets.s3.ap-south-1.amazonaws.com/geojson/Ward_Boundaries.json";
  /* The line `// const WARD_BOUNDARIES_URL =
  "https://hcm-demo-assets.s3.ap-south-1.amazonaws.com/geojson/Ward_Boundaries.json";` is a
  commented-out declaration of a constant variable named `WARD_BOUNDARIES_URL` that holds the URL
  pointing to a GeoJSON file containing Ward Boundaries data. */
  const WARD_BOUNDARIES_URL = "https://hcm-demo-assets.s3.ap-south-1.amazonaws.com/geojson/Ondo_Ward_Boundaries.geojson";

  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(WARD_BOUNDARIES_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ward boundaries: ${response.status}`);
        }
        
        const data = await response.json();
        setBoundaryData(data);
        
        // Log some info about the loaded data
        console.log("Ward Boundaries loaded:", {
          type: data.type,
          featuresCount: data.features?.length,
          firstFeatureProperties: data.features?.[0]?.properties
        });
        
      } catch (err) {
        console.error("Error loading Ward boundaries:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoundaries();
  }, []);

  // Custom styling for Ward boundaries
  const wardBoundaryStyle = {
    color: '#7B1FA2',           // Purple outline
    weight: 1.5,                // Slightly thinner than LGA
    opacity: 0.8,               // Slightly transparent line
    fillColor: '#BA68C8',       // Light purple fill
    fillOpacity: 0.12,          // Very transparent fill
    dashArray: null,            // Solid line
    showPopup: true,            // Show Ward info on click
    enableHover: true,          // Highlight on hover
    fitBounds: true             // Fit map to show all Wards
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #7B1FA2',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading Ward Boundaries...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#fce4ec',
        color: '#880e4f',
        borderRadius: '4px',
        margin: '1rem'
      }}>
        <h3>Error Loading Ward Boundaries</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#880e4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '1rem',
        backgroundColor: '#F3E5F5',
        borderBottom: '2px solid #BA68C8'
      }}>
        <h2 style={{ margin: 0, color: '#7B1FA2' }}>Ward Boundaries Map</h2>
        {boundaryData?.features && (
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
            Showing {boundaryData.features.length} Wards
          </p>
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <MapView
          visits={visits}
          shapefileData={boundaryData}
          boundaryStyle={wardBoundaryStyle}
          showConnectingLines={showConnectingLines}
          customPopupContent={customPopupContent}
          customMarkerStyle={customMarkerStyle}
        />
      </div>
    </div>
  );
};

export default WardBoundariesMap;