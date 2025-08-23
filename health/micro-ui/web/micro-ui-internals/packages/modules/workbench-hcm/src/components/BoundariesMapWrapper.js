import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";
import LGABoundariesMap from "./LGABoundariesMap";
import WardBoundariesMap from "./WardBoundariesMap";

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
  customMarkerStyle = null
}) => {
  const { t } = useTranslation();
  const [boundaryType, setBoundaryType] = useState("WARD"); // "LGA" or "WARD"
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const toggleBoundaryType = () => {
    setBoundaryType(prev => prev === "LGA" ? "WARD" : "LGA");
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Boundary Toggle Switch */}
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

          {/* Pagination Controls */}
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
          />
        ) : (
          <WardBoundariesMap 
            visits={visits} 
            showConnectingLines={showConnectingLines} 
            customPopupContent={customPopupContent}
            customMarkerStyle={customMarkerStyle}
          />
        )}
      </div>
    </div>
  );
};

export default BoundariesMapWrapper;