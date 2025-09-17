import React, { useState, useMemo } from "react";
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
  isInModal = false,
  showBaseLayer = false
}) => {
  const { t } = useTranslation();
  const [boundaryType, setBoundaryType] = useState("WARD"); // "LGA", "WARD", or "SETTLEMENT"
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showBaseLayers, setShowBaseLayers] = useState(showBaseLayer);
  console.log(visits,'visits',visits?.length);
  
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const handleBoundaryTypeChange = (type) => {
    setBoundaryType(type);
    // Reset filters when changing boundary type
    setSearchTerm('');
    setFilters({});
  };
  
  // Filter utility functions
  const formatValue = (value, key) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (key === 'lat' || key === 'lng') {
      return typeof value === 'number' ? value.toFixed(6) : value;
    }
    
    if (key === 'time' || key.includes('date') || key.includes('Date')) {
      try {
        return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString();
      } catch (e) {
        return value;
      }
    }
    
    return String(value);
  };
  
  // Apply filters to visits data
  const filteredVisits = useMemo(() => {
    let filtered = [...visits];
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(visit => {
        return Object.values(visit).some(value => {
          const stringValue = formatValue(value, '').toLowerCase();
          return stringValue.includes(searchLower);
        });
      });
    }
    
    // Apply column filters
    for (const [filterCol, filterValue] of Object.entries(filters)) {
      if (filterValue && filterValue !== 'all') {
        filtered = filtered.filter(visit => {
          const visitValue = formatValue(visit[filterCol], filterCol);
          return visitValue === filterValue;
        });
      }
    }
    
    return filtered;
  }, [visits, searchTerm, filters]);
  
  // Get unique values for filter dropdowns
  const getUniqueValues = (columnName) => {
    const uniqueValues = [...new Set(
      visits.map(visit => formatValue(visit[columnName], columnName))
        .filter(value => value && value !== 'N/A')
    )].sort();
    return uniqueValues.slice(0, 50);
  };
  
  // Get available filter columns
  const getFilterColumns = () => {
    if (visits.length === 0) return [];
    
    const sampleVisit = visits[0];
    const priorityColumns = ['status', 'name', 'type', 'category', 'wardname', 'lganame', 'statename'];
    const allColumns = Object.keys(sampleVisit);
    
    return priorityColumns.filter(col => {
      const hasColumn = allColumns.includes(col);
      const hasValues = hasColumn && getUniqueValues(col).length > 1;
      return hasValues;
    });
  };
  
  const filterColumns = getFilterColumns();

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
            {filteredVisits.length !== visits.length && (
              <span style={{
                marginLeft: '8px',
                fontSize: '14px',
                color: '#059669',
                fontWeight: '500',
                background: '#ecfdf5',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #d1fae5'
              }}>
                {filteredVisits.length} filtered
              </span>
            )}
          </h3>
          <span style={{ 
            fontSize: '0.9rem', 
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            {boundaryType === "LGA" 
              ? `Showing ${visits.length} records in Local Government Areas` 
              : boundaryType === "WARD"
              ? `Showing ${visits.length} records in Ward Boundaries`
              : `Showing ${visits.length} records in Settlement Areas`
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
            
            {/* Base Layer Toggle - Hide in modal */}
            {!isInModal && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: showBaseLayers ? '#e3f2fd' : '#ffebee',
                borderRadius: '6px',
                border: `1px solid ${showBaseLayers ? '#2196f3' : '#f44336'}`
              }}>
                <input
                  type="checkbox"
                  id="baseLayerToggle"
                  checked={showBaseLayers}
                  onChange={(e) => setShowBaseLayers(e.target.checked)}
                  style={{
                    accentColor: showBaseLayers ? '#2196f3' : '#f44336',
                    transform: 'scale(1.2)'
                  }}
                />
                <label 
                  htmlFor="baseLayerToggle"
                  style={{ 
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: showBaseLayers ? '#1976d2' : '#d32f2f',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  {showBaseLayers ? '🗺️ Base Map' : '🏗️ Shape Only'}
                </label>
              </div>
            )}
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
      
      {/* Centralized Filters Section */}
      {visits.length > 0 && (
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: '#fafafa'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px' }}>
              <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>🔍 Search:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search all columns..."
                style={{
                  padding: '6px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  flex: 1,
                  minWidth: '150px'
                }}
              />
            </div>
            
            {/* Column filters */}
            {filterColumns.map(column => {
              const uniqueValues = getUniqueValues(column);
              if (uniqueValues.length <= 1) return null;
              
              return (
                <div key={column} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', textTransform: 'capitalize' }}>
                    {column}:
                  </span>
                  <select
                    value={filters[column] || 'all'}
                    onChange={(e) => setFilters(prev => ({ ...prev, [column]: e.target.value }))}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '13px',
                      minWidth: '100px'
                    }}
                  >
                    <option value="all">All</option>
                    {uniqueValues.map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              );
            })}
            
            {/* Clear filters */}
            {(searchTerm || Object.values(filters).some(f => f && f !== 'all')) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                }}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #dc2626',
                  borderRadius: '4px',
                  background: '#fff',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
      
      <div style={{ flex: 1 }}>
        {boundaryType === "LGA" ? (
          <LGABoundariesMap 
            visits={filteredVisits} 
            showConnectingLines={showConnectingLines} 
            customPopupContent={customPopupContent}
            customMarkerStyle={customMarkerStyle}
            mapContainerId={mapContainerId}
            showBaseLayer={showBaseLayers}
          />
        ) : boundaryType === "WARD" ? (
          <WardBoundariesMap 
            visits={filteredVisits} 
            showConnectingLines={showConnectingLines} 
            customPopupContent={customPopupContent}
            customMarkerStyle={customMarkerStyle}
            mapContainerId={mapContainerId}
            showBaseLayer={showBaseLayers}
          />
        ) : (
          <SettlementBoundariesMap 
            visits={filteredVisits} 
            showConnectingLines={showConnectingLines} 
            customPopupContent={customPopupContent}
            customMarkerStyle={customMarkerStyle}
            mapContainerId={mapContainerId}
            showBaseLayer={showBaseLayers}
          />
        )}
      </div>
    </div>
  );
};

export default BoundariesMapWrapper;