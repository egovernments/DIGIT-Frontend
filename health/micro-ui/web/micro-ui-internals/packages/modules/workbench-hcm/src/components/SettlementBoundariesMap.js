import React, { useState, useEffect } from "react";
import MapView from "./MapView";
import { getGeoJsonUrl } from "../utils/getProjectServiceUrl";

const SettlementBoundariesMap = ({ visits = [], showConnectingLines = false, customPopupContent = null, customMarkerStyle = null }) => {
  const [boundaryData, setBoundaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SETTLEMENT_BOUNDARIES_URL =  getGeoJsonUrl("settlement")||"https://hcm-demo-assets.s3.ap-south-1.amazonaws.com/geojson/ondo_settlement.geojson";

  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(SETTLEMENT_BOUNDARIES_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch settlement boundaries: ${response.status}`);
        }
        
        const data = await response.json();
        setBoundaryData(data);
        
      } catch (err) {
        console.error("Error loading Settlement boundaries:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoundaries();
  }, []);

  const settlementBoundaryStyle = {
    color: '#AD1457',           // Darker pink/magenta outline
    weight: 3,                  // Thicker border
    opacity: 1,                 // Full opacity
    fillColor: '#E91E63',       // Darker pink fill
    fillOpacity: 0.8,           // Much more visible background
    dashArray: '8, 4',          // More prominent dashed pattern
  };

  const boundaryPopupContent = (feature) => {
    const properties = feature?.properties || {};
    return `
      <div style="padding: 8px; min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; color: #AD1457; font-size: 14px; font-weight: bold;">
          Settlement Boundary
        </h4>
        <div style="font-size: 12px; line-height: 1.4;">
          ${Object.entries(properties).map(([key, value]) => 
            `<div><strong>${key}:</strong> ${value || 'N/A'}</div>`
          ).join('')}
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '1.1rem', color: '#AD1457' }}>Loading Settlement Boundaries...</div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #AD1457',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: '#fff3e0',
        border: '1px solid #ffcc80',
        borderRadius: '8px',
        margin: '1rem'
      }}>
        <h3 style={{ color: '#e65100', marginBottom: '0.5rem' }}>Settlement Boundaries Unavailable</h3>
        <p style={{ color: '#bf360c', marginBottom: '1rem' }}>Failed to load settlement boundary data</p>
        <div style={{ fontSize: '0.9rem', color: '#8d6e63', fontFamily: 'monospace' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <MapView
      visits={visits}
      boundaryData={boundaryData}
      boundaryStyle={settlementBoundaryStyle}
      boundaryPopupContent={boundaryPopupContent}
      showConnectingLines={showConnectingLines}
      customPopupContent={customPopupContent}
      customMarkerStyle={customMarkerStyle}
      mapType="settlement"
    />
  );
};

export default SettlementBoundariesMap;