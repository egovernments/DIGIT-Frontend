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
      {/* Toggle Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isInModal ? '0.75rem' : '1rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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

          {/* Pagination Controls - Hide in modal */}
          {!isInModal && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Page Info and Size Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ 
                fontSize: "0.9rem", 
                color: "#495057",
                fontWeight: "500"
              }}>
                {t("PAGE")}: {page + 1}
              </div>
              
              <div className="page-size-select" style={{ position: "relative", display: "inline-block" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    minWidth: "60px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                  <span>{pageSize}</span>
                  <span style={{ marginLeft: "6px", fontSize: "0.7rem" }}>▼</span>
                </div>
                {isSelectOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "white",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 1000,
                      maxHeight: "180px",
                      overflowY: "auto"
                    }}
                  >
                    {pageSizeOptions.map((option) => (
                      <div
                        key={option.code}
                        style={{
                          padding: "6px 10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f8f9fa",
                          fontSize: "0.85rem",
                          backgroundColor: pageSize === option.code ? "#e3f2fd" : "white",
                          color: pageSize === option.code ? "#1976d2" : "inherit"
                        }}
                        onClick={() => {
                          onPageSizeChange && onPageSizeChange(option.code);
                          setIsSelectOpen(false);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = pageSize === option.code ? "#e3f2fd" : "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = pageSize === option.code ? "#e3f2fd" : "white";
                        }}
                      >
                        {option.name}
                      </div>
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
          )}
        </div>
      </div>
      
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