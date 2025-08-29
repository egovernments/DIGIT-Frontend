import React, { useState, useEffect } from "react";
import MapView from "./MapView";

/**
 * Component to display LGA Boundaries from S3
 */
const LGABoundariesMap = ({ visits = [], showConnectingLines = false, customPopupContent = null, customMarkerStyle = null }) => {
  const [boundaryData, setBoundaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LGA Boundaries GeoJSON URL
  // const LGA_BOUNDARIES_URL = "https://hcm-demo-assets.s3.ap-south-1.amazonaws.com/geojson/LGA_Boundaries.geojson";
  const LGA_BOUNDARIES_URL = "https://hcm-demo-assets.s3.ap-south-1.amazonaws.com/geojson/Ondo_LGA_Boundaries.geojson";
  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(LGA_BOUNDARIES_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch boundaries: ${response.status}`);
        }
        
        const data = await response.json();
        setBoundaryData(data);
        

      } catch (err) {
        console.error("Error loading LGA boundaries:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoundaries();
  }, []);

  // Custom styling for LGA boundaries
  const lgaBoundaryStyle = {
    color: '#2E7D32',           // Dark green outline
    weight: 2,                  // Medium line thickness
    opacity: 0.9,               // Slightly transparent line
    fillColor: '#4CAF50',       // Light green fill
    fillOpacity: 0.15,          // Very transparent fill
    dashArray: null,            // Solid line
    showPopup: true,            // Show LGA info on click
    enableHover: true,          // Highlight on hover
    fitBounds: true             // Fit map to show all LGAs
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
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading LGA Boundaries...</p>
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
        backgroundColor: '#ffebee',
        color: '#c62828',
        borderRadius: '4px',
        margin: '1rem'
      }}>
        <h3>Error Loading LGA Boundaries</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#c62828',
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
        backgroundColor: '#E8F5E9',
        borderBottom: '2px solid #4CAF50'
      }}>
        <h2 style={{ margin: 0, color: '#2E7D32' }}>LGA Boundaries Map</h2>
        {boundaryData?.features && (
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
            Showing {boundaryData.features.length} Local Government Areas
          </p>
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <MapView
          visits={visits}
          shapefileData={boundaryData}
          boundaryStyle={lgaBoundaryStyle}
          showConnectingLines={showConnectingLines}
          customPopupContent={customPopupContent}
          customMarkerStyle={customMarkerStyle}
        />
      </div>
    </div>
  );
};

export default LGABoundariesMap;