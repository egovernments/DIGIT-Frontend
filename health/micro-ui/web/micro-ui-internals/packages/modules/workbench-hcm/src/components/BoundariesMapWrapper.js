import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LGABoundariesMap from "./LGABoundariesMap";
import WardBoundariesMap from "./WardBoundariesMap";

/**
 * Wrapper component that allows toggling between LGA and Ward boundaries
 */
const BoundariesMapWrapper = ({ visits = [] }) => {
  const { t } = useTranslation();
  const [boundaryType, setBoundaryType] = useState("LGA"); // "LGA" or "WARD"

  const toggleBoundaryType = () => {
    setBoundaryType(prev => prev === "LGA" ? "WARD" : "LGA");
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toggle Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: '#495057' }}>
            {boundaryType === "LGA" ? "LGA Boundaries" : "Ward Boundaries"}
          </h3>
          <span style={{ 
            fontSize: '0.9rem', 
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            {boundaryType === "LGA" 
              ? "Showing Local Government Areas" 
              : "Showing Ward Boundaries"
            }
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Toggle Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              fontSize: '0.9rem', 
              color: boundaryType === "LGA" ? '#2E7D32' : '#6c757d',
              fontWeight: boundaryType === "LGA" ? 'bold' : 'normal'
            }}>
              LGA
            </span>
            
            <div 
              onClick={toggleBoundaryType}
              style={{
                width: '50px',
                height: '24px',
                backgroundColor: boundaryType === "LGA" ? '#4CAF50' : '#7B1FA2',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                border: '2px solid transparent'
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '1px',
                  left: boundaryType === "LGA" ? '2px' : '28px',
                  transition: 'left 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            </div>
            
            <span style={{ 
              fontSize: '0.9rem', 
              color: boundaryType === "WARD" ? '#7B1FA2' : '#6c757d',
              fontWeight: boundaryType === "WARD" ? 'bold' : 'normal'
            }}>
              Ward
            </span>
          </div>
          
          {/* Alternative Button Toggle (commented out, but available) */}
          {/* 
          <button
            onClick={toggleBoundaryType}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: boundaryType === "LGA" ? '#4CAF50' : '#7B1FA2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
          >
            Switch to {boundaryType === "LGA" ? "Ward" : "LGA"} Boundaries
          </button>
          */}
        </div>
      </div>
      
      {/* Map Component */}
      <div style={{ flex: 1 }}>
        {boundaryType === "LGA" ? (
          <LGABoundariesMap visits={visits} />
        ) : (
          <WardBoundariesMap visits={visits} />
        )}
      </div>
    </div>
  );
};

export default BoundariesMapWrapper;