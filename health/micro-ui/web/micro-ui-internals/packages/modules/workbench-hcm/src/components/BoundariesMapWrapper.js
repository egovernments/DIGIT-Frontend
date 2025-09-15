import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";
import LGABoundariesMap from "./LGABoundariesMap";
import WardBoundariesMap from "./WardBoundariesMap";
import SettlementBoundariesMap from "./SettlementBoundariesMap";

/**
 * Wrapper component that allows toggling between LGA and Ward boundaries with pagination
 */
const BoundariesMapWrapper = ({ 
  visits = [], 
  totalCount = 0,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  isNextDisabled = false,
  showConnectingLines = false,
  customPopupContent = null,
  customMarkerStyle = null,
  mapContainerId = "map",
  isInModal = false
}) => {
  const { t } = useTranslation();
  const [boundaryType, setBoundaryType] = useState("WARD"); // "LGA", "WARD", or "SETTLEMENT"
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleBoundaryTypeChange = (type) => {
    setBoundaryType(type);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSelectOpen && !event.target.closest('.page-size-select')) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectOpen]);

  const pageSizeOptions = [
    { name: "10", code: 10 },
    { name: "20", code: 20 },
    { name: "50", code: 50 },
    { name: "100", code: 100 },
  ];

  return (
    <div style={{ height: isInModal ? '100%' : '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toggle Controls - Simplified for modal */}
      {!isInModal && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
              Boundaries Map
            </h3>
            <div style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#e3f2fd',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: '#1976d2'
            }}>
              {boundaryType}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {["LGA", "WARD", "SETTLEMENT"].map((type) => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value={type}
                  checked={boundaryType === type}
                  onChange={(e) => handleBoundaryTypeChange(e.target.value)}
                  style={{ margin: 0 }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: boundaryType === type ? '600' : '400' }}>
                  {type}
                </span>
              </label>
            ))}
          </div>

          {/* Pagination Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Page Info and Size Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ 
                fontSize: "0.9rem",
                color: "#6c757d",
                fontWeight: "500"
              }}>
                Page {page + 1}
              </div>
              
              <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>|</div>
              
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  style={{
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.85rem",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                  className="page-size-select"
                >
                  {pageSize} per page
                  <span style={{ fontSize: "0.7rem" }}>▼</span>
                </button>
                
                {isSelectOpen && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    marginTop: "2px"
                  }}>
                    {pageSizeOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => {
                          onPageSizeChange && onPageSizeChange(option.code);
                          setIsSelectOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "0.4rem 0.6rem",
                          fontSize: "0.85rem",
                          border: "none",
                          backgroundColor: pageSize === option.code ? "#e3f2fd" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          borderBottom: "1px solid #f0f0f0"
                        }}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#6c757d",
                fontStyle: "italic" 
              }}>
                {visits?.length > 0 && `(${visits.length} ${visits.length === 1 ? 'item' : 'items'})`}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variation="secondary"
                label={t("PREVIOUS")}
                isDisabled={page === 0}
                onClick={() => onPageChange && onPageChange(Math.max(0, page - 1))}
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.85rem"
                }}
              />
              <Button
                variation="secondary"
                label={t("NEXT")}
                isDisabled={isNextDisabled}
                onClick={() => onPageChange && onPageChange(page + 1)}
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.85rem"
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Compact header for modal */}
      {isInModal && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          flexShrink: 0
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: '#495057' }}>
            {boundaryType === "LGA" ? "LGA Boundaries" : 
             boundaryType === "WARD" ? "Ward Boundaries" : 
             "Settlement Boundaries"}
          </h3>
          <span style={{ 
            fontSize: '0.9rem', 
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            {boundaryType === "LGA" 
              ? "Showing Local Government Areas" 
              : boundaryType === "WARD"
              ? "Showing Ward Boundaries"
              : "Showing Settlement Areas"
            }
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Boundary Type Radio Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {[
              { value: "LGA", label: "LGA", color: "#2E7D32" },
              { value: "WARD", label: "Ward", color: "#7B1FA2" },
              { value: "SETTLEMENT", label: "Settlement", color: "#D84315" }
            ].map(({ value, label, color }) => (
              <label 
                key={value}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: boundaryType === value ? 'bold' : 'normal',
                  color: boundaryType === value ? color : '#6c757d'
                }}
              >
                <input
                  type="radio"
                  name="boundaryType"
                  value={value}
                  checked={boundaryType === value}
                  onChange={(e) => handleBoundaryTypeChange(e.target.value)}
                  style={{
                    accentColor: color,
                    transform: 'scale(1.1)'
                  }}
                />
                {t(label)}
              </label>
            ))}
          </div>
      )}
      
      {/* Map Component */}
      <div style={{ flex: 1 }}>
        {boundaryType === "LGA" ? (
          <LGABoundariesMap 
            visits={visits} 
            showConnectingLines={showConnectingLines} 
            customPopupContent={customPopupContent}
            customMarkerStyle={customMarkerStyle}
            mapContainerId={mapContainerId}
          />
        ) : boundaryType === "WARD" ? (
          <WardBoundariesMap 
            visits={visits} 
            showConnectingLines={showConnectingLines} 
            customPopupContent={customPopupContent}
            customMarkerStyle={customMarkerStyle}
            mapContainerId={mapContainerId}
          />
        ) : (
          <SettlementBoundariesMap 
            visits={visits} 
            showConnectingLines={showConnectingLines} 
            customPopupContent={customPopupContent}
            customMarkerStyle={customMarkerStyle}
            mapContainerId={mapContainerId}
          />
        )}
      </div>
    </div>
  );
};

export default BoundariesMapWrapper;